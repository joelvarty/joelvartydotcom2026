import agility from '@agility/content-fetch'

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

