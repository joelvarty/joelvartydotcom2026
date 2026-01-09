/**
 * Markdown Processor with Gallery Support
 *
 * Processes markdown content using ReactMarkdown and converts gallery syntax
 * into React components. Supports multiple gallery types: carousel, masonry,
 * grid, thumbnail, stacked, comparison, tabs.
 *
 * Gallery Syntax (using fenced code blocks):
 * ```gallery:carousel
 * https://url1.jpg "Caption 1"
 * https://url2.jpg "Caption 2"
 * https://url3.jpg "Caption 3"
 * ```
 *
 * With options:
 * ```gallery:grid:columns-3
 * https://url1.jpg "Caption 1"
 * https://url2.jpg "Caption 2"
 * ```
 *
 * Supported types: carousel, masonry, grid, thumbnail, stacked, comparison, tabs
 */

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkUnwrapImages from "remark-unwrap-images"
import rehypeRaw from "rehype-raw"
import { remarkGallery } from "./remark-gallery"
import { AgilityPic } from "@agility/nextjs"
import { GalleryCarousel } from "@/components/galleries/GalleryCarousel"
import { GalleryMasonry } from "@/components/galleries/GalleryMasonry"
import { GalleryGrid } from "@/components/galleries/GalleryGrid"
import { GalleryThumbnail } from "@/components/galleries/GalleryThumbnail"
import { GalleryStacked } from "@/components/galleries/GalleryStacked"
import { GalleryComparison } from "@/components/galleries/GalleryComparison"
import { GalleryTabs } from "@/components/galleries/GalleryTabs"
import { isAgilityImage, createImageFieldFromUrl } from "@/lib/agility/image-utils"

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
 *
 * Note: ReactMarkdown parses the first URL as `src` and the rest as `title`.
 * We need to combine both to get all gallery images.
 */
