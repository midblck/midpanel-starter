import { getRequestConfig } from 'next-intl/server'

import { getUserLocale } from '@/utilities/get-locale'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
  }
})
