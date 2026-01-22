import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import SignInViewPage from '@/features/auth/components/sign-in-view'
import config from '@/payload.config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ signedOut?: string }>
}) {
  const params = await searchParams

  // Skip auth check if user just signed out to prevent redirect loop
  if (params.signedOut !== 'true') {
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    // Redirect authenticated users to app
    if (user) {
      redirect('/app')
    }
  }

  return <SignInViewPage />
}
