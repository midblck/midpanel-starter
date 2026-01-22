import { ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function CTA() {
  return (
    <section className='py-20 bg-muted/30'>
      <div className='container mx-auto px-6'>
        <div className='max-w-2xl mx-auto text-center space-y-8'>
          <div>
            <h2 className='text-3xl font-bold mb-4'>Ready to get started?</h2>
            <p className='text-lg text-muted-foreground'>
              Start building your admin panel with this production-ready starter template
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' asChild>
              <a href='/auth/sign-up'>
                Start Building
                <ArrowRight className='ml-2 h-4 w-4' />
              </a>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a
                href='https://github.com/midblck/midblck-admin-starter'
                rel='noopener noreferrer'
                target='_blank'
              >
                View on GitHub
              </a>
            </Button>
          </div>
          <Separator className='my-8' />
          <div className='flex items-center justify-center space-x-8 text-sm text-muted-foreground'>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <span>Production Ready</span>
            </div>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <span>TypeScript</span>
            </div>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
