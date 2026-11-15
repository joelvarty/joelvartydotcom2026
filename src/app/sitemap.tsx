import { getSiteIndex } from "@/lib/cms-content/getSiteIndex"
import { locales } from "@/lib/i18n/config"
import type { MetadataRoute } from "next"

/**
 * sitemap.xml, from the published Agility sitemap (via getSiteIndex).
 *
 * - The home node is listed once, at `/` (never `/home`).
 * - Pages hidden from the sitemap in Agility are left out.
 * - Posts carry `lastModified` from the CMS. Other pages carry none: the sitemap
 *   has no dates for them, and stamping "now" would claim every page changed on
 *   every build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = []

	for (const locale of locales) {
		const index = await getSiteIndex(locale)
		for (const page of index) {
			if (!page.inSitemap) continue
			//date only: the CMS timestamps carry no time zone
			const lastModified = (page.modified || page.publishedDate)?.slice(0, 10)
			entries.push({
				url: page.url,
				...(lastModified ? { lastModified } : {}),
				priority: page.path === "/" ? 1.0 : page.isPost ? 0.7 : 0.8,
			})
		}
	}

	return entries
}
