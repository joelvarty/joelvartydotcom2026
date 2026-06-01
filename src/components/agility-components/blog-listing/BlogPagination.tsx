"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogPaginationProps {
	page: number
	totalPosts: number
	postsPerPage: number
	basePath?: string
	scrollTargetId?: string
	/** Extra query params to preserve across page navigation (e.g. sort order). */
	extraParams?: Record<string, string | undefined>
}

/**
 * BlogPagination Component
 *
 * Displays pagination controls for blog listing pages.
 * Shows previous/next buttons and page numbers.
 * Scrolls to the blog listing section after navigation.
 *
 * @param page - Current page number (1-based)
 * @param totalPosts - Total number of posts
 * @param postsPerPage - Number of posts per page
 * @param basePath - Base path for pagination URLs (defaults to "/blog")
 */
export function BlogPagination({
	page,
	totalPosts,
	postsPerPage,
	basePath = "/blog",
	scrollTargetId = "blog-listing",
	extraParams,
}: BlogPaginationProps) {
	const router = useRouter()

	function url(pageNum: number) {
		const params = new URLSearchParams()
		if (pageNum > 1) {
			params.set("page", pageNum.toString())
		}
		if (extraParams) {
			for (const [key, value] of Object.entries(extraParams)) {
				if (value) params.set(key, value)
			}
		}

		return params.size !== 0 ? `${basePath}?${params.toString()}` : basePath
	}

	function navigateToPage(pageNum: number) {
		router.push(url(pageNum), { scroll: false })
		// Force refresh to bypass Next.js Router Cache (client-side RSC cache)
		// Without this, the cached page content is reused instead of fetching new data
		router.refresh()
		// Scroll to target element after a short delay to allow navigation
		setTimeout(() => {
			const element = document.getElementById(scrollTargetId)
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		}, 100)
	}

	const hasPreviousPage = page > 1
	const hasNextPage = page * postsPerPage < totalPosts
	const pageCount = Math.ceil(totalPosts / postsPerPage)

	// Don't render if there's only one page or less
	if (pageCount < 2) {
		return null
	}

	return (
		<div className="mt-12 flex items-center justify-between gap-2">
			<Button
				variant="outline"
				disabled={!hasPreviousPage}
				onClick={() => hasPreviousPage && navigateToPage(page - 1)}
				className={cn("cursor-pointer", !hasPreviousPage && "pointer-events-none opacity-50")}
			>
				<ChevronLeft className="h-4 w-4 mr-1" />
				Previous
			</Button>

			<div className="flex gap-2 max-sm:hidden">
				{Array.from({ length: pageCount }, (_, i) => {
					const pageNum = i + 1
					const isActive = pageNum === page
					return (
						<button
							key={pageNum}
							onClick={() => navigateToPage(pageNum)}
							className={cn(
								"min-w-10 px-3 py-2 rounded-lg text-center text-sm font-medium transition-colors cursor-pointer",
								"hover:bg-muted",
								isActive
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "text-foreground"
							)}
						>
							{pageNum}
						</button>
					)
				})}
			</div>

			<Button
				variant="outline"
				disabled={!hasNextPage}
				onClick={() => hasNextPage && navigateToPage(page + 1)}
				className={cn("cursor-pointer", !hasNextPage && "pointer-events-none opacity-50")}
			>
				Next
				<ChevronRight className="h-4 w-4 ml-1" />
			</Button>
		</div>
	)
}
