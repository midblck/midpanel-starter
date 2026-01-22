import { locales, defaultLocale } from '@/i18n/config';
import { cookies, headers } from 'next/headers';

export async function getUserLocale(): Promise<string> {
  try {
    // Check cookies first (for client-side preference)
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('locale')?.value;

    if (cookieLocale && locales.includes(cookieLocale as any)) {
      return cookieLocale;
    }

    // Check Accept-Language header
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');

    if (acceptLanguage) {
      // Parse Accept-Language header and find first matching locale
      const preferredLocales = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().split('-')[0]);

      for (const lang of preferredLocales) {
        if (locales.includes(lang as any)) {
          return lang;
        }
      }
    }

    // Fallback to default locale
    return defaultLocale;
  } catch (error) {
    // In case of any error, fallback to default
    console.warn('Error getting user locale:', error);
    return defaultLocale;
  }
}
