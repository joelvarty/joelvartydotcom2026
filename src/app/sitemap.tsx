import { getSitemapFlat } from "@/lib/cms/getSitemapFlat"
import { locales, defaultLocale } from "@/lib/i18n/config"
import type { MetadataRoute } from "next"

/**
 * Sitemap Generator
 *
 * Generates a sitemap from Agility CMS pages using getSitemapFlat()
 * Iterates through locales and generates entries for each visible page.
 * Published content only, through the cached getSitemapFlat primitive (the
 * publish webhook invalidates its tag). No `lastModified`: the sitemap nodes
 * carry no dates, and stamping every URL with "now" told crawlers that every
 * page changed on every build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const allSitemapEntries: MetadataRoute.Sitemap = []
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.joelvarty.com"

	// Generate sitemap entries for each locale
	for (const locale of locales) {
		const sitemapData = await getSitemapFlat({
			channelName: process.env.AGILITY_SITEMAP || "website",
			languageCode: locale,
			preview: false,
		})

		if (!sitemapData) continue

		const localeEntries = Object.keys(sitemapData)
			.filter((path) => {
				const node = sitemapData[path]
				// Skip folders and redirects
				if (node.isFolder || node.redirect) {
					return false
				}
				// Only include pages visible in sitemap
				if (!node.visible?.sitemap) {
					return false
				}
				return true
			})
			.map((path, index) => {
				// For default locale, don't add locale prefix to URL
				const localizedPath =
					locale === defaultLocale ? path : `/${locale}${path}`

				return {
					url:
						index === 0 && path === "/"
							? baseUrl
							: `${baseUrl}${localizedPath}`,
					changeFrequency: "daily" as const,
					priority: path === "/" ? 1.0 : 0.8,
				}
			})

		allSitemapEntries.push(...localeEntries)
	}

	return allSitemapEntries
}
