import { rebuildRedirectCache } from "@/lib/cms-content/rebuildRedirectCache"

require("dotenv").config({
	path: `.env.local`,
})

const doWork = async () => {
	console.log("Agility Website => Prebuild Started")
	// Rebuild the redirects
	await rebuildRedirectCache()
	console.log("Agility Website => Prebuild Complete")
}

doWork()
