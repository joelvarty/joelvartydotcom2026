/**
 * Substack Publishing Orchestrator
 *
 * Fetches a blog post from Agility CMS, converts it to TipTap format,
 * and creates or updates it on Substack.
 *
 * Called from the revalidation webhook via next/server after().
 */

import agilitySDK from "@agility/content-fetch"
import { markdownToTipTap } from "./markdownToTipTap"
import { findExistingPost, createDraft, updateDraft, publishDraft } from "./substackClient"

interface PublishParams {
	contentID: number
	languageCode: string
}

export async function publishToSubstack({ contentID, languageCode }: PublishParams): Promise<void> {
	// Gate checks
	if (process.env.SUBSTACK_ENABLED !== "true") {
		return
	}

	if (!process.env.SUBSTACK_SID) {
		console.warn("[substack] SUBSTACK_SID is not set, skipping publish")
		return
	}

	if (!process.env.SUBSTACK_PUBLICATION) {
		console.warn("[substack] SUBSTACK_PUBLICATION is not set, skipping publish")
		return
	}

	try {
		console.info(`[substack] Publishing contentID=${contentID} (${languageCode})`)

		// Fetch content item directly from Agility API with no caching
		// We bypass the cached getContentItem because the content was just published
		const agilityClient = agilitySDK.getApi({
			guid: process.env.AGILITY_GUID,
			apiKey: process.env.AGILITY_API_FETCH_KEY,
		})
		agilityClient.config.fetchConfig = { cache: "no-store" }

		const item = await agilityClient.getContentItem({
			contentID,
			languageCode,
		})

		if (!item?.fields) {
			console.warn(`[substack] Content item ${contentID} not found or has no fields`)
			return
		}

		const fields = item.fields as Record<string, unknown>

		// Extract fields (handle both casings from Agility CMS)
		const title = (fields.title || fields.Title) as string | undefined
		const slug = (fields.slug || fields.Slug) as string | undefined
		const excerpt = (fields.excerpt || fields.Excerpt) as string | undefined
		const content = (fields.content || fields.Content) as string | undefined
		const featuredImage = (fields.featuredImage || fields.FeaturedImage) as { url?: string } | undefined

		if (!title || !slug) {
			console.warn(`[substack] Post ${contentID} missing title or slug, skipping`)
			return
		}

		if (!content) {
			console.warn(`[substack] Post ${contentID} has no content, skipping`)
			return
		}

		// Strip any leading h1 from markdown (matches BlogDetails.tsx behavior)
		let markdownContent = content.trim()
		const h1Match = markdownContent.match(/^#\s+(.+?)$/m)
		if (h1Match) {
			markdownContent = markdownContent.replace(/^#\s+.+?$\n?/m, "").trim()
		}

		// Convert markdown to TipTap JSON
		const tipTapBody = markdownToTipTap(markdownContent)

		const coverImageUrl = featuredImage?.url || undefined

		// Check for existing post on Substack
		const existing = await findExistingPost(slug)

		if (existing) {
			// Update existing post
			await updateDraft(existing.id, {
				title,
				subtitle: excerpt,
				body: tipTapBody,
				coverImageUrl,
			})
			console.info(`[substack] Updated existing post: id=${existing.id}, slug=${slug}`)
		} else {
			// Create new draft and publish
			const draft = await createDraft({
				title,
				subtitle: excerpt,
				body: tipTapBody,
				coverImageUrl,
			})
			await publishDraft(draft.id, false)
			console.info(`[substack] Created and published new post: id=${draft.id}, slug=${slug}`)
		}
	} catch (err) {
		// Never throw -- this runs in after() and must not crash the process
		console.error("[substack] Error publishing to Substack:", err)
	}
}
