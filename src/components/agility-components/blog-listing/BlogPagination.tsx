import { Button } from "@/components/ui/button"
import Link from "next/link"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogPaginationProps {
	page: number
	totalPosts: number
	postsPerPage: number
	languageCode: string
	basePath?: string
}

/**
 * BlogPagination Component
 *
 * Displays pagination controls for blog listing pages.
 * Shows previous/next buttons and page numbers.
 *
 * @param page - Current page number (1-based)
 * @param totalPosts - Total number of posts
 * @param postsPerPage - Number of posts per page
 * @param languageCode - Language code for URL localization
 * @param basePath - Base path for pagination URLs (defaults to "/blog")
 */
export async function BlogPagination({
	page,
	totalPosts,
	postsPerPage,
	languageCode,
	basePath = "/blog",
}: BlogPaginationProps) {
	function url(pageNum: number) {
		const params = new URLSearchParams()
		if (pageNum > 1) {
			params.set("page", pageNum.toString())
		}

		const theUrl = params.size !== 0 ? `${basePath}?${params.toString()}` : basePath

		return localizeUrl(theUrl, languageCode)
	}

	const hasPreviousPage = page > 1
	const previousPageUrl = hasPreviousPage ? url(page - 1) : undefined
	const hasNextPage = page * postsPerPage < totalPosts
	const nextPageUrl = hasNextPage ? url(page + 1) : undefined
	const pageCount = Math.ceil(totalPosts / postsPerPage)

	// Don't render if there's only one page or less
	if (pageCount < 2) {
		return null
	}

	return (
		<div className="mt-12 flex items-center justify-between gap-2">
			<Button variant="outline" asChild disabled={!previousPageUrl}>
				<Link href={previousPageUrl || "#"} className={cn(!previousPageUrl && "pointer-events-none opacity-50")}>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Previous
				</Link>
			</Button>

			<div className="flex gap-2 max-sm:hidden">
				{Array.from({ length: pageCount }, (_, i) => {
					const pageNum = i + 1
					const isActive = pageNum === page
					return (
						<Link
							key={pageNum}
							href={url(pageNum)}
							className={cn(
								"min-w-10 px-3 py-2 rounded-lg text-center text-sm font-medium transition-colors",
								"hover:bg-muted",
								isActive
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "text-foreground"
							)}
						>
							{pageNum}
						</Link>
					)
				})}
			</div>

			<Button variant="outline" asChild disabled={!nextPageUrl}>
				<Link href={nextPageUrl || "#"} className={cn(!nextPageUrl && "pointer-events-none opacity-50")}>
					Next
					<ChevronRight className="h-4 w-4 ml-1" />
				</Link>
			</Button>
		</div>
	)
}

