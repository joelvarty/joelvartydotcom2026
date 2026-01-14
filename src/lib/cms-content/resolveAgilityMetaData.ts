import { type AgilityPageProps, type ImageField } from "@agility/nextjs"
import { type ContentItem } from "@agility/content-fetch"
import { type Metadata, type ResolvingMetadata } from "next"
import ReactHtmlParser from "html-react-parser"
import { getContentItem } from "@/lib/cms/getContentItem"
import type { JSX } from "react"

/**
 * Extract the first image URL from markdown content.
 * Supports both standard markdown images and gallery syntax.
 */
function extractFirstImageFromMarkdown(markdown: string): string | null {
	if (!markdown) return null

	// Match standard markdown images: ![alt](url) or ![alt](url "title")
	const standardImageRegex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/
	const standardMatch = markdown.match(standardImageRegex)
	if (standardMatch) {
		return standardMatch[1]
	}

	// Match gallery code blocks and extract first URL
	// Format: ```gallery:type\nurl "caption"\n...```
	const galleryCodeBlockRegex = /```gallery:[^\n]*\n([^\s]+)/
	const galleryMatch = markdown.match(galleryCodeBlockRegex)
	if (galleryMatch) {
		return galleryMatch[1]
	}

	// Match plain image URLs on their own line (common in galleries)
	const plainUrlRegex = /^(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg))/im
	const plainMatch = markdown.match(plainUrlRegex)
	if (plainMatch) {
		return plainMatch[1]
	}

	return null
}

interface Props {
	agilityData: AgilityPageProps
	locale: string
	sitemap: string
	isPreview: boolean
	isDevelopmentMode: boolean
	parent: ResolvingMetadata
}

export const resolveAgilityMetaData = async ({ agilityData, locale, parent }: Props): Promise<Metadata> => {
	const ogImages = (await parent).openGraph?.images || []

	let metaDescription = agilityData.page?.seo?.metaDescription

	//#region *** resolve open graph stuff from dynamic pages ***
	if (agilityData.sitemapNode.contentID !== undefined
		&& agilityData.sitemapNode.contentID > 0) {

		//get the content item for this dynamic page
		try {
			const contentItem: ContentItem = await getContentItem({
				contentID: agilityData.sitemapNode.contentID,
				languageCode: locale,
				locale
			})

			if (contentItem.properties.definitionName === "BlogPost") {
				/* *** Blog Posts MetaData *** */
				const image = contentItem.fields["featuredImage"] as ImageField | undefined

				if (image) {
					ogImages.push({
						url: `${image.url}?format=auto&w=1200`,
						alt: image.label
					})
				}

				if (!metaDescription && contentItem.fields["excerpt"]) {
					metaDescription = contentItem.fields["excerpt"] as string
				}

			} else if (contentItem.properties.definitionName === "BlogSeries") {
				/* *** Blog Series MetaData *** */
				// Extract the first image from the markdown summary for og:image
				const markdownSummary = contentItem.fields["markdownSummary"] as string | undefined
				if (markdownSummary) {
					const firstImageUrl = extractFirstImageFromMarkdown(markdownSummary)
					if (firstImageUrl) {
						ogImages.push({
							url: `${firstImageUrl}?format=auto&w=1200`,
							alt: contentItem.fields["title"] as string || "Series image"
						})
					}
				}
			}

		} catch (error) {
			console.warn("Could not resolve open graph meta data from dynamic page contentID:", agilityData.sitemapNode.contentID, error)
		}
	}
	//#endregion

	//#region *** resolve the "additional" meta tags ***
	let metaHTML = agilityData.page?.seo?.metaHTML

	let otherMetaData: { [name: string]: string } = {}

	if (metaHTML) {
		const additionalHeaderMarkup = ReactHtmlParser(metaHTML)

		const handleMetaTag = (item: JSX.Element) => {
			if (!item.type) return
			//check if this is a meta tag and add it to the otherMetaData if so
			if (item.type === "meta") {
				const metaTag = item.props as React.MetaHTMLAttributes<HTMLMetaElement>
				if (metaTag && (metaTag.property || metaTag.name) && metaTag.content) {

					const metaProperty = metaTag.property || metaTag.name
					if (!metaProperty) return

					//special case for og:image
					if (metaProperty === "og:image") {
						ogImages.push({
							url: metaTag.content
						})
					} else {
						otherMetaData[metaProperty] = metaTag.content
					}

					return
				}
			}
			console.warn("Warning: could not output tag in Additional Header Markup", item)
		}

		if (typeof additionalHeaderMarkup === "string") {
			console.warn("Could not parse additional meta tags from Agility CMS")
		} else if (Array.isArray(additionalHeaderMarkup)) {
			//array of meta tags
			additionalHeaderMarkup.forEach((item) => handleMetaTag(item));
		} else {
			//single meta tag
			handleMetaTag(additionalHeaderMarkup)
		}
	}
	//#endregion

	const metaData: Metadata = {
		title: agilityData.sitemapNode?.title,
		description: metaDescription,
		keywords: agilityData.page?.seo?.metaKeywords,
		openGraph: {
			images: ogImages,
		},
		generator: `Agility CMS`,
		other: otherMetaData
	}

	return metaData
}
