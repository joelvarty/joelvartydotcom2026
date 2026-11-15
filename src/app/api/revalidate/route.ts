import { revalidatePath, revalidateTag } from "next/cache";
import { after, NextRequest } from "next/server";
import agilitySDK from "@agility/content-fetch"
import type { SitemapNode } from "@/lib/types/SitemapNode";
import { publishToSubstack } from "@/lib/substack/publishToSubstack";
import { defaultLocale } from "@/lib/i18n/config";

interface IRevalidateRequest {
	state: string,
	instanceGuid: string
	languageCode?: string
	referenceName?: string
	contentID?: number
	contentVersionID?: number
	pageID?: number
	pageVersionID?: number
	changeDateUTC?: string
}

/**
 * The Agility publish webhook.
 *
 * Every published read in src/lib/cms/ is a `"use cache"` entry tagged by what
 * it read, and this handler clears those tags. The tag strings here are a
 * CONTRACT with src/lib/cms/: change one side and you must change the other in
 * the same commit, or publishing silently stops updating the site.
 *
 *   getContentItem    agility-content-{contentID}-{locale}
 *   getContentList    agility-content-{referenceName lowercased}-{locale}
 *   getPage           agility-page-{pageID}-{locale}
 *   getSitemapFlat    agility-sitemap-flat-{locale}
 *   getSitemapNested  agility-sitemap-nested-{locale}
 *
 * `revalidateTag(tag, "max")`: Next 16 requires a cacheLife profile; "max"
 * marks the entry stale so the next request serves it once while refetching.
 */
export async function POST(req: NextRequest) {

	//parse the body
	const data = await req.json() as IRevalidateRequest

	console.info("[revalidate] Received webhook:", JSON.stringify(data))

	//a publish makes content live; a delete/unpublish takes it offline. Both can
	//change the sitemap (a node added, renamed or removed), so both clear it.
	const isPublish = data.state === "Published"
	const isRemoval = data.state === "Deleted" || data.state === "Unpublished"
	const languageCode = data.languageCode || defaultLocale

	const revalidateSitemapTags = () => {
		revalidateTag(`agility-sitemap-flat-${languageCode}`, "max")
		revalidateTag(`agility-sitemap-nested-${languageCode}`, "max")
	}

	const hasContentOrPage = !!data.referenceName
		|| (data.contentID !== undefined && data.contentID > 0)
		|| (data.pageID !== undefined && data.pageID > 0)

	if ((isPublish || isRemoval) && hasContentOrPage) {

		let sitemapFlat: { [path: string]: SitemapNode } = {}

		//on publish, read the LATEST sitemap (uncached) so we can also clear the
		//path that renders this item or page. On a removal the node is already gone.
		if (isPublish) {
			const agilityClient = agilitySDK.getApi({
				guid: process.env.AGILITY_GUID,
				apiKey: process.env.AGILITY_API_FETCH_KEY,
			})
			agilityClient.config.fetchConfig = { cache: "no-store" }

			try {
				sitemapFlat = await agilityClient.getSitemapFlat({
					channelName: process.env.AGILITY_SITEMAP || "website",
					languageCode,
				}) || {}
			} catch (error) {
				console.error("[revalidate] Could not read the sitemap; clearing tags only.", error)
			}
		}

		//every publish can add or rename a page or a dynamic item's URL, and the
		//sitemap also feeds sitemap.xml, the blog listing URLs and the proxy's 404 check
		revalidateSitemapTags()

		if (data.referenceName) {
			//content item change: the item itself, and every list it belongs to
			const listTag = `agility-content-${data.referenceName.toLowerCase()}-${languageCode}`
			revalidateTag(listTag, "max")
			if (data.contentID) {
				revalidateTag(`agility-content-${data.contentID}-${languageCode}`, "max")
			}
			console.info("[revalidate] Content tags:", listTag, data.contentID)

			const sitemapNode = Object.values(sitemapFlat).find(s => s.contentID === data.contentID)
			if (sitemapNode) {
				revalidatePath(sitemapNode.path)
				console.info("[revalidate] Path:", sitemapNode.path)
			}

			// A published blog post is also cross-posted to Substack, after the response is sent
			if (isPublish && data.referenceName.toLowerCase() === "posts" && data.contentID) {
				after(async () => {
					console.info("[substack] Triggering async publish for contentID:", data.contentID)
					await publishToSubstack({
						contentID: data.contentID!,
						languageCode,
					})
				})
			}

		} else if (data.pageID !== undefined && data.pageID > 0) {
			//page change
			const pageTag = `agility-page-${data.pageID}-${languageCode}`
			revalidateTag(pageTag, "max")
			console.info("[revalidate] Page tag:", pageTag)

			const sitemapNode = Object.values(sitemapFlat).find(s => s.pageID === data.pageID)
			if (sitemapNode) {
				revalidatePath(sitemapNode.path)
				console.info("[revalidate] Path:", sitemapNode.path)
			}
		} else if (data.contentID !== undefined && data.contentID > 0) {
			//content item change without a referenceName
			revalidateTag(`agility-content-${data.contentID}-${languageCode}`, "max")
			const sitemapNode = Object.values(sitemapFlat).find(s => s.contentID === data.contentID)
			if (sitemapNode) {
				revalidatePath(sitemapNode.path)
				console.info("[revalidate] Path from contentID:", sitemapNode.path)
			}
		}

	} else if (data.contentID === undefined && data.pageID === undefined) {
		//no content or page id: a URL redirection was published.
		//Trigger the rebuild hook so the prebuild step refreshes data/redirections.json.
		const hookUrl = process.env.BUILD_HOOK_URL
		if (hookUrl) {
			await fetch(hookUrl, {
				method: 'POST'
			})
		}
	}

	return new Response(`OK`, {
		status: 200
	})
}
