import { SITE_URL } from "@/config/site"

/**
 * Stable `@id`s for the site's schema.org entities.
 *
 * Every page's graph uses the same ids, so a crawler can tell that the author of
 * one post, the publisher of the site and the subject of the About page are the
 * SAME person, instead of three anonymous Person blobs. `@agility/geo` builds
 * the WebSite and WebPage with the same forms (`${site}/#website`,
 * `${url}#webpage`).
 */
export const personId = `${SITE_URL}/#person`
export const webSiteId = `${SITE_URL}/#website`
export const webPageId = (url: string) => `${url}#webpage`
export const articleId = (url: string) => `${url}#article`
export const videoId = (url: string, n: number) => `${url}#video-${n}`

/** A reference to an entity defined elsewhere in the graph. */
export const ref = (id: string) => ({ "@id": id })
