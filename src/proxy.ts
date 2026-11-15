import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales, isValidLocale, getLocaleFromPathname, removeLocaleFromPathname } from './lib/i18n/config'
import { checkRedirect } from './lib/cms-content/checkRedirect'
import { isAppPath, isPublicFile, isPublishedPath } from './lib/cms/publishedPaths'

/** Next sets this cookie when draft mode is on. */
const DRAFT_COOKIE = "__prerender_bypass"

/**
 * Edge cache headers (RFC 9213 `CDN-Cache-Control`, honoured by Vercel). They
 * live HERE rather than in next.config's `headers()` because that rule is
 * unconditional: it would put `public` caching on draft-mode renders too,
 * publishing unpublished content to a shared CDN.
 *
 * The TTL is only a self-healing backstop: /api/revalidate is the real
 * invalidation path, so a publish goes live immediately regardless.
 */
const CDN_CACHE = "public, s-maxage=60, stale-while-revalidate=86400"

const applyCacheHeaders = (res: NextResponse, request: NextRequest) => {
	if (request.cookies.has(DRAFT_COOKIE)) {
		//a draft render shows unpublished content: it must never reach a shared cache
		res.headers.set("Cache-Control", "private, no-store")
		return res
	}
	res.headers.set("CDN-Cache-Control", CDN_CACHE)
	return res
}

/**
 * The query params pages actually read (BlogListing and SeriesLanding paging
 * and sort order). Everything else (utm_*, fbclid, _gl...) is dropped instead of
 * being encoded into the path, where each variant became its own render and
 * cache entry.
 */
const ALLOWED_QUERY_PARAMS = ["page", "order"]
const MAX_QUERY_STRING_LENGTH = 500

/**
 * A real 404, answered by the proxy itself.
 *
 * Under `cacheComponents` every page is partially prerendered, so the static
 * shell, and with it a `200` status line, can already be on the wire before the
 * page resolves the sitemap and calls notFound(). Once headers are sent the
 * status cannot change, so an unknown URL would be a soft 404. The check happens
 * here instead, before anything renders. The body is the app's own prerendered
 * 404 page, fetched once per server instance and memoised.
 */
let notFoundBody: string | null = null

const FALLBACK_404 = "<!doctype html><title>404 Not Found</title><h1>404 Not Found</h1>"

const notFoundResponse = async (request: NextRequest) => {
	if (notFoundBody === null) {
		try {
			//the header is a hard stop: without it, a mistake in APP_PATHS turns
			//into an infinite fetch loop instead of failing visibly
			const res = await fetch(new URL("/_not-found", request.nextUrl.origin), {
				headers: { "x-proxy-404-body": "1" },
			})
			notFoundBody = await res.text()
		} catch {
			notFoundBody = FALLBACK_404
		}
	}
	return new NextResponse(notFoundBody, {
		status: 404,
		headers: { "Content-Type": "text/html; charset=utf-8" },
	})
}

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
	const contentIDStr = request.nextUrl.searchParams.get("ContentID") as string || ""

	const ext = request.nextUrl.pathname.includes(".") ? request.nextUrl.pathname.split('.').pop() : null

	if (request.nextUrl.searchParams.has("agilitypreviewkey")) {
		//*** this is a preview request ***
		const agilityPreviewKey = request.nextUrl.searchParams.get("agilitypreviewkey") || ""
		const locale = request.nextUrl.searchParams.get("lang")
		const slug = request.nextUrl.pathname
		const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/preview?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(slug)}&agilitypreviewkey=${encodeURIComponent(agilityPreviewKey)}`
		return NextResponse.redirect(redirectUrl)
	} else if (previewQ === "0") {
		//*** exit preview
		const locale = request.nextUrl.searchParams.get("lang")
		const slug = request.nextUrl.pathname
		const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/preview/exit?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(slug)}`
		return NextResponse.redirect(redirectUrl)
	} else if (contentIDStr && parseInt(contentIDStr) > 0) {
		//*** this is a dynamic page request ***
		//NOTE: the validity check lives in the condition, not inside the block, so
		//a junk ?ContentID=abc falls through to normal routing instead of matching
		//this arm and skipping locale routing.
		const contentID = parseInt(contentIDStr)
		const dynredirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/dynamic-redirect?ContentID=${contentID}&slug=${encodeURIComponent(request.nextUrl.pathname)}`
		return NextResponse.rewrite(dynredirectUrl)
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

		/*********************************
		 * VALIDATE THE PATH (real 404s) *
		 *********************************/
		// Skipped in dev and in draft mode: previewing an unpublished page is
		// exactly the case where the path is legitimately absent from the
		// PUBLISHED sitemap. Fails open if Agility is unreachable.
		const isDraft = request.cookies.has(DRAFT_COOKIE)
		const isFetchingOwn404Body = request.headers.has("x-proxy-404-body")
		if (process.env.NODE_ENV !== "development" && !isDraft && !isFetchingOwn404Body) {
			if (!(await isPublishedPath(originalPathname))) {
				return await notFoundResponse(request)
			}
		}

		/************************
		 * HANDLE SEARCH PARAMS *
		 ************************/
		const filteredParams = new URLSearchParams()
		for (const [key, value] of request.nextUrl.searchParams.entries()) {
			if (ALLOWED_QUERY_PARAMS.includes(key.toLowerCase())) {
				filteredParams.append(key, value)
			}
		}
		const searchParams = filteredParams.toString()
		const hasSearchParams = searchParams.length > 0 && searchParams.length <= MAX_QUERY_STRING_LENGTH

		if (hasSearchParams) {
			//encode the params into the path (/blog -> /blog/~~~page%3D2~~~) so the
			//page can read them from its params; getAgilityPage decodes them
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
			return applyCacheHeaders(NextResponse.rewrite(localeBasedUrl), request)
		}

		if (hasSearchParams) {
			const searchParamUrl = new URL(pathname, baseUrl)
			return applyCacheHeaders(NextResponse.rewrite(searchParamUrl), request)
		}

		return applyCacheHeaders(NextResponse.next(), request)
	} else if (process.env.NODE_ENV !== "development"
		&& !getLocaleFromPathname(pathname, locales)
		&& !isAppPath(pathname)
		&& !isPublicFile(pathname)) {
		/*******************************************
		 * UNKNOWN FILE-LIKE PATHS (/x.php, /a.md) *
		 *******************************************/
		// Nothing serves these: without this they reach the [locale] route with
		// the file name as the "locale" and stream a 200 before notFound() runs.
		return await notFoundResponse(request)
	}
}

export const config = {
	matcher: [
		'/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
	],
}

