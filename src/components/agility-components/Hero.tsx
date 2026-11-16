/**
 * Hero Component
 *
 * An Agility CMS module component that displays a hero section with title, subtitle, image, and optional CTA button.
 */

import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps } from "@agility/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PriorityImage } from "@/components/images/PriorityImage"
import { FULL_BLEED_IMAGE_WIDTHS } from "@/lib/agility/image-utils"

/**
 * The hero image is the page's LCP element (About, Uses), so both layouts render
 * it with PriorityImage: fetchpriority="high" plus a matching preload.
 */

/** Side-by-side image candidates (up to 576px wide at 1-3x). */
const SIDE_IMAGE_WIDTHS = [384, 512, 640, 828, 1080, 1280, 1600] as const
/**
 * Side-by-side image's rendered width: full width minus 16px gutters on phones;
 * capped at max-w-lg (512px) from sm; half the max-w-7xl grid (minus 32px
 * padding and the 64px gap) from lg, which tops out at 576px.
 */
const SIDE_IMAGE_SIZES =
	"(min-width: 1280px) 576px, (min-width: 1024px) calc(50vw - 64px), (min-width: 640px) 512px, calc(100vw - 32px)"

/**
 * Interface defining the structure of the Hero module fields.
 */
export interface HeroFields {
	title: string
	subtitle?: string
	image?: {
		url: string
		label: string
		width?: number
		height?: number
	}
	heroImage?: {
		url: string
		label: string
		width?: number
		height?: number
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
const Hero = async ({ module, languageCode, isPreview }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, subtitle, image, heroImage, ctaButton },
		contentID,
	} = await getContentItem<HeroFields>({
		contentID: module.contentid,
		languageCode,
		preview: isPreview,
	})

	// Side-by-side layout when heroImage is present
	if (heroImage) {
		return (
			<section
				className="relative overflow-hidden"
				data-agility-component={contentID}
			>
				{/* Grayscale gradient background with soft glow effect */}
				<div className="absolute inset-0 z-0 bg-white dark:bg-gray-950">
					{/* Large soft glow in top right */}
					<div
						className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] rounded-full opacity-60 dark:opacity-40 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(180,180,190,0.8) 0%, rgba(200,200,210,0.4) 40%, transparent 70%)',
						}}
					/>
					{/* Secondary glow in bottom left */}
					<div
						className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full opacity-40 dark:opacity-30 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(160,160,170,0.6) 0%, rgba(180,180,190,0.3) 40%, transparent 70%)',
						}}
					/>
					{/* Subtle center glow */}
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full opacity-30 dark:opacity-20 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(200,200,210,0.5) 0%, transparent 50%)',
						}}
					/>
				</div>
				<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid min-h-[60vh] items-center gap-8 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
						{/* Content on the left */}
						<div className="flex flex-col justify-center">
							<h1
								className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
								data-agility-field="title"
							>
								{title}
							</h1>
							{subtitle && (
								<p
									className="text-lg text-muted-foreground sm:text-xl lg:text-2xl mb-8 max-w-xl"
									data-agility-field="subtitle"
								>
									{subtitle}
								</p>
							)}
							{ctaButton && (
								<div>
									<Button asChild size="lg">
										<Link href={ctaButton.href} target={ctaButton.target}>
											{ctaButton.text}
										</Link>
									</Button>
								</div>
							)}
						</div>
						{/* Hero image on the right */}
						<div className="relative flex items-center justify-center lg:justify-end">
							<div className="relative w-full max-w-lg lg:max-w-none">
								<div
								className="overflow-hidden rounded-2xl ring-1 ring-border/10"
								style={{
									boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 12px 24px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
								}}
							>
									<PriorityImage
										url={heroImage.url}
										alt={heroImage.label}
										widths={SIDE_IMAGE_WIDTHS}
										sizes={SIDE_IMAGE_SIZES}
										fallbackWidth={800}
										intrinsicWidth={heroImage.width}
										intrinsicHeight={heroImage.height}
										className="h-auto w-full object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}

	// Centered layout (original) when no heroImage
	return (
		<section
			className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
			data-agility-component={contentID}
		>
			{image ? (
				<div className="absolute inset-0 z-0">
					<PriorityImage
						url={image.url}
						alt={image.label}
						widths={[...FULL_BLEED_IMAGE_WIDTHS, 3840]}
						sizes="100vw"
						fallbackWidth={1920}
						intrinsicWidth={image.width}
						intrinsicHeight={image.height}
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
				</div>
			) : (
				/* Grayscale gradient background with soft glow effect */
				<div className="absolute inset-0 z-0 bg-white dark:bg-gray-950">
					{/* Large soft glow in top right */}
					<div
						className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] rounded-full opacity-60 dark:opacity-40 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(180,180,190,0.8) 0%, rgba(200,200,210,0.4) 40%, transparent 70%)',
						}}
					/>
					{/* Secondary glow in bottom left */}
					<div
						className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full opacity-40 dark:opacity-30 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(160,160,170,0.6) 0%, rgba(180,180,190,0.3) 40%, transparent 70%)',
						}}
					/>
					{/* Subtle center glow */}
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full opacity-30 dark:opacity-20 blur-3xl"
						style={{
							background: 'radial-gradient(circle, rgba(200,200,210,0.5) 0%, transparent 50%)',
						}}
					/>
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

