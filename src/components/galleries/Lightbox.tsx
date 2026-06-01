/**
 * Lightbox Component
 *
 * A shared, immersive full-screen image detail view used by the grid, masonry,
 * and tabs galleries. Built for readability and mobile:
 *
 * - Near-black backdrop that fills the viewport.
 * - The image is centered and fully contained (never cropped).
 * - The caption renders BELOW the image in a <figcaption> (it never overlaps the
 *   photo). Long captions scroll inside a bounded area instead of shrinking the
 *   image, which keeps things readable on small screens.
 * - Touch swipe (left/right to navigate, down to dismiss) plus keyboard arrows
 *   and Escape.
 * - A compact thumbnail filmstrip for quick jumping when there is more than one
 *   image.
 */

"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

// Visually hidden helper for the accessible dialog title.
const VisuallyHidden: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...props }) => (
	<span
		style={{
			position: "absolute",
			width: "1px",
			height: "1px",
			padding: "0",
			margin: "-1px",
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			border: "0",
		}}
		{...props}
	>
		{children}
	</span>
)

interface LightboxProps {
	images: GalleryImage[]
	/** Index of the image to show, or null when the lightbox is closed. */
	index: number | null
	onClose: () => void
}

const SWIPE_THRESHOLD = 50

export function Lightbox({ images, index, onClose }: LightboxProps) {
	const [current, setCurrent] = useState(index ?? 0)
	const [seededFrom, setSeededFrom] = useState(index)
	const touchStart = useRef<{ x: number; y: number } | null>(null)

	// Seed the internal index whenever the opener picks a new image. Done during
	// render (not in an effect) so the correct slide shows on the first paint.
	if (index !== seededFrom) {
		setSeededFrom(index)
		if (index !== null) setCurrent(index)
	}

	const isOpen = index !== null

	const navigate = useCallback(
		(direction: "prev" | "next") => {
			setCurrent((prev) => {
				if (direction === "prev") return prev > 0 ? prev - 1 : prev
				return prev < images.length - 1 ? prev + 1 : prev
			})
		},
		[images.length]
	)

	// Keyboard navigation.
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") navigate("prev")
			else if (e.key === "ArrowRight") navigate("next")
			else if (e.key === "Escape") onClose()
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, navigate, onClose])

	const handleTouchStart = (e: React.TouchEvent) => {
		const t = e.touches[0]
		touchStart.current = { x: t.clientX, y: t.clientY }
	}

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStart.current) return
		const t = e.changedTouches[0]
		const dx = t.clientX - touchStart.current.x
		const dy = t.clientY - touchStart.current.y
		touchStart.current = null

		// Horizontal swipe wins when it dominates; otherwise a downward swipe closes.
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
			navigate(dx < 0 ? "next" : "prev")
		} else if (dy > SWIPE_THRESHOLD * 1.5) {
			onClose()
		}
	}

	if (!isOpen) return null

	const image = images[current]
	const hasMultiple = images.length > 1

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="block overflow-hidden w-screen max-w-[100vw] h-[100dvh] max-h-[100dvh] translate-x-[-50%] translate-y-[-50%] gap-0 rounded-none border-0 bg-black/95 p-0 shadow-none sm:max-w-[100vw]"
			>
				<VisuallyHidden>
					<DialogTitle>
						Image {current + 1} of {images.length}
					</DialogTitle>
				</VisuallyHidden>

				<div
					className="flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden"
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					{/* Top bar: brand label + counter + close */}
					<div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
						<span className="text-sm font-semibold tracking-wide text-white/90 select-none">
							joelvarty.com
						</span>
						<div className="text-sm font-medium tabular-nums text-white/60">
							{hasMultiple ? `${current + 1} / ${images.length}` : ""}
						</div>
						<button
							onClick={onClose}
							aria-label="Close"
							className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
						>
							<X className="h-6 w-6" />
						</button>
					</div>

					{/* Image stage */}
					<div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center px-2 sm:px-16 [&>picture]:contents">
						{isAgilityImage(image.url) ? (
							<AgilityPic
								key={current}
								image={createImageField(image)}
								fallbackWidth={1920}
								className="max-h-full max-w-full min-h-0 min-w-0 w-auto object-contain animate-in fade-in-0 duration-500 ease-out"
								sources={[
									{ media: "(min-width: 1920px) and (min-resolution: 2dppx)", width: 3840 },
									{ media: "(min-width: 1920px)", width: 1920 },
									{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2560 },
									{ media: "(min-width: 1280px)", width: 1280 },
									{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 },
									{ media: "(min-width: 640px)", width: 1024 },
									{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
									{ media: "(max-width: 639px)", width: 640 },
								]}
							/>
						) : (
							<img
								key={current}
								src={image.url}
								alt={image.alt || image.caption || ""}
								className="max-h-full max-w-full min-h-0 min-w-0 w-auto object-contain animate-in fade-in-0 duration-500 ease-out"
							/>
						)}

						{/* Navigation arrows (desktop-friendly; mobile uses swipe) */}
						{hasMultiple && (
							<>
								<button
									onClick={() => navigate("prev")}
									disabled={current === 0}
									aria-label="Previous image"
									className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-20 sm:p-3"
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
								<button
									onClick={() => navigate("next")}
									disabled={current === images.length - 1}
									aria-label="Next image"
									className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-20 sm:p-3"
								>
									<ChevronRight className="h-6 w-6" />
								</button>
							</>
						)}
					</div>

					{/* Caption: below the image, bounded + scrollable so long text never eats the photo */}
					{image.caption && (
						<figcaption
							key={current}
							className="mx-auto max-h-[18vh] w-full max-w-2xl overflow-y-auto px-6 py-3 text-center text-sm leading-relaxed text-pretty break-words text-white/85 animate-in fade-in-0 duration-500 ease-out"
						>
							{image.caption}
						</figcaption>
					)}

					{/* Thumbnail filmstrip for quick navigation */}
					{hasMultiple && (
						<div className="flex justify-start gap-2 overflow-x-auto px-4 py-3 sm:justify-center">
							{images.map((thumb, i) => (
								<button
									key={thumb.url + i}
									onClick={() => setCurrent(i)}
									aria-label={`View image ${i + 1}`}
									className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded transition-all sm:h-14 sm:w-14 ${
										i === current
											? "ring-2 ring-white ring-offset-2 ring-offset-black"
											: "opacity-50 hover:opacity-90"
									}`}
								>
									{isAgilityImage(thumb.url) ? (
										<AgilityPic
											image={createImageField(thumb)}
											fallbackWidth={120}
											className="h-full w-full object-cover"
											sources={[{ media: "(min-resolution: 2dppx)", width: 200 }, { media: "(min-width: 1px)", width: 120 }]}
										/>
									) : (
										<img src={thumb.url} alt="" className="h-full w-full object-cover" />
									)}
								</button>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
