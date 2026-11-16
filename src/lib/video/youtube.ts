/**
 * Find the YouTube videos a blog post embeds.
 *
 * A post embeds a video two ways: an `embed` fence (rendered by SocialEmbed as a
 * click-to-play facade) or a raw `<iframe src="https://www.youtube.com/embed/ID">`.
 * A YouTube URL in running text is a link, not an embed, so it is not counted.
 */

const YOUTUBE_ID = /(?:youtube\.com\/watch\?(?:[^\s"']*&)?v=|youtu\.be\/|youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/

/** The 11-character video ID of a YouTube URL, or null. */
export const youTubeId = (url: string | null | undefined): string | null =>
	url?.match(YOUTUBE_ID)?.[1] ?? null

export const youTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
export const youTubeEmbedUrl = (id: string) => `https://www.youtube.com/embed/${id}`
/** hqdefault exists for every video (maxresdefault does not). */
export const youTubeThumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** The IDs of the videos embedded in a post's markdown, in order, without duplicates. */
export const embeddedYouTubeIds = (markdown: string | null | undefined): string[] => {
	if (!markdown) return []
	const ids: string[] = []
	const add = (id: string | null) => { if (id && !ids.includes(id)) ids.push(id) }

	for (const fence of markdown.matchAll(/```embed\s*\r?\n([\s\S]*?)```/g)) {
		for (const line of fence[1].split(/\r?\n/)) add(youTubeId(line.trim()))
	}
	for (const iframe of markdown.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)) {
		add(youTubeId(iframe[1]))
	}
	return ids
}
