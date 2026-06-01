"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export type SeriesOrder = "oldest" | "newest"

interface SeriesSortToggleProps {
	/** The currently active order. */
	currentOrder: SeriesOrder
	/** Base path of the series page (without query string). */
	basePath: string
	/** Element to scroll back to after switching order. */
	scrollTargetId?: string
}

/**
 * SeriesSortToggle Component
 *
 * A small segmented control to switch a series listing between oldest-first
 * (the default reading order) and newest-first. Switching order resets to the
 * first page. Navigation mirrors BlogPagination: push + refresh + scroll back
 * to the listing.
 */
export function SeriesSortToggle({ currentOrder, basePath, scrollTargetId = "series-listing" }: SeriesSortToggleProps) {
	const router = useRouter()

	function selectOrder(order: SeriesOrder) {
		if (order === currentOrder) return

		// "oldest" is the default, so omit the param for a clean URL; switching
		// order always returns to page 1.
		const target = order === "newest" ? `${basePath}?order=newest` : basePath
		router.push(target, { scroll: false })
		// Bypass the client Router Cache so the server re-fetches in the new order.
		router.refresh()
		setTimeout(() => {
			document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
		}, 100)
	}

	const options: { value: SeriesOrder; label: string }[] = [
		{ value: "oldest", label: "Oldest first" },
		{ value: "newest", label: "Newest first" },
	]

	return (
		<div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-sm" role="group" aria-label="Sort posts">
			{options.map((option) => {
				const isActive = option.value === currentOrder
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => selectOrder(option.value)}
						aria-pressed={isActive}
						className={cn(
							"rounded-md px-3 py-1 font-medium transition-colors cursor-pointer",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						{option.label}
					</button>
				)
			})}
		</div>
	)
}
