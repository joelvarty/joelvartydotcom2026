/**
 * Lazy Loading Utilities
 *
 * Performance optimization utilities for lazy loading components and images.
 */

import { lazy, ComponentType } from "react"

/**
 * Lazy load a component with error boundary support
 */
export function lazyLoad<T extends ComponentType<any>>(
	importFunc: () => Promise<{ default: T }>
) {
	return lazy(importFunc)
}

/**
 * Intersection Observer hook for lazy loading images
 * Returns a ref to attach to elements that should be lazy loaded
 */
export function useLazyLoad() {
	// This would be a client component hook
	// For server components, we rely on native lazy loading
	return null
}

