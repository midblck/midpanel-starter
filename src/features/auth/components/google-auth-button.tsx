'use client'

import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

export default function GoogleSignInButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/app'

  const handleGoogleAuth = () => {
    // Use users collection with customer role - FORCE UPDATE v2
    const collection = 'users'
    const role = 'customer'
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    // Add multiple cache-busting parameters to prevent browser caching
    const cacheBust = Date.now()
    const version = 'v2'

    window.location.href = `/api/auth/google?collection=${collection}&role=${role}&callbackUrl=${encodedCallbackUrl}&_cb=${cacheBust}&_v=${version}`
  }

  return (
    <Button
      type='button'
      onClick={handleGoogleAuth}
      variant='outline'
      className='w-full h-12 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-200'
    >
      <Icon name='google' size='sm' className='mr-3' />
      Continue with Google
    </Button>
  )
}
