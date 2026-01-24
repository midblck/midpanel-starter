export const locales = ['en', 'id'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'id'

export const localeLabels = {
  en: 'English',
  id: 'Bahasa Indonesia',
} as const
