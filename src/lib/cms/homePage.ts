/**
 * The home page lives at the site root.
 *
 * In the Agility sitemap the home page is an ordinary node with its own path
 * (`/home` on this site), but it is served at `/`. The home node is the FIRST
 * sitemap node that renders something (not a folder, not a redirect), which is
 * the node `getAgilityPage` renders for `/`.
 *
 * Every public URL built from a sitemap path goes through `toPublicPath`, so the
 * canonical link, og:url, JSON-LD, breadcrumbs, sitemap.xml, llms.txt and the
 * .md twins all agree that the home page is `/`. next.config.ts redirects
 * `/home` to `/` with a 308.
 *
 * Plain functions with no Next.js cache calls, so the proxy can use them too.
 */

interface SitemapNodeLike {
	path: string
	isFolder?: boolean
	redirect?: unknown
}

/** The home node: the first sitemap node that is neither a folder nor a redirect. */
export const findHomeNode = <T extends SitemapNodeLike>(sitemap: Record<string, T>): T | undefined =>
	Object.values(sitemap).find((node) => !node.isFolder && !node.redirect)

/** The public, locale-less path for a sitemap path: `/` for the home node, otherwise unchanged. */
export const toPublicPath = (path: string | undefined, sitemap: Record<string, SitemapNodeLike>): string => {
	if (!path || path === "/") return "/"
	return path === findHomeNode(sitemap)?.path ? "/" : path
}
