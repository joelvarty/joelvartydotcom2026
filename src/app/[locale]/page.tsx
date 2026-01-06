import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n/config'

export default function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // Redirect to home page - this will be handled by the [...slug] route
  redirect('/')
}

