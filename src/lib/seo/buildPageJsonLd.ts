import { buildJsonLd, type GeoSitemapFlat, type JsonLdDocument, type JsonLdNode } from "@agility/geo"
import type { AgilityPageProps } from "@agility/nextjs"
import type { ContentItem } from "@agility/content-fetch"
import { SITE_NAME, SITE_URL } from "@/config/site"
import { toPublicPath } from "@/lib/cms/homePage"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import type { SitemapNode } from "@/lib/types/SitemapNode"
import { contentModelMappings } from "./contentModelMappings"
import { buildPersonNode } from "./person"
import { personId, ref } from "./schema"

/**
 * The page type when the editor hasn't picked one on the page's GEO tab. The
 * GEO tab always wins; these just make the defaults right for this site.
 */
const DEFAULT_PAGE_TYPES: { [path: string]: string } = {
	"/about": "ProfilePage",
	"/career": "ProfilePage",
	"/story": "ProfilePage",
	"/blog": "CollectionPage",
}

const defaultPageType = (path: string, sitemapNode: SitemapNode): string => {
	if (DEFAULT_PAGE_TYPES[path]) return DEFAULT_PAGE_TYPES[path]
	// a category or series page lists posts
	if (/^\/blog\/(category|series)\//.test(path)) return "CollectionPage"
	// a post is an ItemPage whose main entity is the BlogPosting
	if (sitemapNode.contentID) return "ItemPage"
	return "WebPage"
}

interface BuildPageJsonLdInput {
	agilityData: AgilityPageProps
	sitemap: { [path: string]: SitemapNode }
	locale: string
}

/** The public URL of a sitemap path: `/home` is served at `/`. */
export const publicUrl = (path: string, sitemap: { [path: string]: SitemapNode }, locale: string) =>
	SITE_URL + localizeUrl(toPublicPath(path, sitemap), locale)

/**
 * ONE schema.org `@graph` for the page, built by `@agility/geo`:
 *
 * 1. WebSite, published by the Person (Joel), with stable `@id`s.
 * 2. The WebPage, typed by the GEO tab's Page Type (else DEFAULT_PAGE_TYPES), and
 *    a BreadcrumbList that starts at Home and skips folders.
 * 3. The JSON-LD the editor typed into the GEO tab (the page's, or on a post the
 *    post's own), merged in by `@id`.
 * 4. Through `transform`: the Person, ProfilePage -> mainEntity Person, and the
 *    content model mappings (a BlogPost becomes a BlogPosting + VideoObjects).
 */
export function buildPageJsonLd({ agilityData, sitemap, locale }: BuildPageJsonLdInput): JsonLdDocument | null {
	const { page, sitemapNode, dynamicPageItem } = agilityData
	if (!page || !sitemapNode) return null

	const path = sitemapNode.path
	const publicPath = toPublicPath(path, sitemap)
	const isHome = publicPath === "/"
	const url = publicUrl(path, sitemap, locale)
	const item = dynamicPageItem as ContentItem | undefined

	return buildJsonLd({
		page,
		item,
		sitemap: sitemap as GeoSitemapFlat,
		url,
		path,
		baseUrl: SITE_URL,
		locale,
		isHome,
		siteSettings: {
			defaultSchemaType: defaultPageType(path, sitemapNode),
			// No Organization: this is a personal site. The WebSite's publisher is the Person.
			website: {
				name: SITE_NAME,
				url: SITE_URL,
				properties: { publisher: ref(personId), inLanguage: "en-US" },
			},
		},
		transform: (graph, ctx) => {
			// --- the Person: ours, under anything the editor supplied with the same @id
			const existing = graph.find((n) => n["@id"] === personId)
			if (existing) Object.assign(existing, { ...buildPersonNode(), ...existing })
			else graph.splice(1, 0, buildPersonNode())

			// --- the WebPage: who it is about
			const webPage = graph.find((n) => n["@id"] === `${url}#webpage`)
			if (webPage) {
				const types = ([] as unknown[]).concat(webPage["@type"])
				if (types.includes("ProfilePage")) webPage.mainEntity = ref(personId)
				else if (isHome) webPage.about = ref(personId)
				if (isHome) webPage.name = SITE_NAME
			}

			// --- breadcrumbs: start at Home, skip folders and the home node itself
			const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList")
			if (crumbs) {
				const items = (crumbs.itemListElement as JsonLdNode[] | undefined) ?? []
				const kept = items.filter((li) => {
					const itemUrl = typeof li.item === "string" ? li.item : ""
					const itemPath = itemUrl.startsWith(SITE_URL) ? itemUrl.slice(SITE_URL.length) || "/" : itemUrl
					const node = sitemap[itemPath]
					return !(node?.isFolder) && toPublicPath(itemPath, sitemap) !== "/"
				})
				crumbs.itemListElement = [
					{ "@type": "ListItem", name: "Home", item: `${SITE_URL}/` },
					...kept,
				].map((li, i) => ({ ...li, position: i + 1 }))
				if (isHome) {
					graph.splice(graph.indexOf(crumbs), 1)
					if (webPage) delete webPage.breadcrumb
				}
			}

			// --- content model mappings (BlogPost -> BlogPosting + VideoObject)
			const model = item?.properties?.definitionName
			const mapper = model ? contentModelMappings[model] : undefined
			if (item && mapper) {
				const nodes = mapper(item, ctx)
				for (const node of nodes) {
					const same = graph.find((n) => node["@id"] && n["@id"] === node["@id"])
					// the editor's GEO tab JSON-LD for the same @id wins
					if (same) Object.assign(same, { ...node, ...same })
					else graph.push(node)
				}
				if (webPage && nodes[0]?.["@id"]) webPage.mainEntity = ref(nodes[0]["@id"] as string)
			}
		},
	})
}
