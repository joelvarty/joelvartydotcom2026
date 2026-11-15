import type React from 'react'
import { notFound } from 'next/navigation'
import { getAgilityContext } from '@/lib/cms/getAgilityContext'
import { isValidLocale, locales } from '@/lib/i18n/config'
import { Header, Footer, PreviewBar } from '@/components/layout'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params

  // A single-segment URL with a dot (/llms.txt, /favicon.png, /about.md) skips
  // the proxy's locale rewrite and lands here with that segment as `locale`.
  // getAgilityContext would fall back to the default locale and render the
  // home page with a 200, so reject anything that is not a configured locale.
  if (!isValidLocale(locale, locales)) notFound()

  const { isDevelopmentMode, isPreview } = await getAgilityContext(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {isPreview &&
        <PreviewBar isPreview={isPreview} isDevelopmentMode={isDevelopmentMode} />
      }
    </div>
  )
}

