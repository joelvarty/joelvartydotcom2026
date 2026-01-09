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
 * Create an Agility CMS ImageField object from image data
 * This is used by gallery components to pass data to AgilityPic
 */
export function createImageField(image: { url: string; caption?: string; alt?: string }) {
	return {
		url: image.url,
		label: image.caption || image.alt || "",
		width: 1200,
		height: 800,
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
		width: 1200,
		height: 800,
		target: "",
		filesize: 0,
	}
}
