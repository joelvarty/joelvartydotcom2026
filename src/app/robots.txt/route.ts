import { SITE_URL } from "@/config/site"
import { getSiteIndex } from "@/lib/cms-content/getSiteIndex"

/**
 * robots.txt, with the AI-crawler policy stated explicitly.
 *
 * Policy: this is a personal blog that WANTS to be read, quoted and cited by AI
 * assistants and answer engines, so every crawler (search, AI training, AI
 * search and user-triggered AI fetches) may crawl the whole site. Each AI agent
 * is named below so the choice is visible, not implied by a wildcard.
 *
 * The one exception is per page: a page (or post) whose GEO tab sets
 * "AI crawlers" to Block is disallowed for the AI agents only. Search engines
 * still index it.
 */

/** AI crawlers and fetchers, grouped by who runs them. */
const AI_AGENTS = [
	// OpenAI: training, ChatGPT search, user-triggered fetches
	"GPTBot", "OAI-SearchBot", "ChatGPT-User",
	// Anthropic: training, Claude search, user-triggered fetches
	"ClaudeBot", "Claude-SearchBot", "Claude-User",
	// Perplexity
	"PerplexityBot", "Perplexity-User",
	// Google Gemini / Vertex AI grounding (search indexing is plain Googlebot)
	"Google-Extended",
	// Apple Intelligence
	"Applebot-Extended",
	// Meta AI
	"meta-externalagent",
	// Amazon (Alexa, Rufus)
	"Amazonbot",
	// DuckDuckGo AI answers
	"DuckAssistBot",
	// Mistral Le Chat
	"MistralAI-User",
	// Common Crawl, the open dataset many models train on
	"CCBot",
]

export async function GET() {
	let blocked: string[] = []
	try {
		const index = await getSiteIndex()
		blocked = index.filter((p) => p.aiCrawlBlocked).map((p) => p.path)
	} catch (error) {
		//never fail robots.txt: fall back to the site-wide policy
		console.error("[robots.txt] Could not read per-page AI crawler settings:", error)
	}

	const lines = [
		"# robots.txt for joelvarty.com",
		"#",
		"# This is a personal blog that wants to be read and cited, by people, search",
		"# engines and AI assistants alike. Every crawler may crawl the whole site.",
		"# AI crawlers are listed by name so the policy is explicit.",
		"",
		"User-agent: *",
		"Allow: /",
		"",
		"# AI crawlers: allowed.",
		...AI_AGENTS.map((agent) => `User-agent: ${agent}`),
		"Allow: /",
		...blocked.map((path) => `Disallow: ${path}`),
		"",
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		"",
		"# A plain-text guide to this site for AI agents (llmstxt.org):",
		`# ${SITE_URL}/llms.txt`,
		"# Every page is also available as markdown: append .md to its URL",
		`# (the home page is ${SITE_URL}/index.md).`,
		"",
	]

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	})
}
