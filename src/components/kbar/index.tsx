'use client';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { createAllKBarActions } from './actions';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions = useMemo(() => {
    const navigateTo = (url: string) => {
      router.push(url);
    };

    const openInNewTab = (url: string) => {
      window.open(url, '_blank');
    };

    return createAllKBarActions(navigateTo, openInNewTab);
  }, [router]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 dark:bg-background/90 fixed inset-0 z-[999999] p-2 sm:p-4 md:p-8 backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-card-foreground relative w-full max-w-[600px] mx-auto overflow-hidden rounded-lg border border-border shadow-lg z-[999999] animate-in fade-in-0 zoom-in-95 duration-200'>
            <div className='bg-card border-border sticky top-0 z-[999999] border-b'>
              <KBarSearch
                className='bg-card text-card-foreground placeholder:text-muted-foreground w-full border-none px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg outline-none focus:ring-0 focus:ring-offset-0'
                placeholder='Search...'
              />
            </div>
            <div className='max-h-[60vh] sm:max-h-[400px] overflow-y-auto z-[999999]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
