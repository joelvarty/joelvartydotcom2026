/**
 * Social Media Embed Component
 *
 * Renders embedded content from Facebook, YouTube, Instagram, and TikTok.
 * Automatically detects the platform from the URL and renders the appropriate embed.
 *
 * Embed implementations:
 * - YouTube: Responsive iframe with aspect-ratio CSS
 * - Facebook: Plugin iframe embeds (video.php/post.php)
 * - Instagram: Official blockquote + embed.js script (fully responsive)
 * - TikTok: Official blockquote + embed.js script (fully responsive)
 *
 * Usage in markdown:
 * ```embed
 * https://www.youtube.com/watch?v=VIDEO_ID
 * ```
 */

"use client"

import React, { useEffect, useRef } from "react"

export type EmbedPlatform = "youtube" | "facebook" | "instagram" | "tiktok" | "unknown"

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

	// TikTok patterns
	// - tiktok.com/@username/video/VIDEO_ID
	// - vm.tiktok.com/SHORT_CODE
	// - tiktok.com/t/SHORT_CODE
	if (trimmedUrl.includes("tiktok.com")) {
		// Try to extract video ID from full URL
		const videoMatch = trimmedUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)
		return {
			platform: "tiktok",
			url: trimmedUrl,
			videoId: videoMatch ? videoMatch[1] : undefined,
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
		case "tiktok":
			return <TikTokEmbed url={config.url} videoId={config.videoId} />
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
					loading="lazy"
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
					loading="lazy"
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
					loading="lazy"
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
 * Uses Instagram's official blockquote embed approach with their embed.js script.
 * This provides a fully responsive, native-looking embed.
 */
function InstagramEmbed({ url }: { url: string }) {
	const containerRef = useRef<HTMLDivElement>(null)

	// Extract the post/reel ID and type from the URL
	// Format: instagram.com/p/POST_ID or instagram.com/reel/REEL_ID
	const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/)

	useEffect(() => {
		// Load Instagram embed script if not already loaded
		const loadInstagramEmbed = () => {
			if (!(window as any).instgrm) {
				const script = document.createElement("script")
				script.src = "https://www.instagram.com/embed.js"
				script.async = true
				script.onload = () => {
					if ((window as any).instgrm) {
						(window as any).instgrm.Embeds.process()
					}
				}
				document.body.appendChild(script)
			} else {
				// Script already loaded, just process embeds
				(window as any).instgrm.Embeds.process()
			}
		}

		loadInstagramEmbed()
	}, [url])

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
	const permalink = `https://www.instagram.com/${type}/${postId}/`

	// Reels are vertical videos - use narrower width
	// Regular posts can be wider
	const isReel = type === "reel"
	const maxWidth = isReel ? "400px" : "540px"

	return (
		<div ref={containerRef} className="my-6 flex justify-center">
			<blockquote
				className="instagram-media"
				data-instgrm-captioned
				data-instgrm-permalink={permalink}
				data-instgrm-version="14"
				style={{
					background: "#FFF",
					border: 0,
					borderRadius: "3px",
					boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
					margin: "1px",
					maxWidth,
					minWidth: "326px",
					padding: 0,
					width: "calc(100% - 2px)",
				}}
			>
				<div style={{ padding: "16px" }}>
					<a
						href={permalink}
						style={{
							background: "#FFFFFF",
							lineHeight: 0,
							padding: 0,
							textAlign: "center",
							textDecoration: "none",
							width: "100%",
						}}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<div style={{ backgroundColor: "#F4F4F4", borderRadius: "50%", flexGrow: 0, height: "40px", marginRight: "14px", width: "40px" }} />
							<div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
								<div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", marginBottom: "6px", width: "100px" }} />
								<div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", width: "60px" }} />
							</div>
						</div>
						<div style={{ padding: "19% 0" }} />
						<div style={{ display: "block", height: "50px", margin: "0 auto 12px", width: "50px" }}>
							<svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<g transform="translate(-511.000000, -20.000000)" fill="#000000">
										<path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631" />
									</g>
								</g>
							</svg>
						</div>
						<div style={{ paddingTop: "8px" }}>
							<div style={{ color: "#3897f0", fontFamily: "Arial,sans-serif", fontSize: "14px", fontStyle: "normal", fontWeight: 550, lineHeight: "18px" }}>
								View this post on Instagram
							</div>
						</div>
						<div style={{ padding: "12.5% 0" }} />
					</a>
				</div>
			</blockquote>
		</div>
	)
}

/**
 * TikTok Embed Component
 *
 * Uses TikTok's official blockquote embed approach with their embed.js script.
 * This provides a fully responsive, native-looking embed.
 */
function TikTokEmbed({ url, videoId }: { url: string; videoId?: string }) {
	const containerRef = useRef<HTMLDivElement>(null)

	// Extract username and video ID from the URL
	// Format: tiktok.com/@username/video/VIDEO_ID
	const match = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/)

	useEffect(() => {
		// Load TikTok embed script if not already loaded
		const loadTikTokEmbed = () => {
			if (!(window as any).tiktokEmbed) {
				const script = document.createElement("script")
				script.src = "https://www.tiktok.com/embed.js"
				script.async = true
				;(window as any).tiktokEmbed = true
				document.body.appendChild(script)
			}
		}

		loadTikTokEmbed()
	}, [url])

	// If we can parse the full URL with username and video ID
	if (match) {
		const [, username, vidId] = match
		const permalink = `https://www.tiktok.com/@${username}/video/${vidId}`

		return (
			<div ref={containerRef} className="my-6 flex justify-center">
				<blockquote
					className="tiktok-embed"
					cite={permalink}
					data-video-id={vidId}
					style={{
						maxWidth: "605px",
						minWidth: "325px",
					}}
				>
					<section>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={permalink}
						>
							Loading TikTok...
						</a>
					</section>
				</blockquote>
			</div>
		)
	}

	// If we have just a video ID (from parsing earlier)
	if (videoId) {
		return (
			<div ref={containerRef} className="my-6 flex justify-center">
				<blockquote
					className="tiktok-embed"
					cite={url}
					data-video-id={videoId}
					style={{
						maxWidth: "605px",
						minWidth: "325px",
					}}
				>
					<section>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={url}
						>
							Loading TikTok...
						</a>
					</section>
				</blockquote>
			</div>
		)
	}

	// For short URLs or URLs we couldn't parse, show a link
	// (TikTok short URLs require server-side redirect resolution)
	return (
		<div className="my-6 flex justify-center">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
			>
				<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
					<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
				</svg>
				Watch on TikTok
			</a>
		</div>
	)
}
