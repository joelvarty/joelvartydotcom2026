/**
 * Gallery Masonry Component
 *
 * Displays images in a responsive masonry/Pinterest-style grid layout.
 * Captions render below each image (never overlaid). Clicking an image opens
 * the shared lightbox detail view.
 */

"use client"

import React, { useState } from "react"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"
import { Lightbox } from "./Lightbox"

interface GalleryMasonryProps {
	images: GalleryImage[]
	columns?: number
}

export function GalleryMasonry({ images, columns = 3 }: GalleryMasonryProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	return (
		<>
			<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
				{images.map((image, index) => (
					<figure
						key={index}
						className="group mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-muted/30"
						onClick={() => setSelectedIndex(index)}
					>
						<div className="overflow-hidden rounded-lg">
							{isAgilityImage(image.url) ? (
								<AgilityPic
									image={createImageField(image)}
									fallbackWidth={400}
									className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
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
									className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							)}
						</div>
						{image.caption && (
							<figcaption className="px-1 pb-1 pt-2 text-sm leading-snug text-muted-foreground">
								{image.caption}
							</figcaption>
						)}
					</figure>
				))}
				</div>
			</div>

			<Lightbox images={images} index={selectedIndex} onClose={() => setSelectedIndex(null)} />
		</>
	)
}
