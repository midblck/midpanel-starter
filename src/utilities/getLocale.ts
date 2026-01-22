import { locales, defaultLocale, type Locale } from '@/i18n/config'
import { cookies, headers } from 'next/headers'
import { logWarn } from '@/utilities/logger'

export async function getUserLocale(): Promise<string> {
  try {
    // Check cookies first (for client-side preference)
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get('locale')?.value

    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      return cookieLocale
    }

    // Check Accept-Language header
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')

    if (acceptLanguage) {
      // Parse Accept-Language header and find first matching locale
      const preferredLocales = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().split('-')[0])

      for (const lang of preferredLocales) {
        if (locales.includes(lang as Locale)) {
          return lang
        }
      }
    }

    // Fallback to default locale
    return defaultLocale
  } catch (error) {
    // In case of any error, fallback to default
    logWarn('Error getting user locale', {
      component: 'Locale',
      action: 'get-user-locale',
      error: error instanceof Error ? error.message : String(error),
    })
    return defaultLocale
  }
}
