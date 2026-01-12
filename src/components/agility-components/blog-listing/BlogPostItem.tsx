import { AgilityPic } from "@agility/nextjs"
import Link from "next/link"

export interface BlogPostItemProps {
	contentID: number
	title: string
	url: string
	publishedDate?: string
	excerpt?: string
	featuredImage?: {
		url: string
		label: string
	}
	index?: number
	series?: {
		contentID: number
		title: string
		slug: string
	}
	category?: {
		contentID: number
		title: string
		slug: string
	}
	tags?: {
		contentID: number
		name: string
	}[]
	hideSeries?: boolean
	hideCategory?: boolean
}

/**
 * BlogPostItem Component
 *
 * Displays a single blog post item with featured image, title, date, excerpt, and read more link.
 * Used in both BlogListing and SeriesLanding components.
 *
 * @param post - The blog post data to display
 * @param index - Optional index for staggered animation delay
 */
export function BlogPostItem({
	contentID,
	title,
	url,
	publishedDate,
	excerpt,
	featuredImage,
	index = 0,
	series,
	category,
	tags,
	hideSeries = false,
	hideCategory = false,
}: BlogPostItemProps) {
	return (
		<Link
			key={contentID}
			href={url}
			className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-border animate-fade-in transition-all hover:border-primary/50 hover:translate-x-1"
			style={{ animationDelay: `${index * 50}ms` }}
		>
			{featuredImage && (
				<div className="shrink-0 w-full sm:w-48 sm:h-48 aspect-video sm:aspect-square overflow-hidden rounded-lg bg-muted">
					<AgilityPic
						image={featuredImage as any}
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
			)}
			<div className="flex-1">
				{/* Series badge */}
				{series && !hideSeries && (
					<span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-3.5 h-3.5"
						>
							<path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
							<path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
							<path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
						</svg>
						<span className="uppercase tracking-wider">{series.title}</span>
					</span>
				)}
				<h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
					{title}
				</h3>
				{publishedDate && (
					<time className="text-sm text-muted-foreground block mb-2">
						{(() => {
							const date = new Date(publishedDate)
							// Check if time is midnight (00:00) in EST
							const estDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }))
							const isMidnight = estDate.getHours() === 0 && estDate.getMinutes() === 0

							if (isMidnight) {
								// Show only date if it's midnight
								return date.toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
									timeZone: "America/New_York",
								})
							} else {
								// Show date and time if it's not midnight
								return date.toLocaleString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "numeric",
									minute: "2-digit",
									timeZone: "America/New_York",
									timeZoneName: "short",
								})
							}
						})()}
					</time>
				)}
				{/* Category and tags */}
				{((category && !hideCategory) || (tags && tags.length > 0)) && (
					<div className="flex flex-wrap items-center gap-2 mb-3">
						{category && !hideCategory && (
							<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
								{category.title}
							</span>
						)}
						{tags && tags.map((tag) => (
							<span
								key={tag.contentID}
								className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
							>
								{tag.name}
							</span>
						))}
					</div>
				)}
				{excerpt && (
					<p className="text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground/80 transition-colors">
						{excerpt}
					</p>
				)}
				<span className="text-primary group-hover:underline text-sm font-medium inline-flex items-center gap-1">
					Read more
					<span className="transition-transform group-hover:translate-x-1">→</span>
				</span>
			</div>
		</Link>
	)
}
