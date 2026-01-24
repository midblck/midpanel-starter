import { ArrowLeft, Home, Search } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/frontend'

export default function NotFoundPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navigation user={null} />

      {/* Main Content */}
      <main className='flex items-center justify-center min-h-[calc(100vh-80px)]'>
        <div className='container mx-auto px-6 py-16'>
          <div className='text-center space-y-8 max-w-2xl mx-auto'>
            {/* 404 Illustration */}
            <div className='relative'>
              <div className='text-8xl md:text-9xl font-bold text-muted-foreground/20 select-none'>
                404
              </div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <Search className='h-16 w-16 md:h-20 md:w-20 text-muted-foreground/40' />
              </div>
            </div>

            {/* Error Message */}
            <div className='space-y-4'>
              <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Page Not Found</h1>
              <p className='text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed'>
                Sorry, we couldn't find the page you're looking for. The page might have been moved,
                deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Button size='lg' asChild>
                <Link href='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Go Home
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/blogs'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Browse Blogs
                </Link>
              </Button>
            </div>

            {/* Additional Help */}
            <div className='pt-8 border-t border-border/50'>
              <p className='text-sm text-muted-foreground'>
                If you believe this is an error, please{' '}
                <Link
                  href='/auth/sign-in'
                  className='text-primary hover:text-primary/80 underline underline-offset-2'
                >
                  contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
