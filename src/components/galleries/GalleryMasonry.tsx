/**
 * Gallery Masonry Component
 *
 * Displays images in a responsive masonry/Pinterest-style grid layout.
 * Clicking an image opens a lightbox with navigation.
 */

"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

// Simple VisuallyHidden component for accessibility
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

interface GalleryMasonryProps {
	images: GalleryImage[]
	columns?: number
}

export function GalleryMasonry({ images, columns = 3 }: GalleryMasonryProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	const openLightbox = (index: number) => {
		setSelectedIndex(index)
	}

	const closeLightbox = () => {
		setSelectedIndex(null)
	}

	const navigateImage = (direction: "prev" | "next") => {
		if (selectedIndex === null) return
		if (direction === "prev") {
			setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex)
		} else {
			setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : selectedIndex)
		}
	}

	// Keyboard navigation
	React.useEffect(() => {
		if (selectedIndex === null) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				navigateImage("prev")
			} else if (e.key === "ArrowRight") {
				navigateImage("next")
			} else if (e.key === "Escape") {
				closeLightbox()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [selectedIndex])

	return (
		<>
			<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
				{images.map((image, index) => (
					<div
						key={index}
						className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
						onClick={() => openLightbox(index)}
					>
						{isAgilityImage(image.url) ? (
							<AgilityPic
								image={createImageField(image)}
								fallbackWidth={400}
								className="w-full h-auto"
								sources={[
									{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 800 },
									{ media: "(min-width: 1280px)", width: 400 },
									{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 600 },
									{ media: "(min-width: 640px)", width: 300 },
								]}
							/>
						) : (
							<img
								src={image.url}
								alt={image.alt || image.caption || ""}
								className="w-full h-auto"
								loading="lazy"
							/>
						)}
						{image.caption && (
							<div className="p-2 text-xs text-muted-foreground">{image.caption}</div>
						)}
					</div>
				))}
				</div>
			</div>

			<Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
				<DialogContent className="max-w-7xl border-none bg-transparent p-0 shadow-none">
					{selectedIndex !== null && (
						<div className="relative">
							<VisuallyHidden>
								<DialogTitle>Image {selectedIndex + 1} of {images.length}</DialogTitle>
							</VisuallyHidden>
							{/* Image Counter Badge */}
							{images.length > 1 && (
								<div className="absolute left-4 top-4 z-10 rounded-full bg-black/80 px-3 py-1.5 text-sm font-medium text-white">
									{selectedIndex + 1} / {images.length}
								</div>
							)}

							{/* Main Image */}
							<div className="relative">
								{isAgilityImage(images[selectedIndex].url) ? (
									<AgilityPic
										image={createImageField(images[selectedIndex])}
										fallbackWidth={1920}
										className="h-auto w-full rounded-lg"
										sources={[
											{ media: "(min-width: 1920px) and (min-resolution: 2dppx)", width: 3840 },
											{ media: "(min-width: 1920px)", width: 1920 },
											{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2560 },
											{ media: "(min-width: 1280px)", width: 1280 },
											{ media: "(min-resolution: 2dppx)", width: 2048 },
										]}
									/>
								) : (
									<img
										src={images[selectedIndex].url}
										alt={images[selectedIndex].alt || images[selectedIndex].caption || ""}
										className="h-auto w-full rounded-lg"
									/>
								)}

								{/* Caption Overlay */}
								{images[selectedIndex].caption && (
									<div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/90 to-transparent p-4">
										<p className="text-center text-sm text-white">{images[selectedIndex].caption}</p>
									</div>
								)}
							</div>

							{/* Navigation Buttons */}
							{images.length > 1 && (
								<>
									<button
										onClick={() => navigateImage("prev")}
										disabled={selectedIndex === 0}
										className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed"
									>
										<ChevronLeft className="h-6 w-6" />
									</button>
									<button
										onClick={() => navigateImage("next")}
										disabled={selectedIndex === images.length - 1}
										className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed"
									>
										<ChevronRight className="h-6 w-6" />
									</button>
								</>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}


