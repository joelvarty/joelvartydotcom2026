/**
 * SitemapNode type definition
 * Represents a node in the Agility CMS sitemap
 */

export interface SitemapNode {
	pageID?: number
	contentID?: number
	path: string
	title?: string
	redirect?: string | null
	isFolder?: boolean
	[key: string]: any
}

