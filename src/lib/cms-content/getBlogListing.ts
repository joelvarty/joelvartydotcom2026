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
}

interface GetBlogListingProps {
	categoryID?: number
	locale: string
	skip: number
	take: number
	sort?: string
	direction?: "asc" | "desc"
}

/**
 * Get a list of blog posts and resolve the URLs for each post from the sitemap.
 * Returns posts with resolved URLs and total count for pagination.
 */
export const getBlogListing = async ({
	categoryID,
	locale,
	sort = "publishedDate",
	direction = "desc",
	skip,
	take,
}: GetBlogListingProps) => {
	try {
		// Get sitemap to resolve dynamic URLs
		const sitemapNodes = await getSitemapFlat({
			channelName: process.env.AGILITY_SITEMAP || "website",
			languageCode: locale,
		})

		// Get posts from container
		const rawPosts: ContentList = await getContentList({
			referenceName: "posts",
			languageCode: locale,
			take,
			skip,
			sort: `fields.${sort}`,
			direction,
			filters: categoryID ? [{ property: "fields.categoryID", operator: "eq", value: `${categoryID}` }] : [],
		})

		// Resolve dynamic URLs from sitemap
		const dynamicUrls = resolvePostUrls(sitemapNodes, rawPosts.items)

		// Map posts to simplified format with resolved URLs
		const posts: IBlogPostMin[] = rawPosts.items.map((post: any) => {
			const slug = post.fields?.Slug || post.fields?.slug || ""
			let url = dynamicUrls[post.contentID] || `/blog/${slug}`

			// Add locale prefix if not default locale
			if (locale !== defaultLocale) {
				url = `/${locale}${url}`
			}

			return {
				contentID: post.contentID,
				title: post.fields?.title || "",
				slug,
				excerpt: post.fields?.excerpt || "",
				publishedDate: post.fields?.publishedDate || "",
				featuredImage: post.fields?.featuredImage || undefined,
				url,
			}
		})

		return {
			totalCount: rawPosts.totalCount,
			posts,
		}
	} catch (error) {
		throw new Error(`Error loading data for BlogListing: ${error}`)
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

