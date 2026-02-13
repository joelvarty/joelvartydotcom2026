import "server-only";
import { getAgilityPageProps } from "@agility/nextjs/node";
import { getAgilityContext } from "./getAgilityContext";
import agilitySDK from "@agility/content-fetch"

export interface PageProps {
	params: Promise<{ slug: string[], locale: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Get a page with caching information added.
 */
export const getAgilityPage = async ({ params }: PageProps) => {
	const awaitedParams = await params
	const { isPreview: preview, locale } = await getAgilityContext(awaitedParams.locale)

	if (!awaitedParams.slug) awaitedParams.slug = [""]

	//check the last element of the slug to see if it has search params encoded (from middleware)
	let lastSlug = awaitedParams.slug[awaitedParams.slug.length - 1]
	let searchParams: { [key: string]: string } = {}
	if (lastSlug && lastSlug.startsWith("~~~") && lastSlug.endsWith("~~~")) {
		//we have search params encoded here
		lastSlug = lastSlug.replace(/~~~+/g, "")
		const decoded = decodeURIComponent(lastSlug)
		const parts = decoded.split("&").map(part => part.trim())

		parts.forEach(part => {
			const kvp = part.split("=")
			if (kvp.length === 2) {
				searchParams[kvp[0]] = kvp[1]
			}
		})

		awaitedParams.slug = awaitedParams.slug.slice(0, awaitedParams.slug.length - 1)
		if (awaitedParams.slug.length === 0) awaitedParams.slug = [""]
	}

	const path = "/" + awaitedParams.slug.join("/")
	console.info(`[getAgilityPage] Rendering path="${path}" locale="${locale}" preview=${preview}`)

	//get the page
	const page = await getAgilityPageProps({
		params: awaitedParams, preview, locale, apiOptions: {
			contentLinkDepth: 0
		}
	})

	if (!page.page) {
		// Page not found - fetch sitemap directly for diagnostics
		console.warn(`[getAgilityPage] Page NOT found for path="${path}". Running diagnostics...`)

		const apiKey = preview ? process.env.AGILITY_API_PREVIEW_KEY : process.env.AGILITY_API_FETCH_KEY
		const diagClient = agilitySDK.getApi({
			guid: process.env.AGILITY_GUID,
			apiKey,
			isPreview: preview
		})

		// Fetch sitemap with no cache to see live state
		diagClient.config.fetchConfig = { cache: "no-store" }
		const channelName = process.env.AGILITY_SITEMAP || "website"
		const sitemap = await diagClient.getSitemapFlat({ channelName, languageCode: locale })

		if (sitemap) {
			const sitemapKeys = Object.keys(sitemap)
			const matchingNode = sitemap[path]
			const blogPaths = sitemapKeys.filter(k => k.startsWith("/blog/"))
			console.warn(`[getAgilityPage] Diagnostic sitemap (no-cache): total paths=${sitemapKeys.length}, blog paths=${blogPaths.length}`)
			console.warn(`[getAgilityPage] Exact match for "${path}": ${matchingNode ? JSON.stringify(matchingNode) : "NOT FOUND"}`)
			if (blogPaths.length <= 20) {
				console.warn(`[getAgilityPage] All blog paths: ${JSON.stringify(blogPaths)}`)
			} else {
				console.warn(`[getAgilityPage] First 20 blog paths: ${JSON.stringify(blogPaths.slice(0, 20))}`)
			}
		} else {
			console.warn(`[getAgilityPage] Diagnostic: sitemap is NULL/undefined!`)
		}
	} else {
		console.info(`[getAgilityPage] Page found for path="${path}" pageID=${page.sitemapNode?.pageID} contentID=${page.sitemapNode?.contentID}`)
	}

	page.globalData = page.globalData || {};
	page.globalData["searchParams"] = searchParams;
	page.globalData["path"] = path;

	return page
}

