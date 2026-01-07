/**
 * BasicMarkdown Component
 *
 * An Agility CMS module component that displays markdown content.
 * This component fetches a content item from Agility CMS and renders
 * the markdown content with proper styling, gallery support, and
 * Agility CMS data attributes for in-context editing.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps } from "@agility/nextjs"
import { processMarkdown } from "@/lib/markdown/processMarkdown"

/**
 * Interface defining the structure of the BasicMarkdown content item fields.
 * The field name must match the field reference name in Agility CMS.
 */
export interface BasicMarkdownFields {
	markdown: string
}

/**
 * BasicMarkdown Component
 *
 * Fetches and renders markdown content from Agility CMS.
 *
 * @param module - The Agility CMS module object containing contentID
 * @param languageCode - The language code for localized content
 * @returns A section element with the rendered markdown content
 *
 * @remarks
 * - Uses `data-agility-component` attribute for Agility CMS component identification
 * - Uses `data-agility-field` attribute for in-context editing
 * - Applies Tailwind CSS prose classes for typography styling
 * - Supports responsive typography sizing (sm, lg, xl)
 * - Includes dark mode support via `dark:prose-invert`
 * - Supports gallery syntax in markdown (carousel, masonry, grid, etc.)
 */
const BasicMarkdown = async ({ module, languageCode }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { markdown },
		contentID,
	} = await getContentItem<BasicMarkdownFields>({
		contentID: module.contentid,
		languageCode,
	})

	return (
		<section id={`${contentID}`} className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
			<div className="mx-auto max-w-7xl">
				{/*
					Markdown content container with Agility CMS editing attributes.
					The processMarkdown function processes markdown and converts gallery
					syntax into React components.
				*/}
				<div
					data-agility-field="markdown"
					className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
				>
					{processMarkdown(markdown)}
				</div>
			</div>
		</section>
	)
}

export default BasicMarkdown

