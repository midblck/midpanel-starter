import { Branding } from '@/components/branding'

export function Footer() {
  return (
    <footer className='border-t'>
      <div className='container mx-auto px-6 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
          <Branding variant='icon' size='sm' />
          <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
            <a
              href='https://payloadcms.com/docs'
              className='hover:text-foreground transition-colors'
            >
              PayloadCMS Docs
            </a>
            <a href='https://ui.shadcn.com' className='hover:text-foreground transition-colors'>
              shadcn/ui
            </a>
            <a href='https://nextjs.org/docs' className='hover:text-foreground transition-colors'>
              Next.js Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
