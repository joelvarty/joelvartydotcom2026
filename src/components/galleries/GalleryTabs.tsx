/**
 * Gallery Tabs Component
 *
 * Displays images organized by categories/tabs.
 * Each tab contains its own gallery (carousel, grid, or masonry).
 * Note: This is a simplified version. Full implementation would require
 * parsing tab structure from markdown or CMS data.
 */

"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GalleryImage } from "@/lib/markdown/processMarkdown"
import { GalleryGrid } from "./GalleryGrid"

interface GalleryTabsProps {
	images: GalleryImage[]
}

/**
 * Simplified tabs gallery - groups images by caption prefix or uses default grouping.
 * For full implementation, this would need tab structure from markdown/CMS.
 */
export function GalleryTabs({ images }: GalleryTabsProps) {
	// Group images by category (using caption prefix or default)
	const categories = new Map<string, GalleryImage[]>()

	images.forEach((image) => {
		// Try to extract category from caption (format: "Category: Caption")
		const categoryMatch = image.caption?.match(/^([^:]+):\s*(.+)$/)
		const category = categoryMatch ? categoryMatch[1].trim() : "All"
		const caption = categoryMatch ? categoryMatch[2].trim() : image.caption

		if (!categories.has(category)) {
			categories.set(category, [])
		}
		categories.get(category)!.push({
			...image,
			caption,
		})
	})

	const categoryNames = Array.from(categories.keys())

	if (categoryNames.length <= 1) {
		// If only one category, just render as grid
		return <GalleryGrid images={images} columns={3} />
	}

	return (
		<div className="my-8 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Tabs defaultValue={categoryNames[0]} className="w-full">
				<TabsList className="mb-4">
					{categoryNames.map((category) => (
						<TabsTrigger key={category} value={category}>
							{category}
						</TabsTrigger>
					))}
				</TabsList>
				{categoryNames.map((category) => (
					<TabsContent key={category} value={category}>
						<GalleryGrid images={categories.get(category) || []} columns={3} />
					</TabsContent>
				))}
			</Tabs>
			</div>
		</div>
	)
}

