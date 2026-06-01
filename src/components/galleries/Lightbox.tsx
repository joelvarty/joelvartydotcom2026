/**
 * Lightbox Component
 *
 * A shared, immersive full-screen image detail view used by every gallery type.
 *
 * - Near-black backdrop that fills the viewport.
 * - The image stage is an Embla carousel: images slide in/out as you drag side
 *   to side (finger-following on touch) with smooth snapping, plus arrows and
 *   keyboard navigation. Each image is fully contained (never cropped).
 * - The caption renders BELOW the image in a <figcaption> (it never overlaps the
 *   photo). Long captions scroll inside a bounded area instead of shrinking the
 *   image, which keeps things readable on small screens.
 * - A compact thumbnail filmstrip for quick jumping when there is more than one
 *   image.
 */

"use client"

import React, { useState, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
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

export function Lightbox({ images, index, onClose }: LightboxProps) {
	if (index === null) return null

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="block overflow-hidden w-screen max-w-[100vw] h-[100dvh] max-h-[100dvh] translate-x-[-50%] translate-y-[-50%] gap-0 rounded-none border-0 bg-black/95 p-0 shadow-none sm:max-w-[100vw]"
			>
				{/* Keyed + remounted per open so Embla starts on the clicked image. */}
				<LightboxContent images={images} startIndex={index} onClose={onClose} />
			</DialogContent>
		</Dialog>
	)
}

interface LightboxContentProps {
	images: GalleryImage[]
	startIndex: number
	onClose: () => void
}

function LightboxContent({ images, startIndex, onClose }: LightboxContentProps) {
	const [current, setCurrent] = useState(startIndex)
	const [emblaRef, emblaApi] = useEmblaCarousel({
		startIndex,
		loop: false,
		align: "center",
		containScroll: "trimSnaps",
	})

	const hasMultiple = images.length > 1
	const canScrollPrev = current > 0
	const canScrollNext = current < images.length - 1

	// Keep our index (caption, counter, filmstrip) in sync as Embla settles on a
	// slide, whether the user dragged, tapped an arrow, or used the keyboard.
	useEffect(() => {
		if (!emblaApi) return
		const onSelect = () => setCurrent(emblaApi.selectedScrollSnap())
		emblaApi.on("select", onSelect).on("reInit", onSelect)
		return () => {
			emblaApi.off("select", onSelect).off("reInit", onSelect)
		}
	}, [emblaApi])

	// Keyboard navigation.
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") emblaApi?.scrollPrev()
			else if (e.key === "ArrowRight") emblaApi?.scrollNext()
			else if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [emblaApi, onClose])

	const caption = images[current]?.caption

	return (
		<div className="flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden">
			<VisuallyHidden>
				<DialogTitle>
					Image {current + 1} of {images.length}
				</DialogTitle>
			</VisuallyHidden>

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

			{/* Image stage: an Embla carousel that slides between images. */}
			<div className="relative min-h-0 min-w-0 flex-1">
				<div className="h-full overflow-hidden" ref={emblaRef}>
					<div className="flex h-full">
						{images.map((image, i) => (
							/* [&>picture]:contents drops AgilityPic's inline <picture> wrapper from
							   the box tree so the image's max-h-full resolves against the slide. */
							<div
								key={i}
								className="relative flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center px-2 sm:px-16 [&>picture]:contents"
							>
								{isAgilityImage(image.url) ? (
									<AgilityPic
										image={createImageField(image)}
										fallbackWidth={1920}
										className="max-h-full max-w-full min-h-0 min-w-0 w-auto object-contain"
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
										src={image.url}
										alt={image.alt || image.caption || ""}
										className="max-h-full max-w-full min-h-0 min-w-0 w-auto object-contain"
										loading="lazy"
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Navigation arrows (drag/swipe also works) */}
				{hasMultiple && (
					<>
						<button
							onClick={() => emblaApi?.scrollPrev()}
							disabled={!canScrollPrev}
							aria-label="Previous image"
							className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-20 sm:p-3"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>
						<button
							onClick={() => emblaApi?.scrollNext()}
							disabled={!canScrollNext}
							aria-label="Next image"
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-80 backdrop-blur-sm transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-20 sm:p-3"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</>
				)}
			</div>

			{/* Caption: below the image, bounded + scrollable so long text never eats the photo */}
			{caption && (
				<figcaption
					key={current}
					className="mx-auto max-h-[18vh] w-full max-w-2xl overflow-y-auto px-6 py-3 text-center text-sm leading-relaxed text-pretty break-words text-white/85 animate-in fade-in-0 duration-300 ease-out"
				>
					{caption}
				</figcaption>
			)}

			{/* Thumbnail filmstrip for quick navigation */}
			{hasMultiple && (
				<div className="flex justify-start gap-2 overflow-x-auto px-4 py-3 sm:justify-center">
					{images.map((thumb, i) => (
						<button
							key={thumb.url + i}
							onClick={() => emblaApi?.scrollTo(i)}
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
	)
}
