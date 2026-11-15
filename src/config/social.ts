/**
 * Joel's profiles elsewhere: the ONE list to edit.
 *
 * It drives the header icons (`header: true`), the footer "Connect" links, the
 * Person's `sameAs` in every page's JSON-LD, twitter:creator and llms.txt.
 *
 * Only list accounts that exist and are public. A `sameAs` URL that 404s weakens
 * the entity instead of strengthening it, so add a profile here the day the
 * account goes live, and set `enabled: false` (rather than deleting it) to hide
 * one for a while.
 *
 * Handles are `joelvarty` everywhere except TikTok and Bluesky, which use the
 * domain: TikTok `@joelvarty.com` (`joelvarty` was taken), Bluesky
 * `@joelvarty.com` (verified by the `_atproto.joelvarty.com` DNS TXT record).
 *
 * There is no settings model in the CMS for this; if one is added later, read
 * it here and keep this list as the fallback.
 */

export type SocialNetwork =
	| "youtube" | "tiktok" | "instagram" | "x" | "linkedin" | "bluesky" | "github" | "substack"

export interface SocialProfile {
	network: SocialNetwork
	/** Shown as the link text (footer) and the accessible name (header icon). */
	name: string
	url: string
	/** The handle as people type it, for display. */
	handle: string
	/** Show an icon in the site header. Keep this to the channels being promoted. */
	header?: boolean
	/** Include in sameAs / footer. Default true. */
	enabled?: boolean
}

const PROFILES: SocialProfile[] = [
	{ network: "youtube", name: "YouTube", url: "https://www.youtube.com/@joelvarty", handle: "@joelvarty", header: true },
	{ network: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@joelvarty.com", handle: "@joelvarty.com", header: true },
	{ network: "instagram", name: "Instagram", url: "https://www.instagram.com/joelvarty", handle: "@joelvarty", header: true },
	{ network: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/in/joelvarty", handle: "joelvarty", header: true },
	{ network: "x", name: "X", url: "https://x.com/joelvarty", handle: "@joelvarty" },
	{ network: "bluesky", name: "Bluesky", url: "https://bsky.app/profile/joelvarty.com", handle: "@joelvarty.com" },
	{ network: "github", name: "GitHub", url: "https://github.com/joelvarty", handle: "joelvarty" },
	{ network: "substack", name: "Substack", url: "https://joelvarty.substack.com", handle: "joelvarty" },
]

/** The profiles in use. */
export const SOCIAL_PROFILES: SocialProfile[] = PROFILES.filter((p) => p.enabled !== false)

/** The X handle for twitter:creator, when the X profile is enabled. */
export const X_HANDLE = SOCIAL_PROFILES.find((p) => p.network === "x")?.handle
