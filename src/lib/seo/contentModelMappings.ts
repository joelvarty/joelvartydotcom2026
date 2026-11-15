import type { JsonLdNode, TransformContext } from "@agility/geo"
import type { ContentItem } from "@agility/content-fetch"
import { embeddedYouTubeIds, youTubeId, youTubeEmbedUrl, youTubeThumbnailUrl, youTubeWatchUrl } from "@/lib/video/youtube"
import { articleId, personId, ref, videoId, webPageId, webSiteId } from "./schema"

/**
 * Content model -> schema.org mappings.
 *
 * Structured data for an item is built from the item's own fields, so it can't
 * drift from what the page shows: change a post's title and its `headline`
 * changes with it. Anything the editor types into the GEO tab's JSON-LD field
 * is merged into the same graph by `@id` (and wins).
 *
 * Keyed by the content model's name (`item.properties.definitionName`). Each
 * mapper returns the nodes to add to the page's single `@graph`.
 */
type Mapper = (item: ContentItem, ctx: TransformContext) => JsonLdNode[]

interface BlogPostFields {
	title?: string
	excerpt?: string
	content?: string
	publishedDate?: string
	featuredImage?: { url?: string; label?: string; width?: number; height?: number }
	/** Optional companion-page fields: the video, and its length as ISO 8601 (PT8M30S). */
	videoUrl?: string
	videoDuration?: string
	category?: { fields?: { name?: string } }
	series?: { fields?: { title?: string } }
	tags?: { fields?: { name?: string } }[]
}

/** A heading may start with a markdown "# Title" line, which BlogDetails shows instead of the title field. */
const headlineOf = (fields: BlogPostFields): string | undefined => {
	const h1 = (fields.content || "").match(/^#\s+(.+?)\s*$/m)?.[1]
	return (h1 || fields.title)?.trim() || undefined
}

/** BlogPost -> BlogPosting, plus a VideoObject for each YouTube video it embeds. */
const blogPost: Mapper = (item, { url, geo, locale }) => {
	const fields = item.fields as BlogPostFields
	const nodes: JsonLdNode[] = []

	const headline = headlineOf(fields)
	// The GEO tab's Summary is the answer-first description; else the post's excerpt.
	const description = geo.summary || fields.excerpt || geo.description || undefined
	const published = fields.publishedDate || undefined
	// properties.modified is when the item last changed in the CMS; never earlier than the publish date.
	//date only: the CMS timestamp carries no time zone
	const modified = item.properties?.modified ? String(item.properties.modified).slice(0, 10) : undefined
	const dateModified = modified && published && new Date(modified) < new Date(published) ? published : (modified || published)

	const post: JsonLdNode = {
		"@type": "BlogPosting",
		"@id": articleId(url),
		mainEntityOfPage: ref(webPageId(url)),
		isPartOf: ref(webSiteId),
		author: ref(personId),
		publisher: ref(personId),
		url,
	}
	if (headline) post.headline = headline
	if (description) post.description = description
	if (published) post.datePublished = published
	if (dateModified) post.dateModified = dateModified
	if (locale) post.inLanguage = locale.replace(/-([a-z]+)$/, (_, r: string) => `-${r.toUpperCase()}`)
	if (fields.featuredImage?.url) {
		post.image = {
			"@type": "ImageObject",
			url: fields.featuredImage.url,
			...(fields.featuredImage.label ? { caption: fields.featuredImage.label } : {}),
			...(fields.featuredImage.width ? { width: fields.featuredImage.width, height: fields.featuredImage.height } : {}),
		}
	}
	const section = fields.category?.fields?.name
	if (section) post.articleSection = section
	const keywords = (fields.tags || []).map((t) => t.fields?.name).filter(Boolean)
	if (keywords.length) post.keywords = keywords.join(", ")

	// Videos: a companion-page video field first (when the model has one), then
	// anything embedded in the body. Each becomes its own VideoObject so a video
	// search result can point back at this post.
	const ids = embeddedYouTubeIds(fields.content)
	const fieldVideo = youTubeId(fields.videoUrl)
	const videoIds = fieldVideo ? [fieldVideo, ...ids.filter((id) => id !== fieldVideo)] : ids

	videoIds.forEach((id, i) => {
		const node: JsonLdNode = {
			"@type": "VideoObject",
			"@id": videoId(url, i + 1),
			name: videoIds.length > 1 ? `${headline} (video ${i + 1})` : headline,
			thumbnailUrl: youTubeThumbnailUrl(id),
			embedUrl: youTubeEmbedUrl(id),
			url: youTubeWatchUrl(id),
			author: ref(personId),
			// The post's date: the day the video appeared here. YouTube's own upload date
			// isn't available without the YouTube API.
			...(published ? { uploadDate: published } : {}),
			...(description ? { description } : {}),
			isPartOf: ref(articleId(url)),
		}
		// the duration field describes the companion video (the first one)
		if (i === 0 && fieldVideo && /^P(T|\d)/.test(fields.videoDuration || "")) node.duration = fields.videoDuration
		nodes.push(node)
	})
	if (videoIds.length) post.video = videoIds.map((_, i) => ref(videoId(url, i + 1)))

	nodes.unshift(post)
	return nodes
}

export const contentModelMappings: Record<string, Mapper> = {
	BlogPost: blogPost,
}
