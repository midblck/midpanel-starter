import { getUserLocale } from '@/utilities/get-locale'
import { NextIntlClientWrapper } from './next-intl-client-wrapper'

interface NextIntlProviderProps {
  children: React.ReactNode
}

export async function NextIntlProvider({ children }: NextIntlProviderProps) {
  const locale = await getUserLocale()

  // For now, we'll pass empty messages since the translations are handled differently
  // The useCommentsBlockTranslations hook uses a custom translation system
  const messages = {}

  return (
    <NextIntlClientWrapper locale={locale} messages={messages}>
      {children}
    </NextIntlClientWrapper>
  )
}
