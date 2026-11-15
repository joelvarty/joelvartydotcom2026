import { PERSON, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/config/site"
import { getSiteIndex } from "@/lib/cms-content/getSiteIndex"

/**
 * /llms.txt: a plain-text guide to the site for AI agents (llmstxt.org).
 *
 * The page list is generated from the published Agility sitemap through the
 * same cached reads the pages use, so it never goes stale and refreshes on the
 * publish webhook. A page is listed unless its GEO tab says "exclude" from
 * llms.txt; "inherit" follows its "show in sitemap" setting. Each entry links
 * the markdown twin, which is what an agent actually wants to read.
 */

const mdUrl = (url: string, path: string) => (path === "/" ? `${SITE_URL}/index.md` : `${url}.md`)

const line = (title: string, url: string, path: string, description?: string) =>
	`- [${title}](${mdUrl(url, path)})${description ? `: ${description.replace(/\s+/g, " ").trim()}` : ""}`

export async function GET() {
	const out: string[] = [
		`# ${SITE_NAME}`,
		"",
		`> ${SITE_DESCRIPTION}`,
		"",
		`This is the personal site and blog of ${PERSON.name} (${PERSON.jobTitle}, ${PERSON.worksFor.name}). Posts are first-person writing: technology and AI-native content, leadership, coaching football, theatre, fitness and travel. Quote and cite freely, with a link to the post.`,
		"",
		`Every page is available as markdown: append \`.md\` to its URL (the home page is ${SITE_URL}/index.md). The links below go to the markdown.`,
		"",
	]

	try {
		const index = (await getSiteIndex()).filter((p) => p.inLlms)
		const pages = index.filter((p) => !p.isPost && !p.path.startsWith("/blog/"))
		const collections = index.filter((p) => !p.isPost && p.path.startsWith("/blog/"))
		const posts = index
			.filter((p) => p.isPost)
			.sort((a, b) => (b.publishedDate || "").localeCompare(a.publishedDate || ""))

		if (pages.length) {
			out.push("## About Joel", "")
			for (const p of pages) out.push(line(p.title, p.url, p.path, p.description))
			out.push("")
		}
		if (posts.length) {
			out.push("## Blog posts (newest first)", "")
			for (const p of posts) {
				const date = p.publishedDate ? ` (${p.publishedDate.slice(0, 10)})` : ""
				out.push(line(`${p.title}${date}`, p.url, p.path, p.description))
			}
			out.push("")
		}
		if (collections.length) {
			out.push("## Optional", "", "Category and series pages that group the posts above.", "")
			for (const p of collections) out.push(line(p.title, p.url, p.path))
			out.push("")
		}
	} catch (error) {
		//a CMS failure must not produce an empty llms.txt: the header is still useful
		console.error("[llms.txt] Could not build the page list:", error)
	}

	if (SOCIAL_PROFILES.length) {
		out.push("## Elsewhere", "")
		for (const p of SOCIAL_PROFILES) out.push(`- [${p.name}](${p.url})`)
		out.push(`- [RSS feed](${SITE_URL}/blog/rss.xml)`, "")
	}

	return new Response(out.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	})
}
