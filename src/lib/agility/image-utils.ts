/**
 * Agility CMS Image Utilities
 *
 * Shared utilities for working with Agility CMS images across the application.
 */

/**
 * Check if URL is from Agility CMS CDN
 * Supports both agilitycms.com and aglty.io domains
 */
export function isAgilityImage(url: string): boolean {
	return url.includes("agilitycms.com") || url.includes("cdn.agilitycms.com") || url.includes("aglty.io")
}

/**
 * Upper bound used for an image's intrinsic dimensions when the real ones are
 * unknown (gallery/markdown images are only given a URL).
 *
 * AgilityPic clamps each responsive <source> width to `image.width`
 * (Math.min(source.width, image.width)) to avoid upscaling past the original.
 * Hardcoding a small value here silently caps every source at that size, so a
 * retina/full-screen request for e.g. 3840px would only ever load 1200px.
 * Agility's image CDN does not upscale beyond the original anyway, so we use a
 * generous bound that lets legitimate high-resolution requests pass through.
 */
const MAX_INTRINSIC_DIMENSION = 6000

/**
 * Create an Agility CMS ImageField object from image data
 * This is used by gallery components to pass data to AgilityPic
 */
export function createImageField(image: { url: string; caption?: string; alt?: string }) {
	return {
		url: image.url,
		label: image.caption || image.alt || "",
		width: MAX_INTRINSIC_DIMENSION,
		height: MAX_INTRINSIC_DIMENSION,
		target: "",
		filesize: 0,
	} as any
}

/**
 * Create an Agility CMS ImageField object from a URL and optional text
 * Used in markdown processing where we have separate strings
 */
export function createImageFieldFromUrl(url: string, alt: string, title: string | null): any {
	return {
		url,
		label: title || alt || "",
		width: MAX_INTRINSIC_DIMENSION,
		height: MAX_INTRINSIC_DIMENSION,
		target: "",
		filesize: 0,
	}
}

/**
 * Full-bleed hero image helpers.
 *
 * The blog hero is the LCP element. To win it on slow connections it must be
 * (a) prioritized over the rest of the page and (b) discoverable in the initial
 * HTML. AgilityPic emits neither `fetchpriority` nor a preload, so the hero is
 * rendered as a plain responsive <img fetchpriority="high"> plus a matching
 * <link rel="preload"> (see BlogDetails). The img's srcSet/sizes and the
 * preload's imageSrcSet/imageSizes must be identical so the browser reuses the
 * single fetch instead of downloading twice.
 *
 * Widths target a full-bleed (100vw) image: small enough for phones, with a few
 * larger steps for tablets/retina. Agility's CDN will not upscale past the
 * original, so the upper steps are safe.
 */
const HERO_IMAGE_WIDTHS = [640, 828, 1080, 1280, 1600, 2048, 2560] as const

/** Default `src` for the hero <img> (used when srcSet can't be evaluated). */
export const HERO_IMAGE_FALLBACK_WIDTH = 1280

export const HERO_IMAGE_SIZES = "100vw"

export function agilityImageUrl(url: string, width: number): string {
	return `${url}?format=auto&w=${width}`
}

export function heroImageSrcSet(url: string): string {
	return HERO_IMAGE_WIDTHS.map((w) => `${agilityImageUrl(url, w)} ${w}w`).join(", ")
}

