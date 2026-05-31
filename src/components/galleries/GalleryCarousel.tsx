/**
 * Gallery Carousel Component
 *
 * Displays images in a carousel/slideshow format with navigation arrows,
 * dots/pagination indicators, and keyboard/touch navigation.
 *
 * Captions render below the image in a <figcaption> (never overlaid) so they
 * stay readable and never cover the photo, even on mobile.
 */

"use client"

import React, { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

interface GalleryCarouselProps {
	images: GalleryImage[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
	const [api, setApi] = useState<CarouselApi>()
	const [hoveredZone, setHoveredZone] = useState<"left" | "right" | null>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!api) return

		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const width = rect.width

		// Left third - go to previous (only if possible)
		if (x < width / 3 && canScrollPrev) {
			api.scrollPrev()
		}
		// Right third - go to next (only if possible)
		else if (x > (2 * width) / 3 && canScrollNext) {
			api.scrollNext()
		}
		// Middle third - do nothing (let user interact with image)
	}

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const width = rect.width

		if (x < width / 3 && canScrollPrev) {
			setHoveredZone("left")
		} else if (x > (2 * width) / 3 && canScrollNext) {
			setHoveredZone("right")
		} else {
			setHoveredZone(null)
		}
	}

	const handleMouseLeave = () => {
		setHoveredZone(null)
	}

	// Update scroll ability when carousel changes
	useEffect(() => {
		if (!api) return

		const onSelect = () => {
			setCanScrollPrev(api.canScrollPrev())
			setCanScrollNext(api.canScrollNext())
		}

		// Set initial state
		onSelect()

		// Listen for changes
		api.on("select", onSelect)
		api.on("reInit", onSelect)

		return () => {
			api.off("select", onSelect)
			api.off("reInit", onSelect)
		}
	}, [api])

	return (
		<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Carousel
				setApi={setApi}
				className="w-full"
				style={{ touchAction: "pan-x", overscrollBehavior: "contain" }}
				opts={{
					align: "start",
					loop: false,
					dragFree: false,
					containScroll: "trimSnaps",
					watchDrag: true,
					watchResize: true,
				}}
			>
				<CarouselContent
					className="-ml-0"
					style={{ touchAction: "pan-x", overscrollBehavior: "contain" }}
				>
					{images.map((image, index) => (
						<CarouselItem key={index} className="pl-0">
							<figure className="m-0">
								<div
									className={`relative aspect-video w-full overflow-hidden rounded-lg bg-muted/30 group ${
										(canScrollPrev || canScrollNext) ? "cursor-pointer" : ""
									}`}
									onClick={handleClick}
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}
								>
									{isAgilityImage(image.url) ? (
										<AgilityPic
											image={createImageField(image)}
											fallbackWidth={800}
											className="h-full w-full object-contain pointer-events-none"
											sources={[
												{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 },
												{ media: "(min-width: 1280px)", width: 1200 },
												{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 },
												{ media: "(min-width: 640px)", width: 800 },
												{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
												{ media: "(max-width: 639px)", width: 640 },
											]}
										/>
									) : (
										<img
											src={image.url}
											alt={image.alt || image.caption || ""}
											className="h-full w-full object-contain pointer-events-none"
											loading="lazy"
										/>
									)}

									{/* Hover overlays for left/right navigation zones */}
									<div
										className={`absolute left-0 top-0 bottom-0 w-1/3 backdrop-blur-[2px] transition-all duration-300 pointer-events-none ${
											hoveredZone === "left" ? "opacity-100" : "opacity-0"
										}`}
										style={{
											background: "linear-gradient(to right, rgba(0, 0, 0, 0.25), transparent)",
										}}
									/>
									<div
										className={`absolute right-0 top-0 bottom-0 w-1/3 backdrop-blur-[2px] transition-all duration-300 pointer-events-none ${
											hoveredZone === "right" ? "opacity-100" : "opacity-0"
										}`}
										style={{
											background: "linear-gradient(to left, rgba(0, 0, 0, 0.25), transparent)",
										}}
									/>
								</div>

								{image.caption && (
									<figcaption className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground">
										{image.caption}
									</figcaption>
								)}
							</figure>
						</CarouselItem>
					))}
				</CarouselContent>
				{canScrollPrev && (
					<CarouselPrevious
						className={`left-2 border-2 transition-all cursor-pointer hover:bg-foreground hover:text-background hover:border-foreground hover:scale-110 hover:shadow-lg ${
							hoveredZone === "left"
								? "bg-foreground text-background border-foreground scale-110 shadow-lg"
								: "bg-background/90 border-border"
						}`}
						onMouseEnter={() => setHoveredZone("left")}
						onMouseLeave={() => setHoveredZone(null)}
					/>
				)}
				{canScrollNext && (
					<CarouselNext
						className={`right-2 border-2 transition-all cursor-pointer hover:bg-foreground hover:text-background hover:border-foreground hover:scale-110 hover:shadow-lg ${
							hoveredZone === "right"
								? "bg-foreground text-background border-foreground scale-110 shadow-lg"
								: "bg-background/90 border-border"
						}`}
						onMouseEnter={() => setHoveredZone("right")}
						onMouseLeave={() => setHoveredZone(null)}
					/>
				)}
			</Carousel>
			</div>
		</div>
	)
}
