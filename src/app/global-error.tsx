'use client'

import { useEffect, useState } from 'react'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const [isShaking, setIsShaking] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => setIsShaking(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<html>
			<body>
				<div style={{
					display: 'flex',
					minHeight: '100vh',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '1rem',
					textAlign: 'center',
					fontFamily: 'system-ui, sans-serif',
				}}>
					<div style={{ position: 'relative', marginBottom: '2rem' }}>
						<div style={{
							fontSize: '8rem',
							animation: isShaking ? 'shake 0.8s cubic-bezier(.36,.07,.19,.97) both' : 'wobble 2s ease-in-out infinite',
						}}>
							🤖
						</div>
					</div>

					<h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
						<span style={{ color: '#ef4444' }}>Oops!</span> Something Broke
					</h1>

					<p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px' }}>
						Don&apos;t worry, it&apos;s not you — it&apos;s our code having an existential crisis.
					</p>

					{error.digest && (
						<p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
							Error ID: {error.digest}
						</p>
					)}

					<div style={{ display: 'flex', gap: '1rem' }}>
						<button
							onClick={() => reset()}
							style={{
								padding: '0.75rem 1.5rem',
								backgroundColor: '#171717',
								color: 'white',
								border: 'none',
								borderRadius: '0.375rem',
								cursor: 'pointer',
								fontSize: '1rem',
							}}
						>
							🔄 Try Again
						</button>
						<button
							onClick={() => window.location.href = '/'}
							style={{
								padding: '0.75rem 1.5rem',
								backgroundColor: 'white',
								color: '#171717',
								border: '1px solid #e5e7eb',
								borderRadius: '0.375rem',
								cursor: 'pointer',
								fontSize: '1rem',
							}}
						>
							🏠 Go Home
						</button>
					</div>

					<style>{`
						@keyframes shake {
							0%, 100% { transform: translateX(0); }
							10%, 30%, 50%, 70%, 90% { transform: translateX(-10px) rotate(-5deg); }
							20%, 40%, 60%, 80% { transform: translateX(10px) rotate(5deg); }
						}
						@keyframes wobble {
							0%, 100% { transform: rotate(-3deg); }
							50% { transform: rotate(3deg); }
						}
					`}</style>
				</div>
			</body>
		</html>
	)
}
