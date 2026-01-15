'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import './error.css'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const [isShaking, setIsShaking] = useState(true)
	const [sparks, setSparks] = useState<number[]>([])

	useEffect(() => {
		// Stop shaking after initial animation
		const timer = setTimeout(() => setIsShaking(false), 1000)

		// Generate random sparks
		const sparkInterval = setInterval(() => {
			setSparks(prev => {
				const newSparks = [...prev, Date.now()]
				return newSparks.slice(-5) // Keep only last 5 sparks
			})
		}, 800)

		return () => {
			clearTimeout(timer)
			clearInterval(sparkInterval)
		}
	}, [])

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			{/* Broken robot animation */}
			<div className="relative mb-8">
				<div className={`text-8xl md:text-9xl ${isShaking ? 'error-shake' : 'error-wobble'}`}>
					🤖
				</div>

				{/* Sparks flying out */}
				{sparks.map((spark) => (
					<div
						key={spark}
						className="absolute error-spark text-xl"
						style={{
							top: '50%',
							left: '50%',
						}}
					>
						⚡
					</div>
				))}

				{/* Smoke effect */}
				<div className="absolute -top-6 left-1/2 -translate-x-1/2 error-smoke text-3xl opacity-60">
					💨
				</div>

				{/* Gears */}
				<div className="absolute -bottom-2 -left-4 error-spin-reverse text-2xl">⚙️</div>
				<div className="absolute -bottom-2 -right-4 error-spin-slow text-2xl">⚙️</div>
			</div>

			{/* Error text */}
			<h1 className="animate-slide-up mb-4 text-4xl font-bold tracking-tighter md:text-6xl">
				<span className="text-destructive">Oops!</span> Something Broke
			</h1>

			<h2 className="animate-fade-in mb-2 text-xl font-semibold text-foreground/90 md:text-2xl">
				🔧 Our robots are on it
			</h2>

			<p className="animate-fade-in mb-8 max-w-md text-muted-foreground">
				Don&apos;t worry, it&apos;s not you — it&apos;s our code having an existential crisis.
				Our team of highly caffeinated developers has been notified.
			</p>

			{/* Error digest for debugging (subtle) */}
			{error.digest && (
				<p className="mb-4 font-mono text-xs text-muted-foreground/50">
					Error ID: {error.digest}
				</p>
			)}

			{/* Action buttons */}
			<div className="animate-slide-up flex flex-col gap-4 sm:flex-row">
				<Button onClick={() => reset()} size="lg" className="gap-2">
					🔄 Try Again
				</Button>
				<Button
					onClick={() => window.location.href = '/'}
					variant="outline"
					size="lg"
					className="gap-2"
				>
					🏠 Go Home
				</Button>
			</div>

			{/* Fun loading messages */}
			<div className="mt-12 animate-fade-in">
				<p className="text-sm italic text-muted-foreground/70">
					&quot;Have you tried turning it off and on again?&quot;
				</p>
				<p className="mt-1 text-xs text-muted-foreground/50">— Every IT person ever</p>
			</div>
		</div>
	)
}
