import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales, isValidLocale, getLocaleFromPathname, removeLocaleFromPathname } from './lib/i18n/config'

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
		 * LOCALE BASED ROUTING *
		 ************************/
		const hasLocalePrefix = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
		const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next')

		const baseUrl = request.nextUrl.origin

		if (!hasLocalePrefix && !isStaticFile) {
			const localeBasedUrl = new URL(`/${defaultLocale}${pathname}`, baseUrl)
			return NextResponse.rewrite(localeBasedUrl)
		}

		if (hasSearchParams) {
			const searchParamUrl = new URL(pathname, baseUrl)
			return NextResponse.rewrite(searchParamUrl)
		}
	}
}

export const config = {
	matcher: [
		'/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
	],
}

