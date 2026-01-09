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
import { type UnloadedModuleProps } from "@agility/nextjs"
import { BlogPagination } from "./BlogPagination"
import { BlogCategories } from "./BlogCategories"
import { BlogSeries } from "./BlogSeries"
import { BlogPostItem } from "./BlogPostItem"

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
									<BlogPostItem
										key={post.contentID}
										contentID={post.contentID}
										title={post.title}
										url={post.url}
										publishedDate={post.publishedDate}
										excerpt={post.excerpt}
										featuredImage={post.featuredImage}
										index={index}
									/>
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

					{/* Categories and Series sidebar */}
					<aside className="lg:col-span-1">
						<div className="sticky top-24 space-y-8">
							<BlogCategories
								languageCode={languageCode}
								selectedCategoryID={categoryID}
							/>
							<BlogSeries languageCode={languageCode} />
						</div>
					</aside>
				</div>
			</div>
		</section>
	)
}

export default BlogListing

