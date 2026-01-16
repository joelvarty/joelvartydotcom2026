/**
 * BlogDetails Component
 *
 * An Agility CMS module component that displays a single blog post.
 * Can work with dynamic pages (that reference a blog post) or fetch by contentID.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { getContentList } from "@/lib/cms/getContentList"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import { notFound } from "next/navigation"
import { processMarkdown } from "@/lib/markdown/processMarkdown"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import Link from "next/link"
import { SeriesLink } from "./SeriesLink"

/**
 * Interface defining the structure of the BlogDetails module fields.
 */
export interface BlogDetailsFields {
	containerReferenceName?: string
	contentID?: string
}

/**
 * BlogPost interface (from BlogPost content model)
 * Matches the structure returned by getContentItem
 */
type BlogPost = {
	contentID: number
	fields: {
		title: string
		slug: string
		excerpt?: string
		content?: string
		publishedDate?: string
		featuredImage?: {
			url: string
			label: string
		}
		categoryID?: number
		seriesID?: number
		tagIDs?: string
	}
}

/**
 * BlogDetails Component
 *
 * Fetches and renders a single blog post.
 * For dynamic pages, the blog post is available as dynamicPageItem.
 * For static pages, can fetch by contentID field or slug.
 *
 * @param module - The Agility CMS module object
 * @param languageCode - The language code for localized content
 * @param dynamicPageItem - The blog post content item (for dynamic pages)
 * @param page - The page object (may contain sitemapNode with contentID for dynamic pages)
 * @returns A section element with the blog post content
 */
