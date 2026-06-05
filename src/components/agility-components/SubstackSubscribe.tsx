/**
 * SubstackSubscribe Component
 *
 * An Agility CMS module that embeds a Substack newsletter subscribe form.
 * Uses Substack's official iframe embed for maximum reliability.
 *
 * CMS fields: title (optional), description (optional)
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps } from "@agility/nextjs"

interface SubstackSubscribeFields {
	title?: string
	description?: string
}

const SubstackSubscribe = async ({ module, languageCode }: UnloadedModuleProps) => {
	const { fields, contentID } = await getContentItem<SubstackSubscribeFields>({
		contentID: module.contentid,
		languageCode,
	})

	const publication = process.env.SUBSTACK_PUBLICATION || "joelvarty"

	return (
		<section className="py-12 px-4" data-agility-component={contentID}>
			<div className="max-w-xl mx-auto text-center">
				{fields.title && (
					<h2 className="text-2xl font-bold text-foreground mb-4">{fields.title}</h2>
				)}
				{fields.description && (
					<p className="text-muted-foreground mb-6">{fields.description}</p>
				)}
				<iframe
					src={`https://${publication}.substack.com/embed`}
					width="100%"
					height="150"
					loading="lazy"
					style={{ border: "none", background: "transparent" }}
					frameBorder="0"
					scrolling="no"
					title="Subscribe to newsletter"
				/>
			</div>
		</section>
	)
}

export default SubstackSubscribe
