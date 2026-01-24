'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Locale, localeLabels, locales } from '@/i18n/config'
import { setUserLocale } from '@/utilities/get-locale'

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const [isPending, startTransition] = useTransition()

  const onLocaleChange = (value: string) => {
    const newLocale = value as Locale
    if (newLocale === locale) return

    startTransition(async () => {
      await setUserLocale(newLocale)
      // Force a full page reload to pick up the new locale from cookie
      // This ensures the server-side NextIntlProvider reads the updated cookie
      window.location.reload()
    })
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange} disabled={isPending}>
      <SelectTrigger className='h-9 w-full text-sm' aria-label='Select language'>
        <SelectValue>
          <span className='uppercase'>{locale}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map(loc => (
          <SelectItem key={loc} value={loc}>
            <span className='uppercase'>{loc}</span>
            <span className='ml-2 text-muted-foreground text-xs'>{localeLabels[loc]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
