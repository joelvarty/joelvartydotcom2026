/**
 * Gallery Grid Component
 *
 * Displays images in a uniform grid layout with equal-sized cells.
 * Thumbnails stay clean (no caption overlay) - captions are shown in the
 * lightbox detail view when an image is opened.
 */

"use client"

import React, { useState } from "react"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { Expand } from "lucide-react"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"
import { Lightbox } from "./Lightbox"

interface GalleryGridProps {
	images: GalleryImage[]
	columns?: number
}

export function GalleryGrid({ images, columns = 3 }: GalleryGridProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	const gridCols = {
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
	}[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"

	return (
		<>
			<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
				<div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid ${gridCols} gap-4`}>
				{images.map((image, index) => (
					<button
						key={index}
						type="button"
						aria-label={image.caption ? `View: ${image.caption}` : `View image ${index + 1}`}
						className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						onClick={() => setSelectedIndex(index)}
					>
						{isAgilityImage(image.url) ? (
							<AgilityPic
								image={createImageField(image)}
								fallbackWidth={400}
								className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								sources={[
									{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 1600 },
									{ media: "(min-width: 1280px)", width: 800 },
									{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1200 },
									{ media: "(min-width: 640px)", width: 600 },
									{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
									{ media: "(max-width: 639px)", width: 640 },
								]}
							/>
						) : (
							<img
								src={image.url}
								alt={image.alt || image.caption || ""}
								className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						)}
						{/* Subtle hover hint that the image opens a detail view */}
						<span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
							<Expand className="h-6 w-6 text-white drop-shadow" />
						</span>
					</button>
				))}
				</div>
			</div>

			<Lightbox images={images} index={selectedIndex} onClose={() => setSelectedIndex(null)} />
		</>
	)
}
