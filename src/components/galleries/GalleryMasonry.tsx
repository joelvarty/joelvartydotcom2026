/**
 * Gallery Masonry Component
 *
 * Displays images in a responsive masonry/Pinterest-style grid layout.
 * Clicking an image opens a lightbox with navigation.
 */

"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

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
			setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)
		} else {
			setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)
		}
	}

	return (
		<>
			<div className="my-8 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
				{images.map((image, index) => (
					<div
						key={index}
						className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-muted transition-opacity hover:opacity-90"
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

			<Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
				<DialogContent className="max-w-7xl p-0">
					{selectedIndex !== null && (
						<div className="relative">
							<button
								onClick={closeLightbox}
								className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background"
							>
								<X className="h-5 w-5" />
							</button>
							<div className="relative aspect-video w-full overflow-hidden bg-muted">
								{isAgilityImage(images[selectedIndex].url) ? (
									<AgilityPic
										image={createImageField(images[selectedIndex])}
										fallbackWidth={1920}
										className="h-full w-full object-contain"
										sources={[
											{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
											{ media: "(min-width: 1280px)", width: 1920 },
											{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
											{ media: "(min-width: 640px)", width: 1280 },
										]}
									/>
								) : (
									<img
										src={images[selectedIndex].url}
										alt={images[selectedIndex].alt || images[selectedIndex].caption || ""}
										className="h-full w-full object-contain"
									/>
								)}
							</div>
							{images[selectedIndex].caption && (
								<div className="p-4 text-center text-sm text-foreground">
									{images[selectedIndex].caption}
								</div>
							)}
							{images.length > 1 && (
								<>
									<button
										onClick={() => navigateImage("prev")}
										className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background"
									>
										<ChevronLeft className="h-6 w-6" />
									</button>
									<button
										onClick={() => navigateImage("next")}
										className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background"
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

function isAgilityImage(url: string): boolean {
	return url.includes("agilitycms.com") || url.includes("cdn.agilitycms.com")
}

function createImageField(image: GalleryImage) {
	return {
		url: image.url,
		label: image.caption || image.alt || "",
		width: 0,
		height: 0,
		target: "",
		filesize: 0,
	} as any
}

