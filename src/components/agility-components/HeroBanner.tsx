/**
 * HeroBanner Component
 *
 * A full-bleed hero image with the title/subtitle overlaid on top. As you
 * scroll down, the text lifts up and fades out while the image gets a subtle
 * parallax, so after scrolling a little the photo is left clean and
 * unobstructed.
 *
 * The scroll effect is driven by a passive scroll listener + requestAnimationFrame
 * (CSS scroll-timelines aren't supported in Safari/iPad yet) and mutates
 * transforms directly to avoid per-frame React re-renders. It is disabled when
 * the user prefers reduced motion.
 */

"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { AgilityPic } from "@agility/nextjs"
import { Button } from "@/components/ui/button"
import { createImageField } from "@/lib/agility/image-utils"

interface HeroBannerProps {
	image: { url: string; label: string }
	title: string
	subtitle?: string
	ctaButton?: { href: string; target: string; text: string }
	contentID: number
}

export function HeroBanner({ image, title, subtitle, ctaButton, contentID }: HeroBannerProps) {
	const sectionRef = useRef<HTMLElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		let raf = 0

		const update = () => {
			const section = sectionRef.current
			if (!section) return
			const height = section.offsetHeight || 1
			// 0 when the hero top is at the top of the viewport, 1 once it has
			// scrolled fully out the top.
			const progress = Math.min(Math.max(-section.getBoundingClientRect().top / height, 0), 1)

			if (contentRef.current) {
				contentRef.current.style.transform = `translate3d(0, ${-progress * 140}px, 0)`
				contentRef.current.style.opacity = String(Math.max(1 - progress * 1.6, 0))
			}
			if (imageRef.current) {
				// Gentle parallax: the photo drifts down a touch (scaled up so no edge shows).
				imageRef.current.style.transform = `translate3d(0, ${progress * 48}px, 0) scale(1.06)`
			}
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
		<section
			ref={sectionRef}
			data-agility-component={contentID}
			className="relative w-full h-[80vh] min-h-[460px] overflow-hidden"
		>
			{/* Full-bleed image (parallax) */}
			<div ref={imageRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.06)" }}>
				<AgilityPic
					image={createImageField({ url: image.url, alt: image.label })}
					fallbackWidth={1920}
					priority
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
			</div>

			{/* Scrim for legibility while the text overlaps the photo */}
			<div className="absolute inset-0 bg-black/20" />
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

			{/* Overlaid title/subtitle that lifts and fades on scroll */}
			<div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<div ref={contentRef} className="max-w-3xl text-center will-change-transform">
					<h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl" data-agility-field="title">
						{title}
					</h1>
					{subtitle && (
						<p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 drop-shadow-md sm:text-xl lg:text-2xl" data-agility-field="subtitle">
							{subtitle}
						</p>
					)}
					{ctaButton && (
						<div className="mt-8">
							<Button asChild size="lg">
								<Link href={ctaButton.href} target={ctaButton.target}>
									{ctaButton.text}
								</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
