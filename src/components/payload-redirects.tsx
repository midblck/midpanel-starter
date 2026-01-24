'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function PayloadRedirects({}: { url: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace('/404')
  }, [router])

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Post not found</h1>
        <p className='text-gray-600'>Redirecting to 404 page...</p>
      </div>
    </div>
  )
}
