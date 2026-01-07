import { getPageTemplate } from "@/components/agility-pages"
import { type PageProps, getAgilityPage } from "@/lib/cms/getAgilityPage"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"

export const revalidate = 60
export const runtime = "nodejs"

/**
 * Generate metadata for this page
 */
export async function generateMetadata(
	props: { params: Promise<{ locale: string }> },
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { params } = props
	const awaitedParams = await params

	const agilityData = await getAgilityPage({
		params: Promise.resolve({ locale: awaitedParams.locale, slug: [""] })
	})
	if (!agilityData.page) return {}

	const seo = agilityData.page?.seo as { metaTitle?: string; metaDescription?: string } | undefined
	return {
		title: seo?.metaTitle || agilityData.page?.title || 'Page',
		description: seo?.metaDescription || '',
	}
}

export default async function LocaleHomePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	// Handle home page directly instead of redirecting
	// This matches the [...slug] route behavior but for /[locale] path
	const { locale } = await params

	const agilityData = await getAgilityPage({
		params: Promise.resolve({ locale, slug: [""] })
	})
	if (!agilityData.page) {
		notFound()
	}

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "Main")
	const globalSearchParams = agilityData.globalData?.["searchParams"] || {}

	return (
		<div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
			{AgilityPageTemplate ? (
				<AgilityPageTemplate {...agilityData} searchParams={globalSearchParams} />
			) : (
				<div>No template found for page template name: {agilityData.pageTemplateName}</div>
			)}
		</div>
	)
}

