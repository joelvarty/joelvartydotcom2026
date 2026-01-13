import { getRedirections } from '../cms/getRedirections'

/**
 * Rebuild the redirection cache.
 * Fetches redirections from Agility CMS and writes them to the data/redirections.json file.
 */
export const rebuildRedirectCache = async () => {
	console.log("Rebuilding redirect cache...")
	try {
		// Force a rebuild of the redirection cache
		const redirections = await getRedirections({ forceUpdate: true })
		const allKeys = Object.keys(redirections.items)
		console.log(`Redirect cache rebuilt with ${allKeys.length} redirections.`)
	} catch (error) {
		console.error("Error rebuilding redirect cache", error)
	}
}
