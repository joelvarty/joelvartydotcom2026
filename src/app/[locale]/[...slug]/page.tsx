import { getPageTemplate } from "@/components/agility-pages"
import { type PageProps, getAgilityPage } from "@/lib/cms/getAgilityPage"
import { getAgilityContext } from "@/lib/cms/getAgilityContext"
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat"
import type { SitemapNode } from "@/lib/types/SitemapNode"

import type { Metadata, ResolvingMetadata } from "next"

import { resolveAgilityMetaData } from "@/lib/cms-content/resolveAgilityMetaData"
import { notFound } from "next/navigation"
import { locales } from "@/lib/i18n/config"
import { buildPageJsonLd } from "@/lib/seo/buildPageJsonLd"
import { JsonLd } from "@/lib/seo/JsonLd"

// NOTE: no `revalidate` / `runtime` route segment configs. Both are rejected
// under `cacheComponents`. Freshness comes from cacheLife("days") on each read
// in src/lib/cms/ plus instant tag invalidation from the publish webhook in
// /api/revalidate.

/**
 * The pages to prerender at build time: every published, non-folder,
 * non-redirect node in each locale's flat sitemap.
 *
 * This goes through the cached getSitemapFlat primitive, so the build and the
 * render share one cache entry per locale. Published content only: a build must
 * never bake staging content into static pages.
 */
export async function generateStaticParams() {
	const allPaths: { locale: string; slug: string[] }[] = []

	for (const locale of locales) {
		const sitemap = await getSitemapFlat({
			channelName: process.env.AGILITY_SITEMAP || "website",
			languageCode: locale,
			preview: false,
		}) as { [path: string]: SitemapNode }

		const localePaths = Object.values(sitemap)
			.filter((node) => node.redirect === null && node.isFolder !== true)
			.map((node) => ({
				locale,
				slug: node.path.split("/").slice(1),
			}))

		allPaths.push(...localePaths)
	}

	console.log("Pre-rendering", allPaths.length, "static paths across", locales.length, "locales.")
	return allPaths
}

/**
 * Generate metadata for this page
 */
export async function generateMetadata(
	props: PageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { params } = props
	const awaitedParams = await params

	const { locale, sitemap, isDevelopmentMode, isPreview } = await getAgilityContext(awaitedParams.locale)
	const agilityData = await getAgilityPage({ params })
	if (!agilityData.page) return {}

	//same cached read getAgilityPage made, so a cache hit, not a second fetch
	const sitemapFlat = await getSitemapFlat({ channelName: sitemap, languageCode: locale, preview: isPreview }) as { [path: string]: SitemapNode }

	return await resolveAgilityMetaData({
		agilityData,
		locale,
		sitemap,
		sitemapFlat,
		isDevelopmentMode,
		isPreview,
		parent,
	})
}

export default async function Page({ params }: PageProps) {
	const agilityData = await getAgilityPage({ params })
	if (!agilityData.page) {
		notFound()
	}

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "Main")

	//get the search params from global data (since they are added in getAgilityPage)
	const globalSearchParams = agilityData.globalData?.["searchParams"] || {}

	// ONE schema.org @graph for the page: the WebSite and Joel (the Person), the
	// WebPage + breadcrumbs, the editor's GEO tab JSON-LD, and content model
	// mappings (a blog post becomes a BlogPosting). See lib/seo/buildPageJsonLd.ts.
	const { locale, isPreview, sitemap: channelName } = await getAgilityContext((await params).locale)
	const sitemapFlat = await getSitemapFlat({ channelName, languageCode: locale, preview: isPreview }) as { [path: string]: SitemapNode }
	const jsonLd = buildPageJsonLd({ agilityData, sitemap: sitemapFlat, locale })

	return (
		<>
		{jsonLd && <JsonLd data={jsonLd} />}
		<div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
			{AgilityPageTemplate ? (
				<AgilityPageTemplate {...agilityData} searchParams={globalSearchParams} />
			) : (
				<div>No template found for page template name: {agilityData.pageTemplateName}</div>
			)}
		</div>
		</>
	)
}
