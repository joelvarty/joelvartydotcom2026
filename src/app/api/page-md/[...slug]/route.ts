import type { NextRequest } from "next/server"
import { getAgilityPage } from "@/lib/cms/getAgilityPage"
import { getAgilityContext } from "@/lib/cms/getAgilityContext"
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat"
import { pageToMarkdown } from "@/lib/cms-content/pageToMarkdown"
import type { SitemapNode } from "@/lib/types/SitemapNode"
import { SITE_URL } from "@/config/site"
import { toPublicPath } from "@/lib/cms/homePage"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import { defaultLocale, locales, getLocaleFromPathname, removeLocaleFromPathname } from "@/lib/i18n/config"

/**
 * The markdown twin of any page.
 *
 * Not called directly: src/proxy.ts rewrites `GET /{path}.md` here (the home
 * page is `/index.md`). Data comes from the same cached getters as the HTML
 * page, so the markdown refreshes on the same publish webhook.
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ slug: string[] }> }
) {
	const { slug } = await params
	const rawPath = "/" + (slug || []).join("/")

	const localePrefix = getLocaleFromPathname(rawPath, locales)
	const locale = localePrefix || defaultLocale
	const localePath = localePrefix ? (removeLocaleFromPathname(rawPath, localePrefix) || "/") : rawPath
	const path = localePath === "/index" ? "/" : localePath
	const pageSlug = path.split("/").filter(Boolean)

	try {
		const agilityData = await getAgilityPage({
			params: Promise.resolve({ slug: pageSlug.length ? pageSlug : [""], locale }),
		})
		if (!agilityData.page || agilityData.notFound) {
			return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } })
		}

		const { isPreview, sitemap: channelName } = await getAgilityContext(locale)
		const sitemap = await getSitemapFlat({ channelName, languageCode: locale, preview: isPreview }) as { [path: string]: SitemapNode }
		const markdown = await pageToMarkdown(agilityData, sitemap)
		const canonical = SITE_URL + localizeUrl(toPublicPath(agilityData.sitemapNode.path, sitemap), locale)

		return new Response(markdown, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"CDN-Cache-Control": isPreview ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=86400",
				//the HTML page is the one to index and cite; this is its plain-text twin
				"Link": `<${canonical}>; rel="canonical"`,
			},
		})
	} catch (error) {
		console.error(`[page-md] Could not build markdown for "${rawPath}":`, error)
		return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } })
	}
}
