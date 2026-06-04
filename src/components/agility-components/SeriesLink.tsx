"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface SeriesLinkProps {
	href: string
	title: string
	children?: React.ReactNode
	/** "onImage" renders white text for use over a photo banner. */
	variant?: "default" | "onImage"
}

/**
 * SeriesLink Component
 *
 * A client-side link to a series page that ensures scroll to top.
 * Uses router.push with scroll:true and also manually scrolls to overcome
 * browser scroll restoration behavior.
 */
export function SeriesLink({ href, title, children, variant = "default" }: SeriesLinkProps) {
	const router = useRouter()

	const colorClasses =
		variant === "onImage"
			? "text-white hover:text-white/80 drop-shadow-md"
			: "text-primary hover:text-primary/80"

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
		// Disable browser scroll restoration temporarily
		if ("scrollRestoration" in history) {
			history.scrollRestoration = "manual"
		}
		// Navigate and scroll to top
		router.push(href, { scroll: true })
		// Also manually scroll to ensure it works
		window.scrollTo({ top: 0, behavior: "instant" })
		// Re-enable scroll restoration after a delay
		setTimeout(() => {
			if ("scrollRestoration" in history) {
				history.scrollRestoration = "auto"
			}
		}, 100)
	}

	return (
		<Link
			href={href}
			onClick={handleClick}
			className={`inline-flex items-center gap-2 mb-4 text-sm font-semibold transition-colors ${colorClasses}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className="w-5 h-5"
			>
				<path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
				<path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
				<path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
			</svg>
			<span className="uppercase tracking-wider">Series: {title}</span>
			{children}
		</Link>
	)
}
