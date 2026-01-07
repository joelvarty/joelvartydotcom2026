/**
 * BlogListing Component
 *
 * An Agility CMS module component that displays a list of blog posts.
 * Fetches blog posts from a specified container and renders them in a list.
 */

import { getContentList } from "@/lib/cms/getContentList"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import Link from "next/link"

/**
 * Interface defining the structure of the BlogListing module fields.
 */
export interface BlogListingFields {
	title?: string
	numberOfPosts?: string
	containerReferenceName?: string
}

/**
 * BlogPost interface (from BlogPost content model)
 */
interface BlogPost {
	contentID: number
	fields: {
		title: string
		Slug: string
		excerpt?: string
		publishedDate?: string
		featuredImage?: {
			url: string
			label: string
		}
	}
}

/**
 * BlogListing Component
 *
 * Fetches and renders a list of blog posts from Agility CMS.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @returns A section element with the blog post listing
 */
const BlogListing = async ({ module, languageCode }: UnloadedModuleProps) => {
	const { title, numberOfPosts, containerReferenceName } = (module as any).fields as BlogListingFields

	const containerName = containerReferenceName || "Posts"
	const limit = numberOfPosts ? parseInt(numberOfPosts, 10) : 10

	// Fetch blog posts from the container
	const posts = await getContentList<BlogPost>({
		referenceName: containerName,
		languageCode,
		take: limit,
		sort: "publishedDate",
	})

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={module.contentid}>
			<div className="mx-auto max-w-7xl">
				{title && (
					<h2 className="text-3xl font-bold text-foreground mb-8" data-agility-field="title">
						{title}
					</h2>
				)}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.items.map((post: BlogPost, index: number) => (
						<article
							key={post.contentID}
							className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-optimized hover:shadow-md animate-fade-in"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							{post.fields.featuredImage && (
								<Link href={`/blog/${post.fields.Slug}`} className="block">
									<div className="aspect-video w-full overflow-hidden bg-muted">
									<AgilityPic
										image={post.fields.featuredImage as any}
										fallbackWidth={600}
											className="h-full w-full object-cover transition-transform hover:scale-105"
											sources={[
												{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 1600 },
												{ media: "(min-width: 1280px)", width: 800 },
												{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1200 },
												{ media: "(min-width: 640px)", width: 600 },
												{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
												{ media: "(max-width: 639px)", width: 640 },
											]}
										/>
									</div>
								</Link>
							)}
							<div className="flex flex-1 flex-col p-6">
								<Link href={`/blog/${post.fields.Slug}`}>
									<h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
										{post.fields.title}
									</h3>
								</Link>
								{post.fields.excerpt && (
									<p className="text-muted-foreground mb-4 line-clamp-3">{post.fields.excerpt}</p>
								)}
								{post.fields.publishedDate && (
									<time className="text-sm text-muted-foreground">
										{new Date(post.fields.publishedDate).toLocaleDateString()}
									</time>
								)}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default BlogListing

