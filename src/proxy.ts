import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales, isValidLocale, getLocaleFromPathname, removeLocaleFromPathname } from './lib/i18n/config'
import { checkRedirect } from './lib/cms-content/checkRedirect'

export async function proxy(request: NextRequest) {
	/*****************************
	 * *** AGILITY PROXY ***
	 * 1: Check if this is a preview request,
	 * 2: Check if we are exiting preview
	 * 3: Check if this is a direct to a dynamic page
	 *    based on a content id
	 *******************************/

	let pathname = request.nextUrl.pathname
	const previewQ = request.nextUrl.searchParams.get("AgilityPreview")
	let contentIDStr = request.nextUrl.searchParams.get("ContentID") as string || ""

	const ext = request.nextUrl.pathname.includes(".") ? request.nextUrl.pathname.split('.').pop() : null

	if (request.nextUrl.searchParams.has("agilitypreviewkey")) {
		//*** this is a preview request ***
		const agilityPreviewKey = request.nextUrl.searchParams.get("agilitypreviewkey") || ""
		const locale = request.nextUrl.searchParams.get("lang")
		const slug = request.nextUrl.pathname
		let redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/preview?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(slug)}&agilitypreviewkey=${encodeURIComponent(agilityPreviewKey)}`
		return NextResponse.redirect(redirectUrl)
	} else if (previewQ === "0") {
		//*** exit preview
		const locale = request.nextUrl.searchParams.get("lang")
		const slug = request.nextUrl.pathname
		let redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/preview/exit?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(slug)}`
		return NextResponse.redirect(redirectUrl)
	} else if (contentIDStr) {
		const contentID = parseInt(contentIDStr)
		if (!isNaN(contentID) && contentID > 0) {
			//*** this is a dynamic page request ***
			let dynredirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/dynamic-redirect?ContentID=${contentID}`
			return NextResponse.rewrite(dynredirectUrl)
		}
	} else if ((!ext || ext.length === 0)) {
		/**********************
		 * CHECK FOR REDIRECT *
		***********************/
		const redirection = await checkRedirect({ path: request.nextUrl.pathname })

		if (redirection) {
			// Redirect to the destination URL with caching
			if (redirection.destinationUrl.startsWith("/")) {
				// Handle relative paths
				const url = request.nextUrl.clone()
				url.pathname = redirection.destinationUrl
				return NextResponse.redirect(url, {
					status: redirection.statusCode,
					headers: {
						"Cache-Control": "public,maxage=600, stale-while-revalidate"
					}
				})
			} else {
				// Handle absolute paths
				return NextResponse.redirect(redirection.destinationUrl, {
					status: redirection.statusCode,
					headers: {
						"Cache-Control": "public,maxage=3600, stale-while-revalidate"
					}
				})
			}
		}

		/**************************************
		 * SPECIAL CASE FOR lang= QUERY PARAM *
		 **************************************/
		const langParam = request.nextUrl.searchParams.get("lang")
		const currentLocale = getLocaleFromPathname(pathname, locales) || defaultLocale

		if (langParam && isValidLocale(langParam, locales) && langParam !== currentLocale) {
			if (langParam === defaultLocale) {
				const redirectUrl = new URL(request.nextUrl.toString())
				redirectUrl.pathname = removeLocaleFromPathname(pathname, currentLocale)
				redirectUrl.searchParams.delete("lang")
				return NextResponse.redirect(redirectUrl)
			} else {
				const redirectUrl = new URL(request.nextUrl.toString())
				const pathnameWithoutLocale = removeLocaleFromPathname(pathname, currentLocale)
				redirectUrl.pathname = `/${langParam}${pathnameWithoutLocale}`
				redirectUrl.searchParams.delete("lang")
				return NextResponse.redirect(redirectUrl)
			}
		}

		/************************
		 * LOCALE BASED ROUTING *
		 ************************/
		const baseUrl = request.nextUrl.origin
		const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next')
		const hasLocalePrefix = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

		// If the URL has the default locale prefix, redirect to remove it (cleaner URLs)
		// This must happen BEFORE search params encoding to preserve query strings properly
		// Check the ORIGINAL pathname (before search param encoding)
		const originalPathname = request.nextUrl.pathname
		if (originalPathname.startsWith(`/${defaultLocale}/`) || originalPathname === `/${defaultLocale}`) {
			const pathWithoutLocale = originalPathname === `/${defaultLocale}`
				? '/'
				: originalPathname.replace(`/${defaultLocale}`, '') || '/'
			const cleanUrl = new URL(pathWithoutLocale, baseUrl)
			cleanUrl.search = request.nextUrl.search // Preserve query params
			return NextResponse.redirect(cleanUrl)
		}

		/************************
		 * HANDLE SEARCH PARAMS *
		 ************************/
		let searchParams = request.nextUrl.searchParams.toString()
		let hasSearchParams = searchParams && searchParams.length > 0
		if (!hasSearchParams) {
			searchParams = ""
		}

		if (searchParams && searchParams.length > 0) {
			const searchParamPortion = `~~~${encodeURIComponent(searchParams)}~~~`
			pathname = pathname.endsWith("/") ? `${pathname}${searchParamPortion}` : `${pathname}/${searchParamPortion}`
		}

		/************************
		 * CONTINUE LOCALE ROUTING *
		 ************************/
		// Re-check hasLocalePrefix after search param encoding (pathname may have changed)
		const hasLocalePrefixAfterEncoding = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

		if (!hasLocalePrefixAfterEncoding && !isStaticFile) {
			// Ensure pathname has a leading slash and add default locale
			// For root path, rewrite to /en-us/ (with trailing slash to match [...slug] route)
			const normalizedPath = pathname === '/' ? '/' : pathname
			const localeBasedUrl = new URL(`/${defaultLocale}${normalizedPath}`, baseUrl)
			return NextResponse.rewrite(localeBasedUrl)
		}

		if (hasSearchParams) {
			const searchParamUrl = new URL(pathname, baseUrl)
			return NextResponse.rewrite(searchParamUrl)
		}

		// Return undefined to continue with normal Next.js routing
		return undefined
	}
}

export const config = {
	matcher: [
		'/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
	],
}

