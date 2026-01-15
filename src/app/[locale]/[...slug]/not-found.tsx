import Link from 'next/link'
import { Button } from '@/components/ui/button'
import './not-found.css'

export default function NotFound() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			{/* Floating astronaut animation */}
			<div className="relative mb-8">
				<div className="notfound-float text-8xl md:text-9xl">
					🧑‍🚀
				</div>
				{/* Stars around the astronaut */}
				<div className="absolute -top-4 -left-8 notfound-twinkle text-2xl">✨</div>
				<div className="absolute top-8 -right-6 notfound-twinkle-delayed text-xl">⭐</div>
				<div className="absolute -bottom-2 left-0 notfound-twinkle text-lg">💫</div>
				<div className="absolute top-0 right-0 notfound-twinkle-delayed text-sm">✨</div>
			</div>

			{/* 404 text with glitch effect */}
			<h1 className="animate-slide-up mb-4 text-6xl font-bold tracking-tighter md:text-8xl">
				<span className="inline-block notfound-glitch">4</span>
				<span className="inline-block notfound-spin-slow mx-2">🪐</span>
				<span className="inline-block notfound-glitch-delayed">4</span>
			</h1>

			<h2 className="animate-fade-in mb-2 text-2xl font-semibold text-foreground/90 md:text-3xl">
				Lost in Space
			</h2>

			<p className="animate-fade-in mb-4 max-w-md text-muted-foreground">
				Ground Control to Major Tom: The page you&apos;re looking for has drifted off into the cosmic void.
			</p>

			{/* Radio transmission effect */}
			<div className="animate-fade-in mb-8 max-w-md rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 font-mono text-sm">
				<p className="text-muted-foreground">
					<span className="notfound-blink text-yellow-500">●</span> TRANSMISSION LOG:
				</p>
				<p className="mt-1 text-muted-foreground/80">
					&quot;Your circuit&apos;s dead, there&apos;s something wrong...&quot;
				</p>
				<p className="text-muted-foreground/60">
					Can you hear me, Major Tom?
				</p>
			</div>

			{/* Action buttons */}
			<div className="animate-slide-up flex flex-col gap-4 sm:flex-row">
				<Button asChild size="lg">
					<Link href="/">
						🚀 Return to Earth
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link href="/blog">
						📚 Explore the Blog
					</Link>
				</Button>
			</div>

			{/* Bowie tribute */}
			<div className="mt-12 animate-fade-in text-sm text-muted-foreground/70">
				<p className="italic">
					&quot;For here am I sitting in a tin can, far above the world...&quot;
				</p>
				<p className="mt-1 text-xs">— David Bowie, Space Oddity</p>
			</div>
		</div>
	)
}
