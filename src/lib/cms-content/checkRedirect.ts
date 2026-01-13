import allRedirects from "@/../data/redirections.json"
import type { Redirection, RedirectionsMap } from "../cms/getRedirections"

/**
 * Check if a path should be redirected.
 * Reads from the prebuild-generated redirections.json file.
 * @param path The path to check for redirects
 * @returns The redirection if found, null otherwise
 */
export const checkRedirect = async ({ path }: { path: string }): Promise<Redirection | null> => {
	// If the path is the root, don't redirect
	if (path === "/") return null

	// Get the redirections from the prebuild JSON file
	const redirections = allRedirects as RedirectionsMap
	if (!redirections) return null

	const redirection = redirections.items[path.toLowerCase()]

	return redirection || null
}