function parseGallerySyntax(
	alt: string | null | undefined,
	title: string | null,
	src: string | null
): GalleryConfig | null {
	// Check if this is a gallery
	if (!alt || typeof alt !== "string" || !alt.startsWith("gallery:")) {
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

	// Parse images from src and title
	// ReactMarkdown puts the first URL in src, and the rest in title
	// Title format: "Caption 1", https://url2 "Caption 2", https://url3 "Caption 3"
	const images: GalleryImage[] = []

	// Add the first image from src if it exists
	if (src && typeof src === "string") {
		// Extract first caption from title
		// ReactMarkdown may parse as: "Caption" or Caption" (missing opening quote)
		let firstCaption: string | undefined = undefined
		if (title) {
			// Try to match quoted caption (with or without opening quote)
			const quotedMatch = title.match(/^"?([^"]+)"(?:\s*,|\s+http)/)
			if (quotedMatch) {
				firstCaption = quotedMatch[1]
			} else if (!title.includes("http")) {
				// Title is just a caption (no URLs) - remove quotes if present
				firstCaption = title.trim().replace(/^"?|"?$/g, "")
			}
		}
		images.push({
			url: src.trim(),
			caption: firstCaption,
			alt: firstCaption || "",
		})
	}

	// Parse additional images from title (format: ", https://url "caption", https://url "caption")
	if (title && title.includes("http")) {
		// Remove the first caption if it was already extracted
		let remainingTitle = title
		// Match quoted caption (with or without opening quote) followed by comma/space and URL
		const firstCaptionPattern = /^"?[^"]+"?(?:\s*,?\s*)(?=https?:\/\/)/
		if (firstCaptionPattern.test(remainingTitle)) {
			// Remove first caption and the comma/space after it
			remainingTitle = remainingTitle.replace(/^"?[^"]+"?,?\s*/, "")
		}

		// Split by URLs and parse each segment
		// Pattern: https://url "caption", https://url "caption"
		// Match URL (everything from http:// or https:// until space/comma/quote), then optional caption
		const urlPattern = /(https?:\/\/[^\s",]+)(?:\s+"([^"]+)")?(?:\s*,)?/g
		let match
		while ((match = urlPattern.exec(remainingTitle)) !== null) {
			const url = match[1]?.trim()
			const caption = match[2]?.trim()

			// Only add if URL is valid and different from src (avoid duplicates)
			if (url && url !== src && url.startsWith("http")) {
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

/**
 * Preprocess markdown to convert image-style gallery syntax into fenced code blocks.
 * Converts: ![gallery:type:options](url1 "caption1", url2 "caption2")
 * Into: ```gallery:type:options
 *       url1 "caption1"
 *       url2 "caption2"
 *       ```
 */
function preprocessMarkdown(markdown: string): string {
	// Match gallery image syntax: ![gallery:type:options](urls and captions)
	const galleryImageRegex = /!\[gallery:([a-z]+)(?::([a-z0-9-]+))?\]\(([^)]+)\)/g

	return markdown.replace(galleryImageRegex, (match, type, options, content) => {
		// Parse the content to extract URLs and captions
		// Format: url1 "caption1", url2 "caption2", url3 "caption3"
		const lines: string[] = []

		// Split by commas, but be careful with commas inside quotes
		const parts = content.split(/,\s*(?=https?:\/\/)/)

		for (const part of parts) {
			const trimmed = part.trim()
			if (trimmed) {
				// Extract URL and caption
				// Format: url "caption" or just url
				const urlMatch = trimmed.match(/^(https?:\/\/[^\s"]+)(?:\s+"([^"]+)")?$/)
				if (urlMatch) {
					const url = urlMatch[1]
					const caption = urlMatch[2]
					if (caption) {
						lines.push(`${url} "${caption}"`)
					} else {
						lines.push(url)
					}
				}
			}
		}

		// Build the fenced code block
		const galleryType = options ? `gallery:${type}:${options}` : `gallery:${type}`
		return `\`\`\`${galleryType}\n${lines.join('\n')}\n\`\`\``
	})
}

/**
 * Options for processing markdown
 */
export interface ProcessMarkdownOptions {
	/** Optional className to apply to the wrapper div */
	className?: string
}

/**
 * Process markdown content and return JSX with gallery components
 * Uses ReactMarkdown for better React integration and inline gallery rendering
 */
export function processMarkdown(markdown: string, options?: ProcessMarkdownOptions): React.ReactElement {
	// Preprocess to handle gallery syntax
	const processedMarkdown = preprocessMarkdown(markdown)

	const content = (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkBreaks, remarkUnwrapImages, remarkGallery]}
			rehypePlugins={[rehypeRaw]}
			components={{
				// Custom pre component to intercept gallery code blocks before they get dark background
				pre({ node, children, ...props }: any) {
					// Check if the child is a code element with gallery syntax
					const child = React.Children.only(children) as any
					if (child?.props?.className) {
						const match = child.props.className.match(/^language-gallery[-:]([a-z]+)(?:[-:]([a-z0-9-]+))?$/)
						if (match) {
							// This is a gallery - don't render the <pre>, just pass through to code component
							return <>{children}</>
						}
					}
					// Default pre rendering
					return <pre {...props}>{children}</pre>
				},
				// Custom code component to handle gallery syntax
				code({ node, inline, className, children, ...props }: any) {
					// Check if this is a gallery code block
					// ReactMarkdown may parse `gallery:carousel` as `language-gallery:carousel` or `language-gallery-carousel`
					if (!inline && className) {
						// Try to match both formats: gallery:type:options or gallery-type-options
						const match = className.match(/^language-gallery[-:]([a-z]+)(?:[-:]([a-z0-9-]+))?$/)
						if (match) {
							const [, type, options] = match
							// Parse the code content (image URLs and captions)
							const content = String(children).trim()
							const lines = content.split('\n')
							const images: GalleryImage[] = []

							for (const line of lines) {
								const trimmed = line.trim()
								if (!trimmed) continue

								// Match: url "caption" or just url
								const lineMatch = trimmed.match(/^([^\s"]+)(?:\s+"([^"]+)")?$/)
								if (lineMatch) {
									images.push({
										url: lineMatch[1],
										caption: lineMatch[2] || "",
										alt: lineMatch[2] || "",
									})
								}
							}

							if (images.length > 0) {
								// Parse options (e.g., "columns-3")
								const parsedOptions: Record<string, string> = {}
								let columns: number | undefined = undefined

								if (options) {
									const optionParts = options.split("-")
									if (optionParts.length === 2) {
										parsedOptions[optionParts[0]] = optionParts[1]
										if (optionParts[0] === "columns") {
											columns = parseInt(optionParts[1], 10)
										}
									}
								}

								const galleryConfig: GalleryConfig = {
									type: type as GalleryConfig["type"],
									images,
									columns,
									options: parsedOptions,
								}

								const gallery = renderGallery(galleryConfig)
								if (gallery) {
									return (
										<div className="not-prose my-8">
											{gallery}
										</div>
									)
								}
							}
						}
					}

					// Default code rendering
					return (
						<code className={className} {...props}>
							{children}
						</code>
					)
				},
				// Custom image component that handles galleries and AgilityPic
				img({ src, alt, title, ...props }) {
					// Handle src as string (ReactMarkdown can pass Blob, but we only handle strings)
					const srcString = typeof src === "string" ? src : null
					if (!srcString) return null

					// Normalize alt to string | null
					const altString = alt ? String(alt) : null
					const titleString = title ? String(title) : null

					// Check if this is a gallery
					if (altString?.startsWith("gallery:")) {
						// Try to parse gallery data from title (JSON format from preprocessing)
						let galleryConfig: GalleryConfig | null = null

						if (titleString) {
							try {
								const galleryData = JSON.parse(titleString)
								if (galleryData && galleryData.images && Array.isArray(galleryData.images)) {
									galleryConfig = {
										type: galleryData.type,
										images: galleryData.images.map((img: any) => ({
											url: img.url,
											caption: img.caption || "",
											alt: img.caption || "",
										})),
										columns: galleryData.options?.columns ? parseInt(galleryData.options.columns, 10) : undefined,
										options: galleryData.options || {},
									}
								}
							} catch (e) {
								// If JSON parsing fails, fall back to original parsing method
								galleryConfig = parseGallerySyntax(altString, titleString, srcString)
							}
						} else {
							// No title, try original parsing
							galleryConfig = parseGallerySyntax(altString, titleString, srcString)
						}

						if (galleryConfig) {
							// Render gallery component inline
							const gallery = renderGallery(galleryConfig)
							if (gallery) {
								return (
									<div className="not-prose my-8">
										{gallery}
									</div>
								)
							}
						}
					}

					// Regular image - use AgilityPic for Agility CMS images
					if (isAgilityImage(srcString)) {
						const imageField = createImageFieldFromUrl(srcString, altString || "", titleString)
						return (
							<div className="not-prose my-6">
								<AgilityPic
									image={imageField}
									fallbackWidth={800}
									className="w-full h-auto rounded-lg"
									alt={altString || titleString || ""}
									sources={[
										{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 },
										{ media: "(min-width: 1280px)", width: 1200 },
										{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 },
										{ media: "(min-width: 640px)", width: 800 },
										{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
										{ media: "(max-width: 639px)", width: 640 },
									]}
								/>
								{titleString && (
									<p className="mt-2 text-sm text-center text-muted-foreground">{titleString}</p>
								)}
							</div>
						)
					}

					// Fallback to regular img for non-Agility images
					return (
						<div className="not-prose my-6">
							<img
								src={srcString}
								alt={altString || titleString || ""}
								className="w-full h-auto rounded-lg"
								loading="lazy"
								{...props}
							/>
							{titleString && (
								<p className="mt-2 text-sm text-center text-muted-foreground">{titleString}</p>
							)}
						</div>
					)
				},
			}}
		>
			{processedMarkdown}
		</ReactMarkdown>
	)

	// Wrap in a div with optional className if provided
	if (options?.className) {
		return <div className={options.className}>{content}</div>
	}

	return content
}
