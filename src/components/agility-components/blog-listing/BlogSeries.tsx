import { getContentList } from "@/lib/cms/getContentList"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import Link from "next/link"

interface BlogSeriesProps {
	languageCode: string
}

/**
 * Series interface (from BlogSeries content model)
 */
interface Series {
	contentID: number
	fields: {
		title: string
		slug: string
		markdownSummary?: string
	}
}

/**
 * BlogSeries Component
 *
 * Displays a sidebar list of blog series from Agility CMS.
 * Shows series with links to their landing pages.
 *
 * @param languageCode - The language code for localized content
 */
export async function BlogSeries({ languageCode }: BlogSeriesProps) {
	// Fetch series from container
	const seriesResult = await getContentList<Series>({
		referenceName: "blogseries",
		languageCode,
		sort: "fields.title",
		direction: "asc",
	})

	if (seriesResult.items.length === 0) {
		return null
	}

	return (
		<aside className="space-y-4">
			<h3 className="text-lg font-semibold text-foreground mb-4">Series</h3>
			<nav className="space-y-2">
				{/* Series links */}
				{seriesResult.items.map((series: Series) => {
					const seriesUrl = localizeUrl(`/blog/series/${series.fields.slug}`, languageCode)

					return (
						<Link
							key={series.contentID}
							href={seriesUrl}
							className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
						>
							{series.fields.title}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
