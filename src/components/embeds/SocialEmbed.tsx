/**
 * Social Media Embed Component
 *
 * Renders embedded content from Facebook, YouTube, and Instagram.
 * Automatically detects the platform from the URL and renders the appropriate embed.
 *
 * Usage in markdown:
 * ```embed
 * https://www.youtube.com/watch?v=VIDEO_ID
 * ```
 */

"use client"

import React from "react"

export type EmbedPlatform = "youtube" | "facebook" | "instagram" | "unknown"

export interface EmbedConfig {
	platform: EmbedPlatform
	url: string
	videoId?: string
}

/**
 * Detect the platform and extract relevant IDs from a URL
 */
export function parseEmbedUrl(url: string): EmbedConfig {
	const trimmedUrl = url.trim()

	// YouTube patterns
	// - youtube.com/watch?v=VIDEO_ID
	// - youtu.be/VIDEO_ID
	// - youtube.com/embed/VIDEO_ID
	// - youtube.com/shorts/VIDEO_ID
	const youtubePatterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
	]

	for (const pattern of youtubePatterns) {
		const match = trimmedUrl.match(pattern)
		if (match) {
			return {
				platform: "youtube",
				url: trimmedUrl,
				videoId: match[1],
			}
		}
	}

	// Facebook patterns
	// - facebook.com/reel/ID
	// - facebook.com/watch?v=ID
	// - facebook.com/*/videos/ID
	// - facebook.com/*/posts/ID
	// - fb.watch/ID
	if (
		trimmedUrl.includes("facebook.com") ||
		trimmedUrl.includes("fb.com") ||
		trimmedUrl.includes("fb.watch")
	) {
		return {
			platform: "facebook",
			url: trimmedUrl,
		}
	}

	// Instagram patterns
	// - instagram.com/p/POST_ID
	// - instagram.com/reel/REEL_ID
	// - instagram.com/tv/TV_ID
	if (trimmedUrl.includes("instagram.com")) {
		return {
			platform: "instagram",
			url: trimmedUrl,
		}
	}

	return {
		platform: "unknown",
		url: trimmedUrl,
	}
}

interface SocialEmbedProps {
	url: string
}

export function SocialEmbed({ url }: SocialEmbedProps) {
	const config = parseEmbedUrl(url)

	switch (config.platform) {
		case "youtube":
			return <YouTubeEmbed videoId={config.videoId!} />
		case "facebook":
			return <FacebookEmbed url={config.url} />
		case "instagram":
			return <InstagramEmbed url={config.url} />
		default:
			// Unknown platform - render as a link
			return (
				<div className="my-4 p-4 border rounded-lg bg-muted/30">
					<p className="text-sm text-muted-foreground">
						Unsupported embed URL:{" "}
						<a href={config.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
							{config.url}
						</a>
					</p>
				</div>
			)
	}
}

/**
 * YouTube Embed Component
 */
function YouTubeEmbed({ videoId }: { videoId: string }) {
	return (
		<div className="my-6 flex justify-center">
			<div className="w-full max-w-3xl aspect-video">
				<iframe
					src={`https://www.youtube.com/embed/${videoId}`}
					title="YouTube video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="w-full h-full rounded-lg"
					style={{ border: "none" }}
				/>
			</div>
		</div>
	)
}

/**
 * Facebook Embed Component
 *
 * Uses Facebook's plugins endpoint for videos and posts.
 * This approach doesn't require the JS SDK.
 */
function FacebookEmbed({ url }: { url: string }) {
	// Determine if this is a video/reel or a regular post
	const isVideo = url.includes("/reel/") || url.includes("/videos/") || url.includes("/watch") || url.includes("fb.watch")

	const encodedUrl = encodeURIComponent(url)

	if (isVideo) {
		// Video embed - use the video plugin
		// Default to portrait orientation for reels, landscape for regular videos
		const isReel = url.includes("/reel/")
		const width = isReel ? 350 : 560
		const height = isReel ? 622 : 315

		return (
			<div className="my-6 flex justify-center">
				<iframe
					src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=${width}`}
					width={width}
					height={height}
					style={{ border: "none", overflow: "hidden" }}
					scrolling="no"
					frameBorder="0"
					allowFullScreen
					allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
					className="rounded-lg max-w-full"
				/>
			</div>
		)
	} else {
		// Post embed - use the post plugin
		return (
			<div className="my-6 flex justify-center">
				<iframe
					src={`https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`}
					width={500}
					height={600}
					style={{ border: "none", overflow: "hidden" }}
					scrolling="no"
					frameBorder="0"
					allowFullScreen
					allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
					className="rounded-lg max-w-full"
				/>
			</div>
		)
	}
}

/**
 * Instagram Embed Component
 *
 * Uses Instagram's embed endpoint.
 */
function InstagramEmbed({ url }: { url: string }) {
	// Extract the post/reel ID and type from the URL
	// Format: instagram.com/p/POST_ID or instagram.com/reel/REEL_ID
	const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/)

	if (!match) {
		return (
			<div className="my-4 p-4 border rounded-lg bg-muted/30">
				<p className="text-sm text-muted-foreground">
					Could not parse Instagram URL:{" "}
					<a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
						{url}
					</a>
				</p>
			</div>
		)
	}

	const [, type, postId] = match
	const embedUrl = `https://www.instagram.com/${type}/${postId}/embed`

	// Reels are typically portrait, posts can vary
	const isReel = type === "reel"
	const width = isReel ? 400 : 500
	const height = isReel ? 714 : 600

	return (
		<div className="my-6 flex justify-center">
			<iframe
				src={embedUrl}
				width={width}
				height={height}
				frameBorder="0"
				scrolling="no"
				allowFullScreen
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
				className="rounded-lg max-w-full"
				style={{ border: "none" }}
			/>
		</div>
	)
}
