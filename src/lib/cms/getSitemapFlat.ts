import getAgilitySDK from "@/lib/cms/getAgilitySDK"
import { type SitemapFlatRequestParams } from "@agility/content-fetch/dist/methods/getSitemapFlat"
import { defaultRevalidate } from "@/lib/cms/cacheConfig"

/**
 * Get the flat sitemap for the given language code, with caching information added.
 */
export const getSitemapFlat = async (params: SitemapFlatRequestParams) => {
	const agilitySDK = await getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-sitemap-flat-${params.languageCode || params.locale}`],
			revalidate: defaultRevalidate,
		},
	}

	return await agilitySDK.getSitemapFlat(params)
}

