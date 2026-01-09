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
}: BlogPostItemProps) {
	return (
		<Link
			key={contentID}
			href={url}
			className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-border animate-fade-in transition-all hover:border-primary/50 hover:translate-x-1"
			style={{ animationDelay: `${index * 50}ms` }}
		>
			{featuredImage && (
				<div className="shrink-0 sm:w-48 overflow-hidden rounded-lg bg-muted">
					<div className="aspect-video sm:aspect-square w-full sm:w-48 overflow-hidden">
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
				</div>
			)}
			<div className="flex-1">
				<h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
					{title}
				</h3>
				{publishedDate && (
					<time className="text-sm text-muted-foreground block mb-3">
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
