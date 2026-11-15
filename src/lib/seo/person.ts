import type { JsonLdNode } from "@agility/geo"
import { PERSON, SITE_URL, SOCIAL_PROFILES } from "@/config/site"
import { personId } from "./schema"

/**
 * Joel, as a schema.org Person: the site's central entity.
 *
 * It is on every page's graph (not just the About page) because every page
 * points at it: the WebSite's publisher, each BlogPosting's author and
 * publisher, and the ProfilePage's mainEntity. `sameAs` ties it to the same
 * person's profiles elsewhere, which is how an answer engine merges "Joel Varty
 * on YouTube" and "Joel Varty on joelvarty.com" into one entity.
 */
export const buildPersonNode = (): JsonLdNode => {
	const sameAs = SOCIAL_PROFILES.map((p) => p.url)
	return {
		"@type": "Person",
		"@id": personId,
		name: PERSON.name,
		url: `${SITE_URL}/`,
		image: PERSON.image,
		jobTitle: PERSON.jobTitle,
		worksFor: { "@type": "Organization", name: PERSON.worksFor.name, url: PERSON.worksFor.url },
		description: PERSON.description,
		knowsAbout: PERSON.knowsAbout,
		...(sameAs.length ? { sameAs } : {}),
	}
}
