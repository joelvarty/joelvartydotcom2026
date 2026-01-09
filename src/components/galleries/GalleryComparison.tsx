/**
 * Gallery Comparison Component
 *
 * Displays a before/after comparison with a slider to reveal the after image.
 * Requires exactly 2 images: before and after.
 */

"use client"

import React, { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { AgilityPic } from "@agility/nextjs"
import { isAgilityImage, createImageField } from "@/lib/agility/image-utils"

interface GalleryComparisonProps {
	images: GalleryImage[]
}

export function GalleryComparison({ images }: GalleryComparisonProps) {
	const [sliderValue, setSliderValue] = useState([50])

	if (images.length !== 2) {
		return (
			<div className="my-8 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
				Comparison gallery requires exactly 2 images (before and after).
			</div>
		)
	}

	const [before, after] = images
	const percentage = sliderValue[0]

	return (
		<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="relative aspect-video w-full overflow-hidden rounded-lg">
				{/* Before Image (Background) */}
				<div className="absolute inset-0">
					{isAgilityImage(before.url) ? (
						<AgilityPic
							image={createImageField(before)}
							fallbackWidth={1920}
							className="h-full w-full object-cover"
							sources={[
								{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
								{ media: "(min-width: 1280px)", width: 1920 },
								{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
								{ media: "(min-width: 640px)", width: 1280 },
							]}
						/>
					) : (
						<img
							src={before.url}
							alt={before.alt || before.caption || "Before"}
							className="h-full w-full object-cover"
						/>
					)}
				</div>

				{/* After Image (Clipped) */}
				<div
					className="absolute inset-0 overflow-hidden"
					style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
				>
					{isAgilityImage(after.url) ? (
						<AgilityPic
							image={createImageField(after)}
							fallbackWidth={1920}
							className="h-full w-full object-cover"
							sources={[
								{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
								{ media: "(min-width: 1280px)", width: 1920 },
								{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
								{ media: "(min-width: 640px)", width: 1280 },
							]}
						/>
					) : (
						<img
							src={after.url}
							alt={after.alt || after.caption || "After"}
							className="h-full w-full object-cover"
						/>
					)}
				</div>

				{/* Slider */}
				<div className="absolute inset-0 flex items-center">
					<div
						className="relative h-full w-1 bg-primary"
						style={{ left: `${percentage}%` }}
					>
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary p-2 shadow-lg">
							<div className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>

			{/* Slider Control */}
			<div className="mt-4 px-4">
				<Slider
					value={sliderValue}
					onValueChange={setSliderValue}
					max={100}
					step={1}
					className="w-full"
				/>
			</div>

			{/* Captions */}
			<div className="mt-4 flex justify-between text-sm text-muted-foreground">
				<div>{before.caption || "Before"}</div>
				<div>{after.caption || "After"}</div>
			</div>
			</div>
		</div>
	)
}


