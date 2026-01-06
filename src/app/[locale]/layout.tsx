import type React from 'react'
import { getAgilityContext } from '@/lib/cms/getAgilityContext'

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
    <>
      {children}
    </>
  )
}

