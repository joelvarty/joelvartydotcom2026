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
 * The effect uses a passive scroll listener + requestAnimationFrame (CSS
 * scroll-timelines aren't supported in Safari/iPad yet) and mutates transforms
 * directly to avoid per-frame React re-renders. It is disabled under
 * prefers-reduced-motion.
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
	const frozenRef = useRef<HTMLDivElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLDivElement>(null)
	const spacerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		let raf = 0

		const update = () => {
			const outer = outerRef.current
			const frozen = frozenRef.current
			const overlay = overlayRef.current
			const text = textRef.current
			const spacer = spacerRef.current
			if (!outer || !frozen || !overlay || !text || !spacer) return

			// The effect only exists on >= sm; leave everything untouched on mobile.
			if (window.innerWidth < 640) {
				frozen.style.transform = ""
				text.style.transform = ""
				overlay.style.opacity = ""
				spacer.style.height = ""
				return
			}

			const vh = window.innerHeight || 1
			// How far the photo + content are held still while the heading scrolls off.
			const hold = vh * 0.65
			spacer.style.height = `${hold}px`

			// naturalTop: the banner's top relative to the viewport, ignoring our transform
			// (outer is never transformed, only its frozen child is).
			const naturalTop = outer.getBoundingClientRect().top
			// Once the banner reaches the top of the viewport, counter the scroll for `hold`
			// pixels so the photo + content stay still, then let them scroll away.
			const held = Math.min(Math.max(-naturalTop, 0), hold)

			frozen.style.transform = `translate3d(0, ${held}px, 0)`
			// Cancel the hold for just the heading so it scrolls off the still photo at
			// the natural scroll speed.
			text.style.transform = `translate3d(0, ${-held}px, 0)`
			// Fade the scrim + heading together so the photo is left clean.
			overlay.style.opacity = String(Math.max(1 - held / (vh * 0.55), 0))
		}

		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(update)
		}

		update()
		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
		}
	}, [])

	return (
		<div ref={outerRef} className="relative w-full">
			<div ref={frozenRef} className="sm:will-change-transform">
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
						decoding="async"
						className="block h-auto w-full"
					/>

					{/* Scrim + overlaid heading (>= sm only). Fades out as the heading scrolls away. */}
					<div ref={overlayRef} className="hidden will-change-[opacity] sm:block">
						<div className="absolute inset-0 bg-black/25" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
						<div className="absolute inset-x-0 top-0 flex h-[100svh] max-h-full items-center justify-center px-6 lg:px-8">
							<div ref={textRef} className="w-full max-w-3xl text-center will-change-transform">
								{heading}
							</div>
						</div>
					</div>
				</div>

				{/* Article content: held with the photo, then scrolls away together. */}
				{children}
			</div>

			{/* Scroll room consumed while holding (>= sm). Sits at the end of the article so there's no gap under the photo. */}
			<div ref={spacerRef} aria-hidden="true" className="hidden sm:block" />
		</div>
	)
}
