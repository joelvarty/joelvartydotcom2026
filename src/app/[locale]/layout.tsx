import type React from 'react'
import { getAgilityContext } from '@/lib/cms/getAgilityContext'
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
  const { isDevelopmentMode, isPreview } = await getAgilityContext(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PreviewBar isPreview={isPreview} isDevelopmentMode={isDevelopmentMode} />
    </div>
  )
}

