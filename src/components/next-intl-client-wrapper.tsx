'use client'

import { NextIntlClientProvider } from 'next-intl'

interface NextIntlClientWrapperProps {
  children: React.ReactNode
  locale: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>
}

export function NextIntlClientWrapper({ children, locale, messages }: NextIntlClientWrapperProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
