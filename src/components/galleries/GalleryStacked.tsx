/**
 * Gallery Stacked Component
 *
 * Displays images stacked vertically, one after another.
 * Good for step-by-step tutorials or sequential content.
 */

"use client"

import React from "react"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

interface GalleryStackedProps {
	images: GalleryImage[]
}

export function GalleryStacked({ images }: GalleryStackedProps) {
	return (
		<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
			{images.map((image, index) => (
				<figure key={index} className="m-0 w-full">
					<div className="relative w-full overflow-hidden rounded-lg">
						{isAgilityImage(image.url) ? (
							<AgilityPic
								image={createImageField(image)}
								fallbackWidth={1200}
								className="w-full h-auto"
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
								className="w-full h-auto"
								loading="lazy"
							/>
						)}
					</div>
					{image.caption && (
						<figcaption className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground">
							{image.caption}
						</figcaption>
					)}
				</figure>
			))}
			</div>
		</div>
	)
}


