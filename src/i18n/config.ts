export const locales = ['id', 'en'] as const;
export const defaultLocale: Locale = 'id';
export type Locale = (typeof locales)[number];
