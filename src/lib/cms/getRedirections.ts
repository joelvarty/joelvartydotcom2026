import agility from '@agility/content-fetch'
import fs from 'fs/promises'

export interface Redirection {
	id: number
	originUrl: string
	destinationUrl: string
	statusCode: number
}

interface Redirections {
	lastAccessDate: string
	isUpToDate: boolean
	items: Redirection[]
}

export interface RedirectionsMap {
	lastAccessDate: string
	isUpToDate: boolean
	items: { [key: string]: Redirection }
}

interface Props {
	forceUpdate?: boolean
}

/**
 * Get the list of redirections from Agility CMS.
 * Writes the redirections to a JSON file for use in middleware.
 */
export const getRedirections = async ({ forceUpdate = false }: Props): Promise<RedirectionsMap> => {
	const apiKey = process.env.AGILITY_API_FETCH_KEY

	const agilitySDK = agility.getApi({
		guid: process.env.AGILITY_GUID,
		apiKey,
		isPreview: false
	});

	agilitySDK.config.fetchConfig = {
		next: {
			revalidate: 0,
		},
	}

	try {
		const filepath = 'data/redirections.json'

		let redirectionRes: RedirectionsMap | undefined
		let fileExists = false
		try {
			await fs.access(filepath, fs.constants.F_OK)
			fileExists = true
		} catch { }

		if (fileExists) {
			const redirectionStr = await fs.readFile(filepath, 'utf8')
			redirectionRes = JSON.parse(redirectionStr) as RedirectionsMap
		}

		if (!forceUpdate && redirectionRes && redirectionRes.isUpToDate) {
			return redirectionRes
		}

		let lastAccessDate: Date | null | undefined = undefined
		const redirectionsFromServer = await agilitySDK.getUrlRedirections({ lastAccessDate }) as Redirections

		if (!redirectionsFromServer.isUpToDate || forceUpdate) {
			const redirectionsMap: RedirectionsMap = {
				lastAccessDate: redirectionsFromServer.lastAccessDate,
				isUpToDate: redirectionsFromServer.isUpToDate,
				items: {}
			}

			redirectionsFromServer.items.forEach((redirection) => {
				let key = redirection.originUrl.toLowerCase()
				if (key.startsWith("~/")) key = key.substring(1)
				if (key.includes("://")) {
					const hostIndex = key.indexOf("/", key.indexOf("://") + 3)
					key = key.substring(hostIndex)
				}
				if (redirection.destinationUrl.startsWith("~/")) {
					redirection.destinationUrl = redirection.destinationUrl.substring(1)
				}
				redirectionsMap.items[key] = redirection
			});

			// Write the redirections to the file system
			await fs.writeFile(filepath, JSON.stringify(redirectionsMap), 'utf8')

			return redirectionsMap
		}

		return {
			lastAccessDate: redirectionsFromServer.lastAccessDate,
			isUpToDate: redirectionsFromServer.isUpToDate,
			items: {}
		}
	} catch (error) {
		console.error('Failed to fetch redirections:', error);
		return {
			lastAccessDate: new Date().toISOString(),
			isUpToDate: false,
			items: {}
		}
	}
}
