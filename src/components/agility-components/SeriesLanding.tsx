/**
 * SeriesLanding Component
 *
 * An Agility CMS module component that displays a series landing page.
 * Shows the series markdown summary at the top, followed by a list of blog posts in that series.
 * Uses the dynamicPageItem to get the series details and filter posts.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { getAgilityContext } from "@/lib/cms/getAgilityContext"
import { getSeriesListing } from "@/lib/cms-content/getSeriesListing"
import { type UnloadedModuleProps } from "@agility/nextjs"
import { processMarkdown } from "@/lib/markdown/processMarkdown"
import { BlogPostItem } from "./blog-listing/BlogPostItem"

/**
 * Interface defining the structure of the SeriesLanding module fields.
 */
export interface SeriesLandingFields {
	title?: string
	numberOfPosts?: string
}

/**
 * Interface defining the structure of a Series content item.
 */
export interface SeriesFields {
	title: string
	slug: string
	markdownSummary: string
}

const postsPerPage = 50

/**
 * SeriesLanding Component
 *
 * Fetches and renders a series landing page with markdown summary and list of posts.
 * The dynamicPageItem contains the series details used to filter and display posts.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @param dynamicPageItem - The dynamic page item containing the Series data
 * @returns A section element with the series landing page
 */
const SeriesLanding = async ({ module, languageCode, dynamicPageItem }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, numberOfPosts },
		contentID,
	} = await getContentItem<SeriesLandingFields>({
		contentID: module.contentid,
		languageCode,
	})

	const postsPerPageConfig = numberOfPosts ? parseInt(numberOfPosts, 10) : postsPerPage

	// Get the series details from the dynamicPageItem
	if (!dynamicPageItem) {
		return (
			<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
				<div className="mx-auto max-w-7xl">
					<p className="text-muted-foreground">No series found.</p>
				</div>
			</section>
		)
	}

	const seriesID = dynamicPageItem.contentID
	const seriesFields = dynamicPageItem.fields as SeriesFields

	// Get locale context
	const { locale } = await getAgilityContext(languageCode)

	// Fetch blog posts for this series
	const postsResult = await getSeriesListing({
		seriesID,
		locale,
		skip: 0,
		take: postsPerPageConfig,
		sort: "publishedDate",
		direction: "asc",
	})

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
			<div className="mx-auto max-w-7xl">
				{/* Side-by-side layout: Description on left, Posts on right */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Series Description - Left Column (50% width on large screens) */}
					<aside className="lg:col-span-1">
						{/* Series Badge & Title */}
						<div className="mb-8">
							{title && (
								<div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
									{title}
								</div>
							)}
							<h1 className="text-4xl font-bold text-foreground" data-agility-field="title">
								{seriesFields.title}
							</h1>
						</div>
						<div className="sticky top-24">
							{seriesFields.markdownSummary && (
								<div
									data-agility-field="markdownSummary"
									className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
								>
									{processMarkdown(seriesFields.markdownSummary)}
								</div>
							)}
						</div>
					</aside>

					{/* Series Posts - Right Column (50% width on large screens) */}
					<div className="lg:col-span-1">
						<h2 className="text-4xl font-bold text-foreground mb-8">Posts in this series</h2>
						<div className="space-y-8">

						{postsResult.posts.length === 0 ? (
							<p className="text-muted-foreground">No posts found in this series.</p>
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
							</>
						)}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default SeriesLanding
