/**
 * Who this site is about, in one place.
 *
 * The Person below is the central entity of the site's structured data: every
 * page's JSON-LD graph carries it at `${SITE_URL}/#person`, the WebSite names it
 * as publisher, and every blog post names it as author. Keep it accurate: answer
 * engines quote it.
 */

/** The canonical origin. Previews and local builds still point canonicals here. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.joelvarty.com").replace(/\/+$/, "")

export const SITE_NAME = "Joel Varty"

/** Used when a page has no SEO description and no GEO summary of its own. */
export const SITE_DESCRIPTION =
	"Joel Varty is CTO of Agility CMS, a headless CMS he has helped build for over 20 years. He writes about AI-native content, software architecture, leadership, football, theatre and travel."

export const PERSON = {
	name: "Joel Varty",
	jobTitle: "CTO",
	worksFor: { name: "Agility CMS", url: "https://agilitycms.com" },
	description: SITE_DESCRIPTION,
	image: "https://cdn.agilitycms.com/j0i5uycg/story-images/joel-varty-toronto-portrait.jpeg",
	knowsAbout: ["Headless CMS", "AI-native content", "Software architecture", "Next.js", "Leadership"],
}

/**
 * Profiles that are the same person (`sameAs`) and the "Connect" links in the
 * footer. Only list accounts that exist: a `sameAs` link that 404s weakens the
 * entity instead of strengthening it.
 */
export const SOCIAL_PROFILES: { name: string; url: string }[] = [
	{ name: "GitHub", url: "https://github.com/joelvarty" },
	{ name: "LinkedIn", url: "https://www.linkedin.com/in/joelvarty" },
	{ name: "Substack", url: "https://joelvarty.substack.com" },
]
