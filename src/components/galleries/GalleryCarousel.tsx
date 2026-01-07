/**
 * Gallery Carousel Component
 *
 * Displays images in a carousel/slideshow format with navigation arrows,
 * dots/pagination indicators, and keyboard/touch navigation.
 */

"use client"

import React, { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"

interface GalleryCarouselProps {
	images: GalleryImage[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
	return (
		<div className="my-8">
			<Carousel className="w-full">
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
								{isAgilityImage(image.url) ? (
									<AgilityPic
										image={createImageField(image)}
										fallbackWidth={800}
										className="h-full w-full object-contain"
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
										className="h-full w-full object-contain"
										loading="lazy"
									/>
								)}
								{image.caption && (
									<div className="absolute bottom-0 left-0 right-0 bg-background/80 p-4 text-center text-sm text-foreground">
										{image.caption}
									</div>
								)}
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	)
}

/**
 * Check if URL is from Agility CMS CDN
 */
function isAgilityImage(url: string): boolean {
	return url.includes("agilitycms.com") || url.includes("cdn.agilitycms.com")
}

/**
 * Create an Agility CMS ImageField object from a URL
 */
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

