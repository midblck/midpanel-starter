'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = React.useCallback(
    () => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';

      // Simple theme toggle without View Transitions API
      setTheme(newMode);
    },
    [resolvedTheme, setTheme]
  );

  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='sm'
        className='h-10 w-10 touch-manipulation'
        disabled
        aria-label='Toggle theme'
      >
        <Sun className='h-4 w-4 shrink-0' />
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='h-10 w-10 flex items-center justify-center touch-manipulation relative'
      onClick={handleThemeToggle}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Moon className='h-4 w-4 shrink-0' />
      ) : (
        <Sun className='h-4 w-4 shrink-0' />
      )}
    </Button>
  );
}
