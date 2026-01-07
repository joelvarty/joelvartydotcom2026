/**
 * BlogListing Component
 *
 * An Agility CMS module component that displays a paginated list of blog posts.
 * Uses a lib function for data access to keep the component simple.
 * Vertical layout with categories sidebar on the right.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { getAgilityContext } from "@/lib/cms/getAgilityContext"
import { getBlogListing } from "@/lib/cms-content/getBlogListing"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import Link from "next/link"
import { BlogPagination } from "./BlogPagination"
import { BlogCategories } from "./BlogCategories"

/**
 * Interface defining the structure of the BlogListing module fields.
 */
export interface BlogListingFields {
	title?: string
	numberOfPosts?: string
}

const postsPerPage = 10

/**
 * BlogListing Component
 *
 * Fetches and renders a paginated list of blog posts from Agility CMS.
 * Displays posts in a vertical layout with a categories sidebar on the right.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @param globalData - Global data including search params for pagination
 * @param dynamicPageItem - The dynamic page item for the optional CATEGORY to show posts for
 * @returns A section element with the blog post listing
 */
const BlogListing = async ({ module, languageCode, globalData, dynamicPageItem }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, numberOfPosts },
		contentID,
	} = await getContentItem<BlogListingFields>({
		contentID: module.contentid,
		languageCode,
	})

	const postsPerPageConfig = numberOfPosts ? parseInt(numberOfPosts, 10) : postsPerPage
	console.log("dynamicPageItem", dynamicPageItem)
	let categoryID: number | undefined = undefined // if dynamicPageItem is present, use the categoryID from the dynamicPageItem
	if (dynamicPageItem) {
		categoryID = dynamicPageItem.contentID
	}

	// Get page from globalData search params, default to 1
	const pageParam = globalData?.searchParams?.page
	let page = 1
	if (typeof pageParam === 'string') {
		const parsed = parseInt(pageParam, 10)
		if (!isNaN(parsed) && parsed > 0) {
			page = parsed
		}
	}

	// Get locale context
	const { locale } = await getAgilityContext(languageCode)

	// Fetch blog posts using lib function
	const postsResult = await getBlogListing({
		categoryID,
		locale,
		skip: (page - 1) * postsPerPageConfig,
		take: postsPerPageConfig,
		sort: "publishedDate",
		direction: "desc",
	})

	const titleStr = title ? title : dynamicPageItem ? dynamicPageItem.fields.name : "Blog"

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
			<div className="mx-auto max-w-7xl">
				{titleStr && (
					<h2 className="text-3xl font-bold text-foreground mb-8" data-agility-field="title">
						{titleStr}
					</h2>
				)}

				{/* Main content area with sidebar */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Blog posts - vertical layout */}
					<div className="lg:col-span-2 space-y-8">
						{postsResult.posts.length === 0 ? (
							<p className="text-muted-foreground">No posts found.</p>
						) : (
							<>
								{postsResult.posts.map((post, index: number) => (
									<Link
										key={post.contentID}
										href={post.url}
										className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-border animate-fade-in transition-all hover:border-primary/50 hover:translate-x-1"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										{post.featuredImage && (
											<div className="shrink-0 sm:w-48 overflow-hidden rounded-lg bg-muted">
												<div className="aspect-video sm:aspect-square w-full sm:w-48 overflow-hidden">
													<AgilityPic
														image={post.featuredImage as any}
														fallbackWidth={400}
														className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
														sources={[
															{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 800 },
															{ media: "(min-width: 1280px)", width: 400 },
															{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 600 },
															{ media: "(min-width: 640px)", width: 300 },
															{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 800 },
															{ media: "(max-width: 639px)", width: 400 },
														]}
													/>
												</div>
											</div>
										)}
										<div className="flex-1">
											<h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
												{post.title}
											</h3>
											{post.publishedDate && (
												<time className="text-sm text-muted-foreground block mb-3">
													{new Date(post.publishedDate).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</time>
											)}
											{post.excerpt && (
												<p className="text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground/80 transition-colors">
													{post.excerpt}
												</p>
											)}
											<span className="text-primary group-hover:underline text-sm font-medium inline-flex items-center gap-1">
												Read more
												<span className="transition-transform group-hover:translate-x-1">→</span>
											</span>
										</div>
									</Link>
								))}
								<BlogPagination
									page={page}
									totalPosts={postsResult.totalCount}
									postsPerPage={postsPerPageConfig}
									languageCode={languageCode}
									basePath="/blog"
								/>
							</>
						)}
					</div>

					{/* Categories sidebar */}
					<aside className="lg:col-span-1">
						<div className="sticky top-24">
							<BlogCategories
								languageCode={languageCode}
								selectedCategoryID={categoryID}
							/>
						</div>
					</aside>
				</div>
			</div>
		</section>
	)
}

export default BlogListing

