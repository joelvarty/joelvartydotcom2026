import "server-only"

import { resolvePageGeo, type GeoContentItem, type GeoPage } from "@agility/geo"
import { SITE_DESCRIPTION, SITE_URL } from "@/config/site"
import { getContentList } from "@/lib/cms/getContentList"
import { getPage } from "@/lib/cms/getPage"
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat"
import { toPublicPath } from "@/lib/cms/homePage"
import { defaultLocale } from "@/lib/i18n/config"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import type { SitemapNode } from "@/lib/types/SitemapNode"

/** One public page, with what the machine-readable surfaces need to know about it. */
export interface SiteIndexEntry {
	/** The public path (`/` for the home node). */
	path: string
	url: string
	title: string
	/** GEO Summary, else SEO description, else (for a post) its excerpt. */
	description?: string
	isPost: boolean
	publishedDate?: string
	/** When the post last changed in the CMS. */
	modified?: string
	/** The node's "show in sitemap" setting. */
	inSitemap: boolean
	/** The GEO tab's llms.txt setting, resolved: `inherit` follows `inSitemap`. */
	inLlms: boolean
	/** The GEO tab's AI crawlers setting is `block`. */
	aiCrawlBlocked: boolean
}

interface PostItem extends GeoContentItem {
	contentID: number
	properties?: { modified?: string }
	fields: { title?: string; excerpt?: string; publishedDate?: string }
}

/** Every published post, newest first (the list is cached and tagged like any other read). */
export const getAllPosts = async (locale: string): Promise<PostItem[]> => {
	const take = 50
	const posts: PostItem[] = []
	for (let skip = 0; ; skip += take) {
		const res = await getContentList<PostItem>({
			referenceName: "posts",
			languageCode: locale,
			take,
			skip,
			sort: "fields.publishedDate",
			direction: "desc",
			preview: false,
		})
		posts.push(...res.items)
		if (res.items.length < take || posts.length >= res.totalCount) break
	}
	return posts
}

/**
 * The site's public pages, from the PUBLISHED sitemap, with each page's (and
 * each post's) GEO tab settings resolved by `@agility/geo`.
 *
 * Shared by sitemap.xml, llms.txt and robots.txt so all three agree on what a
 * page's URL is (the home node is `/`) and on the editor's per-page choices.
 * Every read goes through the cached getters, so the publish webhook refreshes
 * this along with the pages.
 */
export const getSiteIndex = async (locale: string = defaultLocale): Promise<SiteIndexEntry[]> => {
	const sitemap = await getSitemapFlat({
		channelName: process.env.AGILITY_SITEMAP || "website",
		languageCode: locale,
		preview: false,
	}) as { [path: string]: SitemapNode }

	const posts = await getAllPosts(locale)
	const postsById = new Map(posts.map((p) => [p.contentID, p]))

	const nodes = Object.values(sitemap).filter((n) => !n.isFolder && !n.redirect)

	//one cached getPage per distinct page (every post shares its dynamic page)
	const pageIDs = [...new Set(nodes.map((n) => n.pageID).filter((id): id is number => !!id))]
	const pages = new Map<number, GeoPage>()
	await Promise.all(pageIDs.map(async (pageID) => {
		try {
			const page = await getPage({ pageID, languageCode: locale, preview: false })
			if (page) pages.set(pageID, page as GeoPage)
		} catch (error) {
			console.error(`[site-index] Could not read page ${pageID}:`, error)
		}
	}))

	return nodes.map((node) => {
		const page = (node.pageID && pages.get(node.pageID)) || {}
		const post = node.contentID ? postsById.get(node.contentID) : undefined
		const geo = resolvePageGeo({ page, item: post })
		const inSitemap = node.visible?.sitemap !== false
		const path = toPublicPath(node.path, sitemap)

		return {
			path,
			url: SITE_URL + localizeUrl(path, locale),
			title: post?.fields.title || node.title || node.name || path,
			description: geo.description || post?.fields.excerpt || (path === "/" ? SITE_DESCRIPTION : undefined),
			isPost: !!post,
			publishedDate: post?.fields.publishedDate,
			modified: post?.properties?.modified,
			inSitemap,
			inLlms: geo.ai.llmsInclude === "include" || (geo.ai.llmsInclude === "inherit" && inSitemap),
			aiCrawlBlocked: geo.ai.crawl === "block",
		}
	})
}
