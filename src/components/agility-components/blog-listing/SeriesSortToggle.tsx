"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type SeriesOrder = "oldest" | "newest"

interface SeriesSortToggleProps {
	/** The currently active order (from the server). */
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
 * (the default reading order) and newest-first.
 *
 * The highlight is optimistic: the clicked button becomes active immediately
 * and shows a brief spinner while the new order loads, so a slow server
 * response never looks like the click was ignored. Navigation is a client-side
 * (soft) route change via useTransition, and switching order resets to page 1.
 */
export function SeriesSortToggle({ currentOrder, basePath, scrollTargetId = "series-listing" }: SeriesSortToggleProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	// Optimistic selection so the UI reflects the click instantly.
	const [selected, setSelected] = useState<SeriesOrder>(currentOrder)
	const [seededOrder, setSeededOrder] = useState<SeriesOrder>(currentOrder)

	// Reconcile with the server-confirmed order once it arrives (render-phase, so
	// no effect is needed and the optimistic state can't get stuck).
	if (currentOrder !== seededOrder) {
		setSeededOrder(currentOrder)
		setSelected(currentOrder)
	}

	function selectOrder(order: SeriesOrder) {
		if (order === selected) return

		setSelected(order) // immediate visual feedback

		// "oldest" is the default, so omit the param for a clean URL; switching
		// order always returns to page 1.
		const target = order === "newest" ? `${basePath}?order=newest` : basePath

		startTransition(() => {
			router.push(target, { scroll: false })
			// Bypass the client Router Cache so the server re-fetches in the new order.
			router.refresh()
		})

		setTimeout(() => {
			document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
		}, 100)
	}

	const options: { value: SeriesOrder; label: string }[] = [
		{ value: "oldest", label: "Oldest first" },
		{ value: "newest", label: "Newest first" },
	]

	return (
		<div
			className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-sm"
			role="group"
			aria-label="Sort posts"
			aria-busy={isPending}
		>
			{options.map((option) => {
				const isActive = option.value === selected
				const isLoading = isActive && isPending
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => selectOrder(option.value)}
						aria-pressed={isActive}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors cursor-pointer",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						{isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
						{option.label}
					</button>
				)
			})}
		</div>
	)
}
