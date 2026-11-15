import "server-only";

import { cacheLife, cacheTag } from "next/cache"
import { connection } from "next/server"
import type { ContentListRequestParams } from "@agility/content-fetch/dist/methods/getContentList"
import getAgilitySDK from "@/lib/cms/getAgilitySDK"

/**
 * A content list as this site reads it. `T` is the whole ITEM type
 * (`{ contentID, fields }`) that call sites declare, not just its fields.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ContentListResult<T = any> {
	items: T[]
	totalCount: number
}

export type GetContentListParams = ContentListRequestParams & {
	/** Read staging content instead of published. Preview reads are NEVER cached. */
	preview?: boolean
}

/**
 * Get a content list by reference name.
 *
 * Published reads are cached with `"use cache"` + a cache tag, and invalidated
 * by the publish webhook in /api/revalidate. Preview reads bypass the cache.
 *
 * The tag format is a CONTRACT with /api/revalidate — do not change it without
 * changing the webhook to match.
 *
 * `T` is the item type the call site expects; the SDK's items are cast to it.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getContentList = async <T = any>({ preview = false, ...params }: GetContentListParams): Promise<ContentListResult<T>> => {

	if (preview) {
		await connection()
		return await fetchContentList(params, true) as ContentListResult<T>
	}

	return await cachedContentList(params) as ContentListResult<T>
}

const cachedContentList = async (params: ContentListRequestParams): Promise<ContentListResult> => {
	"use cache"
	cacheTag(`agility-content-${params.referenceName.toLowerCase()}-${params.languageCode || params.locale}`)
	cacheLife("days")
	return fetchContentList(params, false)
}

const fetchContentList = async (params: ContentListRequestParams, preview: boolean): Promise<ContentListResult> => {
	const agilitySDK = getAgilitySDK(preview)
	return await agilitySDK.getContentList(params)
}
