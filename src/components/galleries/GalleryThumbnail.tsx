/**
 * Gallery Thumbnail Component
 *
 * Displays a large featured image with a thumbnail strip below.
 * Clicking thumbnails changes the main image.
 */

"use client"

import React, { useState } from "react"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

interface GalleryThumbnailProps {
	images: GalleryImage[]
}

export function GalleryThumbnail({ images }: GalleryThumbnailProps) {
	const [selectedIndex, setSelectedIndex] = useState(0)

	if (images.length === 0) return null

	return (
		<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			{/* Main Image */}
			<div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
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
				<div className="mb-4 text-center text-sm text-muted-foreground">{images[selectedIndex].caption}</div>
			)}

			{/* Thumbnail Strip */}
			{images.length > 1 && (
				<div className="flex justify-center gap-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedIndex(index)}
							className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
								index === selectedIndex
									? "border-primary"
									: "border-transparent opacity-60 hover:opacity-100"
							}`}
						>
							{isAgilityImage(image.url) ? (
								<AgilityPic
									image={createImageField(image)}
									fallbackWidth={200}
									className="h-full w-full object-cover"
									sources={[
										{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 400 },
										{ media: "(min-width: 640px)", width: 200 },
									]}
								/>
							) : (
								<img
									src={image.url}
									alt={image.alt || image.caption || ""}
									className="h-full w-full object-cover"
								/>
							)}
						</button>
					))}
				</div>
			)}
			</div>
		</div>
	)
}


