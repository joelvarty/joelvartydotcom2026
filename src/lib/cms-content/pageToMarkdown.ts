import "server-only"

import type { AgilityPageProps } from "@agility/nextjs"
import { PERSON, SITE_URL } from "@/config/site"
import { getContentItem } from "@/lib/cms/getContentItem"
import { getContentList } from "@/lib/cms/getContentList"
import { toPublicPath } from "@/lib/cms/homePage"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import type { SitemapNode } from "@/lib/types/SitemapNode"
import { youTubeId, youTubeWatchUrl } from "@/lib/video/youtube"
import { getAllPosts } from "./getSiteIndex"
import { htmlToMarkdown } from "./htmlToMarkdown"

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fields = Record<string, any>

/**
 * Make a post's markdown readable outside this site: `embed` fences become a
 * plain "Video:" link, gallery fences become an image list.
 */
const portableMarkdown = (markdown: string): string =>
	markdown
		.replace(/\r\n/g, "\n")
		//site-relative links and images work only on the site: make them absolute
		.replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`)
		.replace(/```embed\s*\n([\s\S]*?)```/g, (_, body: string) =>
			body.split("\n").map((l) => l.trim()).filter(Boolean).map((url) => {
				const id = youTubeId(url)
				return id ? `Video: ${youTubeWatchUrl(id)}` : url
			}).join("\n\n"))
		.replace(/```gallery[^\n]*\n([\s\S]*?)```/g, (_, body: string) =>
			body.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
				const m = l.match(/^(\S+)(?:\s+"([^"]*)")?/)
				return m ? `![${m[2] || ""}](${m[1]})` : l
			}).join("\n"))

/** The page title is the H1, so a component's own headings move down a level when it has an H1. */
const underTitle = (markdown: string): string =>
	/^#\s/m.test(markdown) ? markdown.replace(/^(#{1,5})(\s)/gm, "#$1$2") : markdown

const postLine = (p: { fields: Fields }, url: string) => {
	const date = p.fields.publishedDate ? ` (${String(p.fields.publishedDate).slice(0, 10)})` : ""
	const excerpt = p.fields.excerpt ? `: ${String(p.fields.excerpt).replace(/\s+/g, " ").trim()}` : ""
	return `- [${p.fields.title}${date}](${url})${excerpt}`
}

/**
 * Render a page as clean markdown for AI agents (served at `{url}.md`).
 *
 * A blog post is already markdown in the CMS, so its body is passed through
 * with a short header (title, date, author, canonical URL). Other pages walk
 * their components and render the ones this site uses; a component it doesn't
 * know contributes its text-like fields, so new components still show up.
 */
export const pageToMarkdown = async (
	agilityData: AgilityPageProps,
	sitemap: { [path: string]: SitemapNode },
): Promise<string> => {
	const { page, sitemapNode, dynamicPageItem, languageCode, isPreview } = agilityData
	const locale = languageCode || "en-us"
	const preview = isPreview === true
	const publicPath = toPublicPath(sitemapNode?.path, sitemap)
	const url = SITE_URL + localizeUrl(publicPath, locale)
	const out: string[] = []
	const item = dynamicPageItem as { contentID: number; properties?: { definitionName?: string }; fields: Fields } | undefined

	const urlFor = (contentID: number, slug?: string) => {
		const node = Object.values(sitemap).find((n) => n.contentID === contentID)
		return SITE_URL + localizeUrl(node?.path || `/blog/${slug ?? ""}`, locale)
	}

	// --- a blog post
	if (item?.properties?.definitionName === "BlogPost") {
		const f = item.fields
		let body = String(f.content || "").trim()
		const h1 = body.match(/^#\s+(.+?)\s*$/m)
		const title = h1 ? h1[1] : f.title
		if (h1) body = body.replace(/^#\s+.+?$\n?/m, "").trim()

		out.push(`# ${title}`, "")
		const meta = [
			f.publishedDate ? `Published ${String(f.publishedDate).slice(0, 10)}` : null,
			`by ${PERSON.name}`,
			url,
		].filter(Boolean)
		out.push(meta.join(" · "), "")
		const summary = (item as { geo?: { summary?: string } }).geo?.summary || f.excerpt
		if (summary) out.push(`> ${String(summary).replace(/\s+/g, " ").trim()}`, "")
		if (f.featuredImage?.url) out.push(`![${f.featuredImage.label || ""}](${f.featuredImage.url})`, "")
		const videoId = youTubeId(f.videoUrl)
		if (videoId) out.push(`Video: ${youTubeWatchUrl(videoId)}`, "")
		out.push(portableMarkdown(body), "")
		return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n"
	}

	// --- any other page: its components
	out.push(`# ${publicPath === "/" ? PERSON.name : (sitemapNode?.title ?? page?.title ?? "Untitled")}`, "")
	if (page?.seo?.metaDescription) out.push(`> ${page.seo.metaDescription}`, "")

	for (const zoneName of Object.keys(page?.zones ?? {})) {
		for (const instance of page?.zones?.[zoneName] ?? []) {
			const ref = instance.item as { contentid?: number; contentID?: number } | undefined
			const contentID = ref?.contentid ?? ref?.contentID
			if (!contentID) continue

			try {
				const component = await getContentItem<Fields>({ contentID, languageCode: locale, preview })
				const f = (component?.fields ?? {}) as Fields

				switch (instance.module) {
					case "BasicMarkdown":
						if (f.markdown) out.push(underTitle(portableMarkdown(String(f.markdown))), "")
						break
					case "RichTextArea":
						if (f.textblob) out.push(underTitle(htmlToMarkdown(String(f.textblob))), "")
						break
					case "Hero":
						if (f.title) out.push(`## ${f.title}`, "")
						if (f.subtitle) out.push(String(f.subtitle), "")
						break
					case "CareerTimeline": {
						if (f.title) out.push(`## ${f.title}`, "")
						const list = await getContentList<{ fields: Fields }>({ referenceName: f.containerReferenceName || "CareerEntries", languageCode: locale, preview, sort: "startDate desc" })
						for (const e of list.items) {
							const end = e.fields.endDate && !e.fields.currentRole ? String(e.fields.endDate).slice(0, 7) : "present"
							out.push(`### ${e.fields.title}, ${e.fields.company} (${String(e.fields.startDate || "").slice(0, 7)} to ${end})`, "")
							//entry headings sit under the ### entry title
							if (e.fields.markdown) out.push(String(e.fields.markdown).trim().replace(/^(#{1,2})(\s)/gm, "##$1$2"), "")
						}
						break
					}
					case "UsesSection": {
						if (f.title) out.push(`## ${f.title}`, "")
						const list = await getContentList<{ fields: Fields }>({ referenceName: "UsesItems", languageCode: locale, preview, take: 250 })
						const items = list.items.filter((i) => !f.categoryFilter || i.fields.category === f.categoryFilter)
						for (const i of items) {
							const link = i.fields.link?.href ? ` (${i.fields.link.href})` : ""
							out.push(`- **${i.fields.name}**${link}${i.fields.description ? `: ${String(i.fields.description).replace(/\s+/g, " ").trim()}` : ""}`)
						}
						out.push("")
						break
					}
					case "BlogListing":
					case "SeriesLanding": {
						const posts = await getAllPosts(locale)
						let shown = posts
						if (item && instance.module === "SeriesLanding") shown = posts.filter((p) => Number((p.fields as Fields).seriesID) === item.contentID).reverse()
						else if (item) shown = posts.filter((p) => Number((p.fields as Fields).categoryID) === item.contentID)
						else if (publicPath === "/") shown = posts.slice(0, 10)
						const heading = f.title || (item ? item.fields.name || item.fields.title : "Blog posts")
						out.push(`## ${heading}`, "")
						if (item?.fields.markdownSummary) out.push(underTitle(portableMarkdown(String(item.fields.markdownSummary))), "")
						for (const p of shown) out.push(postLine(p as { fields: Fields }, urlFor(p.contentID, (p.fields as Fields).slug) + ".md"))
						out.push("")
						break
					}
					case "SubstackSubscribe":
						break
					default:
						for (const key of ["title", "heading", "textblob", "markdown", "content", "description"]) {
							const v = f[key]
							if (typeof v === "string" && v.trim()) out.push(key === "textblob" ? htmlToMarkdown(v) : v.trim(), "")
						}
				}
			} catch (error) {
				//one unreadable component must not blank the whole page
				console.error(`[page-md] Could not read component ${contentID}:`, error)
			}
		}
	}

	out.push("---", "", `Canonical: ${url}`, "")
	return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n"
}
