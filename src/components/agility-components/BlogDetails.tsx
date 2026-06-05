/**
 * BlogDetails Component
 *
 * An Agility CMS module component that displays a single blog post.
 * Can work with dynamic pages (that reference a blog post) or fetch by contentID.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { getContentList } from "@/lib/cms/getContentList"
import { type UnloadedModuleProps } from "@agility/nextjs"
import { notFound } from "next/navigation"
import { processMarkdown } from "@/lib/markdown/processMarkdown"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import Link from "next/link"
import { SeriesLink } from "./SeriesLink"
import { ScrollBanner } from "./ScrollBanner"

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

	// Fetch a random subscribe CTA
	let subscribeCTA: { heading: string; description: string } | null = null
	try {
		const ctaList = await getContentList({
			referenceName: "SubscribeCTAs",
			languageCode,
			take: 50,
		})
		if (ctaList.items.length > 0) {
			const randomItem = ctaList.items[Math.floor(Math.random() * ctaList.items.length)] as any
			subscribeCTA = {
				heading: randomItem.fields.heading || randomItem.fields.Heading,
				description: randomItem.fields.description || randomItem.fields.Description,
			}
		}
	} catch (error) {
		// Silently fail - subscribe CTA is not critical
	}

	const formattedDate = post.fields.publishedDate
		? new Date(post.fields.publishedDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: null

	const hasBanner = Boolean(post.fields.featuredImage)

	// The heading overlaid on the photo banner (>= sm). It scrolls off the still photo.
	const overlayHeading = (
		<>
			{series && (
				<SeriesLink
					variant="onImage"
					href={localizeUrl(`/blog/series/${series.slug}`, languageCode)}
					title={series.title}
				/>
			)}
			<h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl" data-agility-field="title">
				{pageTitle}
			</h1>
			{formattedDate && <time className="mt-4 block text-white/90 drop-shadow-md">{formattedDate}</time>}
		</>
	)

	const body = (
		<div className="px-4 sm:px-6 lg:px-8 py-12">
			<header className="mb-8 max-w-3xl mx-auto">
				{/* Heading: rendered below the photo on mobile, or as the main header when there is no banner. */}
				<div className={hasBanner ? "sm:hidden" : undefined}>
					{series && (
						<SeriesLink
							href={localizeUrl(`/blog/series/${series.slug}`, languageCode)}
							title={series.title}
						/>
					)}
					<h1 className="text-4xl font-bold text-foreground mb-4" data-agility-field="title">
						{pageTitle}
					</h1>
					{formattedDate && <time className="text-muted-foreground">{formattedDate}</time>}
				</div>

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
			<div className="max-w-3xl mx-auto mt-12 border-t border-border pt-8 text-center">
				{subscribeCTA && (
					<>
						<h3 className="text-xl font-bold text-foreground mb-2">{subscribeCTA.heading}</h3>
						<p className="text-muted-foreground mb-6">{subscribeCTA.description}</p>
					</>
				)}
				<iframe
					src="https://joelvarty.substack.com/embed"
					width="100%"
					height="150"
					loading="lazy"
					style={{ border: "none", background: "transparent" }}
					frameBorder="0"
					scrolling="no"
					title="Subscribe to newsletter"
				/>
			</div>
		</div>
	)

	return (
		<article className="animate-fade-in" data-agility-component={moduleContentID}>
			{post.fields.featuredImage ? (
				// Full-bleed banner: the photo and content are held still while the heading
				// scrolls off, then everything scrolls away together (>= sm).
				<ScrollBanner image={post.fields.featuredImage} heading={overlayHeading}>
					{body}
				</ScrollBanner>
			) : (
				body
			)}
		</article>
	)
}

export default BlogDetails

