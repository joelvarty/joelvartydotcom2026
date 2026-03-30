/**
 * Substack API Client
 *
 * Uses Substack's internal (unofficial) API to create, update, and publish posts.
 * Authentication is via the substack.sid session cookie from a browser login.
 *
 * Endpoints: https://{publication}.substack.com/api/v1/...
 */

const getBaseUrl = () => {
	const publication = process.env.SUBSTACK_PUBLICATION
	if (!publication) throw new Error("[substack] SUBSTACK_PUBLICATION env var is not set")
	return `https://${publication}.substack.com/api/v1`
}

const getHeaders = (): Record<string, string> => {
	const sid = process.env.SUBSTACK_SID
	if (!sid) throw new Error("[substack] SUBSTACK_SID env var is not set")
	return {
		"Content-Type": "application/json",
		Cookie: `substack.sid=${sid}`,
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
	}
}

// --- Types ---

export interface TipTapNode {
	type: string
	attrs?: Record<string, unknown>
	content?: TipTapNode[]
	text?: string
	marks?: TipTapMark[]
}

export interface TipTapMark {
	type: string
	attrs?: Record<string, unknown>
}

export interface TipTapDocument {
	type: "doc"
	content: TipTapNode[]
}

interface SubstackPost {
	id: number
	slug: string
	title: string
	type: string
	post_date?: string
}

interface CreateDraftParams {
	title: string
	subtitle?: string
	body: TipTapDocument
	coverImageUrl?: string
}

// --- Public API ---

/**
 * Search for an existing post on Substack by slug.
 * Checks published posts (public archive) then drafts (requires auth).
 */
export async function findExistingPost(slug: string): Promise<{ id: number; isDraft: boolean } | null> {
	const baseUrl = getBaseUrl()

	// 1. Search published posts via archive (public endpoint, no auth needed but we send it anyway)
	try {
		const archiveRes = await fetch(`${baseUrl}/archive?sort=new&search=${encodeURIComponent(slug)}&limit=25`, {
			headers: getHeaders(),
			cache: "no-store",
		})
		if (archiveRes.ok) {
			const posts: SubstackPost[] = await archiveRes.json()
			const match = posts.find((p) => p.slug === slug)
			if (match) {
				console.info(`[substack] Found published post for slug "${slug}": id=${match.id}`)
				return { id: match.id, isDraft: false }
			}
		}
	} catch (err) {
		console.warn("[substack] Error searching archive:", err)
	}

	// 2. Search drafts (requires auth)
	try {
		const draftsRes = await fetch(`${baseUrl}/drafts?limit=50`, {
			headers: getHeaders(),
			cache: "no-store",
		})
		if (draftsRes.ok) {
			const drafts: SubstackPost[] = await draftsRes.json()
			const match = drafts.find((d) => d.slug === slug)
			if (match) {
				console.info(`[substack] Found draft for slug "${slug}": id=${match.id}`)
				return { id: match.id, isDraft: true }
			}
		}
	} catch (err) {
		console.warn("[substack] Error searching drafts:", err)
	}

	return null
}

/**
 * Create a new draft post on Substack.
 */
export async function createDraft(params: CreateDraftParams): Promise<{ id: number; slug: string }> {
	const baseUrl = getBaseUrl()

	const body: Record<string, unknown> = {
		draft_title: params.title,
		draft_subtitle: params.subtitle || "",
		draft_body: params.body,
		audience: "everyone",
		type: "newsletter",
		section_chosen: false,
	}

	if (params.coverImageUrl) {
		body.cover_image = params.coverImageUrl
	}

	const res = await fetch(`${baseUrl}/drafts`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify(body),
		cache: "no-store",
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`[substack] Failed to create draft (${res.status}): ${text}`)
	}

	const draft = await res.json()
	console.info(`[substack] Created draft: id=${draft.id}, slug=${draft.slug}`)
	return { id: draft.id, slug: draft.slug }
}

/**
 * Update an existing draft/post on Substack.
 */
export async function updateDraft(id: number, params: CreateDraftParams): Promise<void> {
	const baseUrl = getBaseUrl()

	const body: Record<string, unknown> = {
		draft_title: params.title,
		draft_subtitle: params.subtitle || "",
		draft_body: params.body,
	}

	if (params.coverImageUrl) {
		body.cover_image = params.coverImageUrl
	}

	const res = await fetch(`${baseUrl}/drafts/${id}`, {
		method: "PUT",
		headers: getHeaders(),
		body: JSON.stringify(body),
		cache: "no-store",
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`[substack] Failed to update draft ${id} (${res.status}): ${text}`)
	}

	console.info(`[substack] Updated draft/post: id=${id}`)
}

/**
 * Publish a draft to the web.
 * @param send - If true, also emails subscribers. Defaults to false (web-only).
 */
export async function publishDraft(id: number, send: boolean = false): Promise<void> {
	const baseUrl = getBaseUrl()

	const res = await fetch(`${baseUrl}/drafts/${id}/publish`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ send, share_automatically: false }),
		cache: "no-store",
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`[substack] Failed to publish draft ${id} (${res.status}): ${text}`)
	}

	console.info(`[substack] Published draft: id=${id}, send=${send}`)
}
