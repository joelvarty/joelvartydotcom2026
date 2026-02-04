/**
 * Default revalidation time in seconds for CMS data fetches.
 * Since on-demand revalidation handles content updates via webhook,
 * this is just a safety net fallback.
 *
 * Uses the same AGILITY_FETCH_CACHE_DURATION env var as @agility/nextjs SDK.
 * Defaults to 86400 (24 hours).
 */
export const defaultRevalidate = Number(process.env.AGILITY_FETCH_CACHE_DURATION) || 86400
