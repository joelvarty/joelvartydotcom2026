import agility from "@agility/content-fetch"
import { defaultLocale, locales, removeLocaleFromPathname, getLocaleFromPathname } from "@/lib/i18n/config"

/**
 * Paths this app serves itself. They are NOT in the Agility sitemap, so the
 * published-path check has to let them through — anything answered by a route
 * handler or a file convention rather than by the CMS belongs here.
 *
 * Add to this when you add a hand-written route, or it will 404 in production
 * while working perfectly in `next dev` (the check is skipped in dev).
 */
const APP_PATHS = new Set([
	"/",
	"/sitemap.xml",
	"/robots.txt",
	"/blog/rss.xml",
	//MUST stay listed. The proxy builds its 404 body by fetching this page, and
	//that fetch goes back through the proxy — if this path were not app-owned,
	//the check would 404 it, which would fetch it again, and the request would
	//hang forever. (It did.)
	"/_not-found",
])

/** Route prefixes this app owns. */
const APP_PREFIXES = [
	"/api",    // route handlers (also excluded by the proxy matcher)
	"/_next",
]

/**
 * Files served from public/. Paths with a dot skip the sitemap check, and a
 * dotted path that is NOT one of these (or an app path) would otherwise fall
 * through to the [locale] route and stream a soft 404 with a 200 status.
 *
 * Add to this when you add a file or folder to public/.
 */
const PUBLIC_FILES = new Set([
	"/file.svg",
	"/globe.svg",
	"/next.svg",
	"/vercel.svg",
	"/window.svg",
])
const PUBLIC_PREFIXES = ["/favicons/"]

export const isPublicFile = (path: string): boolean =>
	PUBLIC_FILES.has(path) || PUBLIC_PREFIXES.some(p => path.startsWith(p))

export const isAppPath = (path: string): boolean => {
	if (APP_PATHS.has(path)) return true
	//NOTE: the path-boundary test matters. A bare `startsWith` prefix test would
	//also match any path merely STARTING with those letters — "/api-reference"
	//would be swallowed by "/api" — so require an exact match or a real "/".
	return APP_PREFIXES.some(p => path === p || path.startsWith(`${p}/`))
}

/**
 * Published paths per locale, memoised in module scope with a short TTL.
 *
 * NOTE: this deliberately does NOT go through lib/cms/getSitemapFlat. That
 * helper is a `"use cache"` function, and `"use cache"`/`cacheTag()` only work
 * inside a render or cache scope — calling it from the proxy throws
 * "`cacheTag()` can only be called inside a \"use cache\" function". So the
 * proxy talks to the SDK directly and does its own memoisation.
 *
 * The TTL is the only freshness mechanism here (revalidateTag cannot reach
 * module scope), so a page published in the CMS becomes reachable within
 * TTL_MS at worst. Keep it short.
 */
const TTL_MS = 60_000

interface CacheEntry {
	paths: Set<string>
	expires: number
}

const pathCache = new Map<string, CacheEntry>()

const loadPaths = async (locale: string): Promise<Set<string>> => {
	const client = agility.getApi({
		guid: process.env.AGILITY_GUID,
		apiKey: process.env.AGILITY_API_FETCH_KEY,
		isPreview: false,
	})
	//opt out of Next's fetch cache — this module does its own memoisation
	client.config.fetchConfig = { cache: "no-store" }

	const sitemap = await client.getSitemapFlat({
		channelName: process.env.AGILITY_SITEMAP || "website",
		languageCode: locale,
	}) as { [path: string]: { isFolder?: boolean, redirect?: unknown } }

	//folders (/blog/category, /blog/series) and redirect nodes are in the sitemap
	//but render nothing, so they are not servable paths: let them 404 here
	//rather than reach the page and soft-404 (or 500) after the shell streams.
	return new Set(Object.entries(sitemap)
		.filter(([, node]) => !node.isFolder && !node.redirect)
		.map(([path]) => path))
}

/**
 * Is this a path the CMS publishes?
 *
 * Returns true for anything this app owns, anything in the published flat
 * sitemap, and — deliberately — for EVERYTHING if Agility cannot be reached.
 * Failing open means a CMS outage degrades to the old soft-404 behaviour
 * rather than taking the whole site offline.
 */
export const isPublishedPath = async (pathname: string): Promise<boolean> => {

	if (isAppPath(pathname)) return true

	//strip the locale prefix — the sitemap stores locale-less paths
	const localePrefix = getLocaleFromPathname(pathname, locales)
	const locale = localePrefix || defaultLocale
	const path = localePrefix ? (removeLocaleFromPathname(pathname, localePrefix) || "/") : pathname

	if (path === "/") return true

	const now = Date.now()
	let entry = pathCache.get(locale)

	if (!entry || entry.expires < now) {
		try {
			entry = { paths: await loadPaths(locale), expires: now + TTL_MS }
			pathCache.set(locale, entry)
		} catch (error) {
			console.error("Could not load the sitemap to validate paths — failing open.", error)
			//keep serving a stale set if we have one rather than 404ing real pages
			if (!entry) return true
		}
	}

	//tolerate a trailing slash
	return entry.paths.has(path) || entry.paths.has(path.replace(/\/$/, ""))
}
