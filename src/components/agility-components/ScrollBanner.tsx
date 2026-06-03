/**
 * ScrollBanner Component
 *
 * A full-bleed banner image with overlaid content (passed as children), used at
 * the top of blog post detail pages.
 *
 * Behaviour (>= sm screens):
 *  - The photo is shown full width at its natural aspect ratio, so none of it is
 *    cropped.
 *  - The photo is pinned (sticky) while you scroll. The overlaid heading scrolls
 *    up and fades out completely BEFORE the photo itself starts to move, then
 *    the (now clean) photo scrolls away with the rest of the page.
 *
 * On small screens the overlay would not sit well over a short, full-width photo,
 * so the overlay/pin are disabled here and the heading is rendered below the
 * photo by the parent (BlogDetails) instead.
 *
 * The effect uses a passive scroll listener + requestAnimationFrame (CSS
 * scroll-timelines aren't supported in Safari/iPad yet) and mutates transforms
 * directly to avoid per-frame React re-renders. It is disabled under
 * prefers-reduced-motion.
 */

"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { AgilityPic } from "@agility/nextjs"
import { createImageField } from "@/lib/agility/image-utils"

interface ScrollBannerProps {
	image: { url: string; label: string }
	children: ReactNode
}

export function ScrollBanner({ image, children }: ScrollBannerProps) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		let raf = 0

		const update = () => {
			const wrapper = wrapperRef.current
			const overlay = overlayRef.current
			const text = textRef.current
			if (!wrapper || !overlay || !text) return

			// The overlay/pin only exist on >= sm; leave things untouched on mobile.
			if (window.innerWidth < 640) {
				overlay.style.opacity = ""
				text.style.transform = ""
				return
			}

			// How far we've scrolled past the top of the banner. While the photo is
			// pinned this is exactly how far the page has scrolled, so translating
			// the text up 1:1 reads as the text scrolling off the still photo.
			const scrolled = Math.max(-wrapper.getBoundingClientRect().top, 0)
			const vh = window.innerHeight || 1
			const fade = Math.max(1 - scrolled / (vh * 0.5), 0)

			text.style.transform = `translate3d(0, ${-scrolled}px, 0)`
			// Fade the scrim + text together so the photo is left clean once the
			// heading has scrolled away.
			overlay.style.opacity = String(fade)
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
		<div ref={wrapperRef} className="relative w-full">
			{/* Pinned photo stage. Sticky on >= sm so the heading can scroll off before the photo moves. */}
			<div className="w-full min-h-[40vh] overflow-hidden sm:sticky sm:top-0">
				<AgilityPic
					image={createImageField({ url: image.url, alt: image.label })}
					fallbackWidth={1920}
					priority
					className="block h-auto w-full"
					sources={[
						{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 },
						{ media: "(min-width: 1280px)", width: 1920 },
						{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2560 },
						{ media: "(min-width: 640px)", width: 1280 },
						{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1920 },
						{ media: "(max-width: 639px)", width: 960 },
					]}
				/>

				{/* Scrim + overlaid heading (>= sm only). Fades out as the heading scrolls away. */}
				<div ref={overlayRef} className="hidden will-change-[opacity] sm:block">
					<div className="absolute inset-0 bg-black/25" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
					<div className="absolute inset-x-0 top-0 flex h-[100svh] max-h-full items-center justify-center px-6 lg:px-8">
						<div ref={textRef} className="w-full max-w-3xl text-center will-change-transform">
							{children}
						</div>
					</div>
				</div>
			</div>

			{/* Spacer that gives the heading room to scroll away while the photo stays pinned (>= sm only). */}
			<div className="hidden sm:block sm:h-[55vh]" aria-hidden="true" />
		</div>
	)
}
