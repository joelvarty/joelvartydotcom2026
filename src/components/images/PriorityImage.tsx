"use client"

import { agilityImageUrl, responsiveImageSrcSet } from "@/lib/agility/image-utils"

export interface PriorityImageProps {
	/** Agility CDN image URL (no query string). */
	url: string
	alt: string
	/** Candidate widths for the srcSet; capped at `intrinsicWidth`. */
	widths: readonly number[]
	/** The `sizes` value: must describe the image's real rendered width at each breakpoint. */
	sizes: string
	/** Width used for the plain `src` fallback. */
	fallbackWidth: number
	/** Original image dimensions, from the CMS image field. */
	intrinsicWidth?: number
	intrinsicHeight?: number
	className?: string
}

/**
 * The page's LCP image, fetched with high priority.
 *
 * AgilityPic can't emit `fetchpriority`, so the LCP image is rendered as a
 * plain responsive <img fetchpriority="high" loading="eager"> with a w-descriptor
 * srcSet and a `sizes` that matches its rendered width.
 *
 * The preload comes from React: during server rendering React emits
 * <link rel="preload" as="image" fetchpriority="high"> at the top of <head> for
 * any high-priority <img>, built from this img's own srcSet/sizes, so the two
 * always match and the browser makes one request. Adding our own preload (a
 * <link> or react-dom's `preload()`) only produced a second, duplicate tag.
 *
 * Why this is a client component (it has no state or effects): when a server
 * component renders an eager <img>, React's RSC server turns it into a preload
 * hint in the route's RSC payload, and the browser acts on that hint whenever
 * the payload arrives, including a <Link> prefetch. Every page that prefetches
 * the home page then fetched the home page's LCP image at high priority. As a
 * client component the preload is only in the page's own server HTML.
 *
 * Use it for one image per page: the one Lighthouse names as the LCP element.
 *
 * INTERIM: a site-side stand-in until AgilityPic in @agility/nextjs can set
 * fetchpriority itself. Once it can, swap the callers (BlogPostItem's priority
 * card, both Hero layouts) back to AgilityPic and delete this file.
 */
export function PriorityImage({
	url,
	alt,
	widths,
	sizes,
	fallbackWidth,
	intrinsicWidth,
	intrinsicHeight,
	className,
}: PriorityImageProps) {
	const maxWidth = intrinsicWidth && intrinsicWidth > 0 ? intrinsicWidth : undefined
	const srcSet = responsiveImageSrcSet(url, widths, maxWidth)
	const src = agilityImageUrl(url, maxWidth ? Math.min(fallbackWidth, maxWidth) : fallbackWidth)

	return (
		// Agility CDN images don't go through next/image.
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			srcSet={srcSet}
			sizes={sizes}
			alt={alt}
			width={maxWidth}
			height={maxWidth && intrinsicHeight && intrinsicHeight > 0 ? intrinsicHeight : undefined}
			fetchPriority="high"
			loading="eager"
			className={className}
		/>
	)
}
