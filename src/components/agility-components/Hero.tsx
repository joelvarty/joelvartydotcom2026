/**
 * Hero Component
 *
 * An Agility CMS module component that displays a hero section with title, subtitle, image, and optional CTA button.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps } from "@agility/nextjs"
import { AgilityPic } from "@agility/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Interface defining the structure of the Hero module fields.
 */
export interface HeroFields {
	title: string
	subtitle?: string
	image?: {
		url: string
		label: string
	}
	ctaButton?: {
		href: string
		target: string
		text: string
	}
}

/**
 * Hero Component
 *
 * Renders a hero section with title, subtitle, optional background image, and CTA button.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @returns A section element with the hero content
 */
const Hero = async ({ module, languageCode }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, subtitle, image, ctaButton },
		contentID,
	} = await getContentItem<HeroFields>({
		contentID: module.contentid,
		languageCode,
	})

	return (
		<section
			className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
			data-agility-component={contentID}
		>
			{image && (
				<div className="absolute inset-0 z-0">
					<AgilityPic
						image={image as any}
						fallbackWidth={1920}
						className="h-full w-full object-cover"
						sources={[
							{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
							{ media: "(min-width: 1280px)", width: 1920 },
							{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
							{ media: "(min-width: 640px)", width: 1280 },
							{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1920 },
							{ media: "(max-width: 639px)", width: 960 },
						]}
					/>
					<div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
				</div>
			)}
			<div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-6" data-agility-field="title">
					{title}
				</h1>
				{subtitle && (
					<p className="text-xl text-muted-foreground sm:text-2xl mb-8" data-agility-field="subtitle">
						{subtitle}
					</p>
				)}
				{ctaButton && (
					<Button asChild size="lg" className="mt-4">
						<Link href={ctaButton.href} target={ctaButton.target}>
							{ctaButton.text}
						</Link>
					</Button>
				)}
			</div>
		</section>
	)
}

export default Hero

