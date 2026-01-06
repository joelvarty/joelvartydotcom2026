/**
 * RichTextArea Component
 *
 * An Agility CMS module component that displays rich text content.
 * This component fetches a content item from Agility CMS and renders
 * the HTML content with proper styling and Agility CMS data attributes
 * for in-context editing.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { renderHTML, type UnloadedModuleProps } from "@agility/nextjs"

/**
 * Interface defining the structure of the RichText content item fields.
 * The field name must match the field reference name in Agility CMS.
 */
export interface RichText {
	textblob: string
}

/**
 * RichTextArea Component
 *
 * Fetches and renders rich text content from Agility CMS.
 *
 * @param module - The Agility CMS module object containing contentID
 * @param languageCode - The language code for localized content
 * @returns A section element with the rendered rich text content
 *
 * @remarks
 * - Uses `data-agility-component` attribute for Agility CMS component identification
 * - Uses `data-agility-field` and `data-agility-html` attributes for in-context editing
 * - Applies Tailwind CSS prose classes for typography styling
 * - Supports responsive typography sizing (sm, lg, xl)
 * - Includes dark mode support via `dark:prose-invert`
 */
const RichTextArea = async ({ module, languageCode }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { textblob },
		contentID,
	} = await getContentItem<RichText>({
		contentID: module.contentid,
		languageCode,
	})

	return (
		<section id={`${contentID}`} className="relative px-8" data-agility-component={contentID}>
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
				{/*
					Rich text content container with Agility CMS editing attributes.
					The renderHTML function sanitizes and prepares the HTML for safe rendering.
				*/}
				<div
					data-agility-field="textblob"
					data-agility-html
					className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full dark:prose-invert"
					dangerouslySetInnerHTML={renderHTML(textblob)}
				></div>
			</div>
		</section>
	)
}

export default RichTextArea

