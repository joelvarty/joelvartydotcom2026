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
