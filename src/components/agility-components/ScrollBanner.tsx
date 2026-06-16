/**
 * ScrollBanner Component
 *
 * A full-bleed banner image with an overlaid heading, used at the top of blog
 * post detail pages. It wraps the heading AND the article body so it can hold
 * them together during the scroll effect.
 *
 * Behaviour (>= sm screens):
 *  - The photo shows full width at its natural aspect ratio, so none of it is
 *    cropped, with the article content sitting directly beneath it (no gap).
 *  - Once the banner reaches the top of the viewport, the photo and the content
 *    are HELD still while the overlaid heading scrolls up and fades out. After
 *    the heading is gone the whole thing scrolls away together. The scroll room
 *    this consumes is added as an invisible spacer at the END of the article so
 *    there is never empty space under the photo.
 *
 * On small screens the overlay would not sit well over a short, full-width photo,
 * so the effect is disabled: the photo shows full width and the heading is
 * rendered below it by the parent (BlogDetails).
 *
 * The effect is a NATIVE CSS scroll-driven animation (see the `.sb-*` rules in
 * globals.css): `animation-timeline: scroll()` runs on the compositor, so it
 * stays glued to the scroll and is smooth even with a mouse wheel — unlike a JS
 * scroll handler, which trails the scroll by a frame. The only JS here reads the
 * layout once (mount + resize) to set the scroll *range* the animation plays
 * over, then flips on `.sb-ready`. Where scroll-driven animations aren't
 * supported (older Safari/iPad) or under reduced motion, the banner just scrolls
 * normally.
 */

"use client"

import { useEffect, useRef, type ReactNode } from "react"
import {
	agilityImageUrl,
	heroImageSrcSet,
	HERO_IMAGE_FALLBACK_WIDTH,
	HERO_IMAGE_SIZES,
} from "@/lib/agility/image-utils"

interface ScrollBannerProps {
	image: { url: string; label: string }
	heading: ReactNode
	children: ReactNode
}

export function ScrollBanner({ image, heading, children }: ScrollBannerProps) {
	const outerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const outer = outerRef.current
		if (!outer) return

		// Set the scroll range the CSS animation plays over: from when the banner
		// reaches the top of the viewport (its document offset) through the next
		// `hold` pixels. This is the one thing CSS can't compute, so we read it once
		// here (never per scroll frame). `.sb-ready` then enables the animation, so
		// it never runs over the wrong (default) range before this runs.
		const setVars = () => {
			const hold = Math.round(window.innerHeight * 0.65)
			const start = Math.round(outer.getBoundingClientRect().top + window.scrollY)
			outer.style.setProperty("--sb-hold", `${hold}px`)
			outer.style.setProperty("--sb-range", `${start}px ${start + hold}px`)
			outer.style.setProperty("--sb-range-fade", `${start}px ${start + Math.round(hold * 0.82)}px`)
			outer.classList.add("sb-ready")
		}

		setVars()
		window.addEventListener("resize", setVars)
		return () => window.removeEventListener("resize", setVars)
	}, [])

	return (
		<div ref={outerRef} className="sb-root relative w-full">
			<div className="sb-frozen">
				{/* Photo (full width, natural ratio so nothing is cropped) + overlaid heading.
				    No min-height: the banner is exactly the photo's height so a short/panoramic
				    photo never leaves a scrim band below it. */}
				<div className="relative w-full overflow-hidden">
					{/*
					  Hero = LCP element. Rendered as a plain responsive <img> (not
					  AgilityPic) so it can carry fetchPriority="high"; a matching
					  <link rel="preload"> is emitted server-side in BlogDetails. The
					  srcSet/sizes here MUST match the preload so the browser reuses the
					  single fetch. eslint-disable-next-line @next/next/no-img-element:
					  intentional — Agility CDN images don't go through next/image.
					*/}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={agilityImageUrl(image.url, HERO_IMAGE_FALLBACK_WIDTH)}
						srcSet={heroImageSrcSet(image.url)}
						sizes={HERO_IMAGE_SIZES}
						alt={image.label}
						fetchPriority="high"
						loading="eager"
						// Deliberately NOT decoding="async": for the LCP image that defers the
						// decode/paint (it queued behind the gallery image decodes here and
						// pushed LCP render delay to ~8s). "sync" decodes it up front.
						decoding="sync"
						className="block h-auto w-full"
					/>

					{/* Scrim + overlaid heading (>= sm only). Fades out as the heading scrolls away. */}
					<div className="sb-overlay hidden sm:block">
						<div className="absolute inset-0 bg-black/25" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
						<div className="absolute inset-x-0 top-0 flex h-[100svh] max-h-full items-center justify-center px-6 lg:px-8">
							<div className="sb-heading w-full max-w-3xl text-center">
								{heading}
							</div>
						</div>
					</div>
				</div>

				{/* Article content: held with the photo, then scrolls away together. */}
				{children}
			</div>

			{/* Scroll room consumed while holding (>= sm). Sits at the end of the article so there's no gap under the photo. */}
			<div className="sb-spacer hidden sm:block" aria-hidden="true" />
		</div>
	)
}
