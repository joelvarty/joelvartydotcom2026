/**
 * Markdown Processor with Gallery Support
 *
 * Processes markdown content and converts gallery syntax into React components.
 * Supports multiple gallery types: carousel, masonry, grid, thumbnail, stacked, comparison, tabs.
 *
 * Gallery Syntax:
 * - ![gallery:carousel](url1.jpg "Caption 1", url2.jpg "Caption 2")
 * - ![gallery:masonry:columns-3](url1.jpg "Caption 1", url2.jpg "Caption 2")
 * - ![gallery:grid:columns-4](url1.jpg "Caption 1", url2.jpg "Caption 2")
 * - ![gallery:comparison](before.jpg "Before", after.jpg "After")
 */

import { marked } from "marked"
import React from "react"
import { GalleryCarousel } from "@/components/galleries/GalleryCarousel"
import { GalleryMasonry } from "@/components/galleries/GalleryMasonry"
import { GalleryGrid } from "@/components/galleries/GalleryGrid"
import { GalleryThumbnail } from "@/components/galleries/GalleryThumbnail"
import { GalleryStacked } from "@/components/galleries/GalleryStacked"
import { GalleryComparison } from "@/components/galleries/GalleryComparison"
import { GalleryTabs } from "@/components/galleries/GalleryTabs"

/**
 * Gallery image interface
 */
export interface GalleryImage {
	url: string
	caption?: string
	alt?: string
}

/**
 * Gallery configuration
 */
export interface GalleryConfig {
	type: "carousel" | "masonry" | "grid" | "thumbnail" | "stacked" | "comparison" | "tabs"
	images: GalleryImage[]
	columns?: number
	options?: Record<string, string>
}

/**
 * Parse gallery syntax from markdown image syntax
 * Syntax: ![gallery:type:options](url1 "caption1", url2 "caption2")
 */
function parseGallerySyntax(alt: string, title: string): GalleryConfig | null {
	// Check if this is a gallery
	if (!alt.startsWith("gallery:")) {
		return null
	}

	// Parse gallery type and options
	const parts = alt.split(":")
	const type = parts[1] as GalleryConfig["type"]
	if (!type) return null

	// Parse options (e.g., "columns-3")
	const options: Record<string, string> = {}
	if (parts[2]) {
		const optionParts = parts[2].split("-")
		if (optionParts.length === 2) {
			options[optionParts[0]] = optionParts[1]
		}
	}

	// Parse images from title (comma-separated: url "caption", url "caption")
	const images: GalleryImage[] = []
	if (title) {
		// Split by comma, but respect quoted captions
		const imageMatches = title.matchAll(/([^,"]+)(?:\s+"([^"]+)")?/g)
		for (const match of imageMatches) {
			const url = match[1].trim()
			const caption = match[2]?.trim()
			if (url) {
				images.push({
					url,
					caption,
					alt: caption || "",
				})
			}
		}
	}

	if (images.length === 0) return null

	return {
		type,
		images,
		columns: options.columns ? parseInt(options.columns, 10) : undefined,
		options,
	}
}

/**
 * Custom renderer for marked that handles gallery syntax
 */
function createMarkdownRenderer() {
	const renderer = new marked.Renderer()

	// Override image renderer to detect gallery syntax
	const originalImage = renderer.image
	;(renderer as any).image = (href: string, title: string | null, text: string) => {
		const galleryConfig = parseGallerySyntax(text, title || "")
		if (galleryConfig) {
			// Return a placeholder that we'll replace with React components
			return `<!-- GALLERY:${JSON.stringify(galleryConfig)} -->`
		}
		// Regular image
		return (originalImage as any).call(renderer, href, title, text)
	}

	return renderer
}

/**
 * Process markdown content and return JSX with gallery components
 */
export function processMarkdown(markdown: string): React.ReactElement {
	// Configure marked
	marked.setOptions({
		breaks: true,
		gfm: true,
	})

	const renderer = createMarkdownRenderer()
	const html = marked.parse(markdown, { renderer }) as string

	// Split HTML by gallery placeholders and convert to React elements
	const parts: (string | React.ReactElement)[] = []
	let lastIndex = 0
	// Match gallery comments with JSON content (handles nested objects)
	const galleryRegex = /<!-- GALLERY:(\{[^]*?\}) -->/g
	let match

	while ((match = galleryRegex.exec(html)) !== null) {
		// Add text before gallery
		if (match.index > lastIndex) {
			parts.push(html.substring(lastIndex, match.index))
		}

		// Parse and render gallery
		try {
			const config: GalleryConfig = JSON.parse(match[1])
			const galleryComponent = renderGallery(config)
			if (galleryComponent) {
				parts.push(galleryComponent)
			}
		} catch (error) {
			console.error("Error parsing gallery config:", error)
		}

		lastIndex = match.index + match[0].length
	}

	// Add remaining HTML
	if (lastIndex < html.length) {
		parts.push(html.substring(lastIndex))
	}

	// Return a fragment with all parts
	return (
		<>
			{parts.map((part, index) => {
				if (React.isValidElement(part)) {
					return <React.Fragment key={index}>{part}</React.Fragment>
				}
				return (
					<div
						key={index}
						dangerouslySetInnerHTML={{ __html: part }}
					/>
				)
			})}
		</>
	)
}

/**
 * Render the appropriate gallery component based on type
 */
function renderGallery(config: GalleryConfig): React.ReactElement | null {
	switch (config.type) {
		case "carousel":
			return <GalleryCarousel images={config.images} />
		case "masonry":
			return <GalleryMasonry images={config.images} columns={config.columns || 3} />
		case "grid":
			return <GalleryGrid images={config.images} columns={config.columns || 3} />
		case "thumbnail":
			return <GalleryThumbnail images={config.images} />
		case "stacked":
			return <GalleryStacked images={config.images} />
		case "comparison":
			return <GalleryComparison images={config.images} />
		case "tabs":
			return <GalleryTabs images={config.images} />
		default:
			return null
	}
}

