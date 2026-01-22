import { ArrowRight, Code } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className='py-24'>
      <div className='container mx-auto px-6'>
        <div className='text-center space-y-8 max-w-4xl mx-auto'>
          <Badge variant='secondary' className='mb-6'>
            <Code className='h-3 w-3 mr-1' />
            Production-Ready Starter
          </Badge>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            The modern{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              admin starter
            </span>
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            Next.js 15, TypeScript, PayloadCMS, and shadcn/ui components. Build production-ready
            admin panels with Midblck Admin Starter.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <Button size='lg' asChild>
              <a href='/auth/sign-up'>
                Get Started
                <ArrowRight className='ml-2 h-4 w-4' />
              </a>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a href='https://payloadcms.com/docs' rel='noopener noreferrer' target='_blank'>
                Documentation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
