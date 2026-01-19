'use client';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { ThemeSelector } from '@/components/layout/theme-selector';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useKBar } from 'kbar';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { BrandingIcon } from '@/components/branding';
import { company } from '@/lib/constants';

export default function Header() {
  const { query } = useKBar();
  const isMobile = useIsMobile();

  return (
    <header className='sticky top-0 z-50 flex h-16 shrink-0 w-full max-w-full items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <div className='flex items-center gap-2 px-2 sm:px-4 flex-1 min-w-0'>
        {isMobile && (
          <div className='flex items-center gap-2 shrink-0'>
            <div className='bg-muted flex aspect-square size-8 items-center justify-center rounded-full'>
              <BrandingIcon size='sm' className='h-4 w-4' />
            </div>
            <span className='font-semibold text-foreground text-sm'>
              {company.name}
            </span>
          </div>
        )}
        {!isMobile && <SidebarTrigger className='-ml-1 shrink-0' />}
        <div className='hidden sm:flex'>
          <Breadcrumbs />
        </div>
      </div>

      <div className='flex items-center gap-1 sm:gap-2 px-2 sm:px-4 shrink-0'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => query.toggle()}
          className='h-10 w-10 flex items-center justify-center touch-manipulation'
          aria-label='Search'
        >
          <Search className='h-4 w-4 shrink-0' />
        </Button>
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}
