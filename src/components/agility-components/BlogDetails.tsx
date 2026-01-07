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
		Slug: string
		excerpt?: string
		Content?: string
		publishedDate?: string
		featuredImage?: {
			url: string
			label: string
		}
	}
}

/**
 * BlogDetails Component
 *
 * Fetches and renders a single blog post.
 * For dynamic pages, the page's sitemapNode.contentID will reference the blog post.
 * For static pages, can fetch by contentID field or slug.
 *
 * @param module - The Agility CMS module object
 * @param languageCode - The language code for localized content
 * @param page - The page object (may contain sitemapNode with contentID for dynamic pages)
 * @returns A section element with the blog post content
 */
const BlogDetails = async ({ module, languageCode, page }: UnloadedModuleProps) => {
	const { containerReferenceName, contentID } = (module as any).fields as BlogDetailsFields
	const containerName = containerReferenceName || "Posts"

	let post: BlogPost | null = null

	// Try to get contentID from dynamic page reference first
	const dynamicContentID = (page as any)?.sitemapNode?.contentID

		if (dynamicContentID) {
		// This is a dynamic page referencing a blog post
		try {
			const contentItem = await getContentItem({
				contentID: dynamicContentID,
				languageCode,
			})
			post = contentItem as unknown as BlogPost
		} catch (error) {
			// Fall through to other methods
		}
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
			const slug = (page as any)?.sitemapNode?.path?.split("/").pop() || ""
			if (slug) {
				// Fetch all posts and filter client-side by slug
				const allPosts = await getContentList({
					referenceName: containerName,
					languageCode,
					take: 100, // Get enough to find the post
				})
				const matchingPost = allPosts.items.find((p: any) => p.fields?.Slug === slug)
				if (matchingPost) {
					post = matchingPost as unknown as BlogPost
				}
			}
		}

	if (!post) {
		notFound()
	}

	return (
		<article className="relative px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" data-agility-component={module.contentid}>
			<div className="mx-auto max-w-3xl">
				{post.fields.featuredImage && (
					<div className="mb-8 aspect-video w-full overflow-hidden rounded-lg bg-muted">
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
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4" data-agility-field="title">
						{post.fields.title}
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
					{post.fields.excerpt && (
						<p className="mt-4 text-xl text-muted-foreground" data-agility-field="excerpt">
							{post.fields.excerpt}
						</p>
					)}
				</header>
				{post.fields.Content && (
					<div
						className="prose prose-lg max-w-none dark:prose-invert"
						data-agility-field="Content"
					>
						{processMarkdown(post.fields.Content)}
					</div>
				)}
			</div>
		</article>
	)
}

export default BlogDetails

