'use client'

import { useThemeConfig } from '@/components/layout/active-theme-provider'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Palette } from 'lucide-react'

export function ThemeSelector() {
  const { activeTheme, setActiveTheme, themes, isLoading } = useThemeConfig()

  if (isLoading || !themes) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='h-10 w-10 sm:w-32' />
      </div>
    )
  }

  if (themes.length === 0) {
    return (
      <div className='flex items-center gap-2'>
        <Label htmlFor='theme-selector' className='sr-only'>
          Theme Selector
        </Label>
        <Select disabled>
          <SelectTrigger
            id='theme-selector'
            className='h-10 w-10 sm:w-auto sm:min-w-[120px] justify-start cursor-not-allowed opacity-50 touch-manipulation'
            title='Create themes in PayloadCMS admin panel'
            aria-label='Theme selector (no themes available)'
          >
            <Palette className='h-4 w-4 shrink-0 sm:hidden' />
            <span className='hidden sm:inline text-muted-foreground text-sm'>
              No themes available
            </span>
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Label htmlFor='theme-selector' className='sr-only'>
        Theme Selector
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id='theme-selector'
          className='h-10 w-10 sm:w-auto sm:min-w-[120px] justify-start touch-manipulation'
          aria-label='Select theme'
        >
          <Palette className='h-4 w-4 shrink-0 sm:hidden' />
          <SelectValue placeholder='Select a theme' className='hidden sm:inline' />
        </SelectTrigger>
        <SelectContent align='end' className='w-[var(--radix-select-trigger-width)] sm:w-auto'>
          <SelectGroup>
            <SelectLabel>Available Themes</SelectLabel>
            {themes.map(theme => (
              <SelectItem
                key={theme.id}
                value={theme.name.toLowerCase().replace(/\s+/g, '-')}
                className='touch-manipulation'
              >
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full border bg-primary shrink-0' />
                  <span className='truncate'>{theme.name}</span>
                  {theme.isDefault && (
                    <span className='text-xs text-muted-foreground shrink-0'>(Default)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
