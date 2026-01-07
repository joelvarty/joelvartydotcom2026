/**
 * Localize URL by adding locale prefix if needed
 *
 * @param url - The URL path to localize
 * @param locale - The locale to use
 * @returns The localized URL path
 */

import { defaultLocale } from "./config"

export function localizeUrl(url: string, locale: string): string {
	// Remove leading slash for processing
	const cleanUrl = url.startsWith("/") ? url.slice(1) : url

	// If it's the default locale, return the URL without prefix
	if (locale === defaultLocale) {
		return `/${cleanUrl}`
	}

	// Otherwise, add the locale prefix
	return `/${locale}/${cleanUrl}`
}

