import getAgilitySDK from "@/lib/cms/getAgilitySDK"
import type { ContentListRequestParams } from "@agility/content-fetch/dist/methods/getContentList"
import { defaultRevalidate } from "@/lib/cms/cacheConfig"

/**
 * Get a content list with caching information added.
 */
export const getContentList = async <T>(params: ContentListRequestParams) => {
	const agilitySDK = await getAgilitySDK()

	agilitySDK.config.fetchConfig = {
		next: {
			tags: [`agility-content-${params.referenceName.toLowerCase()}-${params.languageCode || params.locale}`],
			revalidate: defaultRevalidate,
		},
	}

	return await agilitySDK.getContentList(params)
}