const BlogDetails = async ({ module, languageCode, dynamicPageItem, page }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { containerReferenceName, contentID },
		contentID: moduleContentID,
	} = await getContentItem<BlogDetailsFields>({
		contentID: module.contentid,
		languageCode,
	})

	const containerName = containerReferenceName || "Posts"

	let post: BlogPost | null = null

	// For dynamic pages, the blog post is available as dynamicPageItem
	if (dynamicPageItem) {
		post = dynamicPageItem as unknown as BlogPost
	}

	// If not found, try contentID from module fields
	if (!post && contentID) {
		try {
			const contentItem = await getContentItem({
				contentID: parseInt(contentID, 10),
				languageCode,
			})
			post = contentItem as unknown as BlogPost
		} catch (error) {
			// Fall through to slug method
		}
	}

	// If still not found, try to get from slug
	if (!post) {
		// Get slug from sitemapNode path or from the page path
		const sitemapNode = (page as any)?.sitemapNode
		const pagePath = sitemapNode?.path || ""
		// Extract the last segment of the path (e.g., "why-i-love-football" from "/blog/why-i-love-football")
		const slug = pagePath.split("/").filter(Boolean).pop() || ""

		if (slug) {
			// Fetch all posts and filter client-side by slug
			const allPosts = await getContentList({
				referenceName: containerName,
				languageCode,
				take: 100, // Get enough to find the post
			})
			// Match by Slug field (case-insensitive comparison)
			const matchingPost = allPosts.items.find((p: any) => {
				const postSlug = p.fields?.Slug || p.fields?.slug
				return postSlug?.toLowerCase() === slug.toLowerCase()
			})
			if (matchingPost) {
				post = matchingPost as unknown as BlogPost
			}
		}
	}

	if (!post) {
		notFound()
	}

	// Fetch category details if present
	let category: { title: string; slug: string } | null = null
	if (post.fields.categoryID) {
		try {
			const categoryItem = await getContentItem<{ name?: string; Name?: string; slug?: string; Slug?: string }>({
				contentID: post.fields.categoryID,
				languageCode,
			})
			if (categoryItem?.fields) {
				category = {
					title: categoryItem.fields.name || categoryItem.fields.Name || "",
					slug: categoryItem.fields.slug || categoryItem.fields.Slug || "",
				}
			}
		} catch (error) {
			console.error("Error fetching category:", error)
		}
	}

	// Fetch series details if present
	let series: { title: string; slug: string } | null = null
	if (post.fields.seriesID) {
		try {
			const seriesItem = await getContentItem<{ title?: string; Title?: string; slug?: string; Slug?: string }>({
				contentID: post.fields.seriesID,
				languageCode,
			})
			if (seriesItem?.fields) {
				series = {
					title: seriesItem.fields.title || seriesItem.fields.Title || "",
					slug: seriesItem.fields.slug || seriesItem.fields.Slug || "",
				}
			}
		} catch (error) {
			console.error("Error fetching series:", error)
		}
	}

	// Parse tags from tagIDs (comma-separated string)
	let tags: { contentID: number; name: string }[] = []
	if (post.fields.tagIDs) {
		const tagIDsArray = post.fields.tagIDs.split(",").map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id))
		if (tagIDsArray.length > 0) {
			try {
				// Fetch all tags
				const allTags = await getContentList({
					referenceName: "tags",
					languageCode,
					take: 100,
				})
				// Filter to only the tags used by this post
				tags = allTags.items
					.filter((tag: any) => tagIDsArray.includes(tag.contentID))
					.map((tag: any) => ({
						contentID: tag.contentID,
						name: tag.fields.name || tag.fields.Name,
					}))
			} catch (error) {
				console.error("Error fetching tags:", error)
			}
		}
	}

	// Extract h1 from markdown content if present
	let pageTitle = post.fields.title
	let markdownContent = (post.fields.content || "").trim()

	// Check for h1 anywhere in markdown (# Title on its own line)
	// Using multiline flag to match at start of any line
	const h1Match = markdownContent.match(/^#\s+(.+?)$/m)
	if (h1Match) {
		pageTitle = h1Match[1].trim()
		// Remove the h1 line from markdown content
		markdownContent = markdownContent.replace(/^#\s+.+?$\n?/m, "").trim()
	}

	return (
		<article className="relative px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" data-agility-component={moduleContentID}>
			<div className="mx-auto">
				{post.fields.featuredImage && (
					<div className="mb-8 aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-lg bg-muted">
						<AgilityPic
							image={post.fields.featuredImage as any}
							fallbackWidth={1200}
							className="h-full w-full object-cover"
							sources={[
								{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
								{ media: "(min-width: 1280px)", width: 1920 },
								{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
								{ media: "(min-width: 640px)", width: 1280 },
								{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1920 },
								{ media: "(max-width: 639px)", width: 960 },
							]}
						/>
					</div>
				)}
				<header className="mb-8 max-w-3xl mx-auto">
					{/* Series Badge - Prominent display above title */}
					{series && (
						<SeriesLink
							href={localizeUrl(`/blog/series/${series.slug}`, languageCode)}
							title={series.title}
						/>
					)}

					<h1 className="text-4xl font-bold text-foreground mb-4" data-agility-field="title">
						{pageTitle}
					</h1>
					{post.fields.publishedDate && (
						<time className="text-muted-foreground">
							{new Date(post.fields.publishedDate).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					)}

					{/* Metadata: Category and Tags */}
					{(category || tags.length > 0) && (
						<div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
							{category && (
								<Link
									href={localizeUrl(`/blog/category/${category.slug}`, languageCode)}
									className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
								>
									{category.title}
								</Link>
							)}
							{tags.length > 0 && (
								<>
									{tags.map((tag) => (
										<span
											key={tag.contentID}
											className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium"
										>
											{tag.name}
										</span>
									))}
								</>
							)}
						</div>
					)}

					{post.fields.excerpt && (
						<p className="mt-4 text-xl text-muted-foreground" data-agility-field="excerpt">
							{post.fields.excerpt}
						</p>
					)}
				</header>
				{markdownContent && (
					<div
						className="prose prose-lg max-w-3xl mx-auto dark:prose-invert"
						data-agility-field="Content"
					>
						{processMarkdown(markdownContent)}
					</div>
				)}
			</div>
		</article>
	)
}

export default BlogDetails

