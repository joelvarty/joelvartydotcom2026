import { type ContentList } from "@agility/content-fetch"
import { getContentList } from "@/lib/cms/getContentList"
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat"
import { defaultLocale } from "@/lib/i18n/config"

/**
 * Blog post interface (minimal for listing)
 */
export interface IBlogPostMin {
	contentID: number
	title: string
	slug: string
	excerpt?: string
	publishedDate?: string
	featuredImage?: {
		url: string
		label: string
	}
	url: string
	category?: {
		contentID: number
		title: string
		slug: string
	}
	tags?: {
		contentID: number
		name: string
	}[]
}

interface GetSeriesListingProps {
	seriesID: number
	locale: string
	skip: number
	take: number
	sort?: string
	direction?: "asc" | "desc"
}

/**
 * Get a list of blog posts for a specific series and resolve the URLs for each post from the sitemap.
 * Returns posts with resolved URLs and total count for pagination.
 * Note: Agility CMS returns expanded category and tags objects in the response.
 */
export const getSeriesListing = async ({
	seriesID,
	locale,
	sort = "publishedDate",
	direction = "desc",
	skip,
	take,
}: GetSeriesListingProps) => {
	try {
		// Get sitemap to resolve dynamic URLs
		const sitemapNodes = await getSitemapFlat({
			channelName: process.env.AGILITY_SITEMAP || "website",
			languageCode: locale,
		})

		// Get posts from container filtered by seriesID
		const rawPosts: ContentList = await getContentList({
			referenceName: "posts",
			languageCode: locale,
			take,
			skip,
			sort: `fields.${sort}`,
			direction,
			filters: [{ property: "fields.seriesID", operator: "eq", value: `${seriesID}` }],
		})

		// Resolve dynamic URLs from sitemap
		const dynamicUrls = resolvePostUrls(sitemapNodes, rawPosts.items)

		// Map posts to simplified format with resolved URLs
		// Agility returns expanded category and tags objects directly
		const posts: IBlogPostMin[] = rawPosts.items.map((post: any) => {
			const slug = post.fields?.Slug || post.fields?.slug || ""
			let url = dynamicUrls[post.contentID] || `/blog/${slug}`

			// Add locale prefix if not default locale
			if (locale !== defaultLocale) {
				url = `/${locale}${url}`
			}

			// Extract category from expanded object (check for valid contentID)
			const categoryObj = post.fields?.category
			const category = categoryObj?.contentID ? {
				contentID: categoryObj.contentID,
				title: categoryObj.fields?.name || categoryObj.fields?.Name || "",
				slug: categoryObj.fields?.slug || categoryObj.fields?.Slug || "",
			} : undefined

			// Extract tags from expanded array
			const tagsArray = post.fields?.tags
			const tags: { contentID: number; name: string }[] = tagsArray?.map((tag: any) => ({
				contentID: tag.contentID,
				name: tag.fields?.name || tag.fields?.Name || "",
			})) || []

			return {
				contentID: post.contentID,
				title: post.fields?.title || "",
				slug,
				excerpt: post.fields?.excerpt || "",
				publishedDate: post.fields?.publishedDate || "",
				featuredImage: post.fields?.featuredImage || undefined,
				url,
				category,
				tags: tags.length > 0 ? tags : undefined,
			}
		})

		return {
			totalCount: rawPosts.totalCount,
			posts,
		}
	} catch (error) {
		throw new Error(`Error loading data for SeriesListing: ${error}`)
	}
}

/**
 * Resolve post URLs from sitemap by matching contentID
 */
const resolvePostUrls = function (sitemap: any, posts: any[]): Record<number, string> {
	const dynamicUrls: Record<number, string> = {}

	posts.forEach((post: any) => {
		Object.keys(sitemap).forEach((path) => {
			if (sitemap[path].contentID === post.contentID) {
				dynamicUrls[post.contentID] = path
			}
		})
	})

	return dynamicUrls
}
