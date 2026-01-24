'use client'

import { Icons, navItems } from '@/lib/constants'
import { useIsMobile } from '@/lib/hooks/use-mobile'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/utilities/cn'
import { useAuth } from '@/features/auth'
import { generateAvatarUrl } from '@/lib/avatar'
import { Bell, CreditCard, LogOut, User } from 'lucide-react'

export default function MobileBottomNav() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, collection, hasOAuth } = useAuth()
  const [tasksSheetOpen, setTasksSheetOpen] = React.useState(false)
  const [profileSheetOpen, setProfileSheetOpen] = React.useState(false)

  // Filter to show only Dashboard and Tasks (exclude Payload Admin)
  const mobileNavItems = React.useMemo(
    () => navItems.filter(item => item.title !== 'Payload Admin'),
    [],
  )

  // Check if a nav item is active
  const isItemActive = React.useCallback(
    (item: (typeof navItems)[0]) => {
      if (item.url !== '#' && pathname === item.url) {
        return true
      }
      // Check if any sub-item is active
      if (item.items && item.items.length > 0) {
        return item.items.some(subItem => pathname === subItem.url)
      }
      return false
    },
    [pathname],
  )

  // Handle Tasks item click - open sheet
  const handleTasksClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setTasksSheetOpen(true)
  }

  // Handle sub-item navigation
  const handleSubItemClick = (url: string) => {
    setTasksSheetOpen(false)
    router.push(url)
  }

  // Handle profile menu actions
  const handleProfileClick = () => {
    setProfileSheetOpen(false)
    router.push('/app/profile')
  }

  const handleSignOut = () => {
    void signOut().then(() => {
      router.push('/auth/sign-in')
    })
  }

  // Don't render on desktop
  if (!isMobile) {
    return null
  }

  const tasksItem = mobileNavItems.find(item => item.title === 'Tasks')

  return (
    <>
      <nav
        className='fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe'
        aria-label='Mobile navigation'
      >
        {mobileNavItems.map(item => {
          const Icon = item.icon ? Icons[item.icon] : Icons.dashboard
          const isActive = isItemActive(item)
          const hasSubItems = item.items && item.items.length > 0

          if (hasSubItems) {
            // Tasks item with sub-items - opens sheet
            return (
              <button
                key={item.title}
                onClick={handleTasksClick}
                className={cn(
                  'relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors touch-manipulation',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label={`${item.title} menu`}
                aria-expanded={tasksSheetOpen}
                aria-haspopup='true'
              >
                <Icon className='h-5 w-5 shrink-0' />
                <span className='text-xs font-medium'>{item.title}</span>
                {isActive && (
                  <span className='absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary' />
                )}
              </button>
            )
          }

          // Regular item with direct link
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors touch-manipulation relative',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label={`Navigate to ${item.title}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className='h-5 w-5 shrink-0' />
              <span className='text-xs font-medium'>{item.title}</span>
              {isActive && (
                <span className='absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary' />
              )}
            </Link>
          )
        })}

        {/* Profile Menu Button */}
        <button
          onClick={() => setProfileSheetOpen(true)}
          className={cn(
            'relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors touch-manipulation',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            pathname === '/app/profile'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label='Profile menu'
          aria-expanded={profileSheetOpen}
          aria-haspopup='true'
        >
          <User className='h-5 w-5 shrink-0' />
          <span className='text-xs font-medium'>Profile</span>
          {pathname === '/app/profile' && (
            <span className='absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary' />
          )}
        </button>
      </nav>

      {/* Tasks Sub-items Sheet */}
      {tasksItem && tasksItem.items && tasksItem.items.length > 0 && (
        <Sheet open={tasksSheetOpen} onOpenChange={setTasksSheetOpen}>
          <SheetContent side='bottom' className='pb-safe'>
            <SheetHeader>
              <SheetTitle>{tasksItem.title}</SheetTitle>
              <SheetDescription>Choose a task view to navigate to</SheetDescription>
            </SheetHeader>
            <div className='mt-6 space-y-2'>
              {tasksItem.items.map(subItem => {
                const SubIcon = subItem.icon ? Icons[subItem.icon] : Icons.kanban
                const isSubActive = pathname === subItem.url

                return (
                  <button
                    key={subItem.title}
                    onClick={() => handleSubItemClick(subItem.url)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors touch-manipulation',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      isSubActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-accent/80',
                    )}
                    aria-label={`Navigate to ${subItem.title}`}
                    aria-current={isSubActive ? 'page' : undefined}
                  >
                    <SubIcon className='h-5 w-5 shrink-0' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>{subItem.title}</span>
                    </div>
                    {isSubActive && (
                      <span className='ml-auto h-2 w-2 rounded-full bg-primary-foreground' />
                    )}
                  </button>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Profile Menu Sheet */}
      <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
        <SheetContent side='bottom' className='pb-safe'>
          <SheetHeader>
            <div className='flex flex-row items-center gap-3'>
              <div className='bg-muted text-muted-foreground flex aspect-square size-12 items-center justify-center rounded-lg shrink-0'>
                {user?.name ? (
                  <img
                    src={generateAvatarUrl(user.name, 48)}
                    alt={user.name}
                    className='size-12 rounded-lg object-cover'
                  />
                ) : (
                  <User className='size-6' />
                )}
              </div>
              <div className='flex flex-col gap-0.5 leading-none text-left'>
                <SheetTitle className='text-lg font-semibold'>{user?.name || 'User'}</SheetTitle>
                <SheetDescription className='text-sm'>
                  {collection === 'admins' ? 'Administrator' : 'User'}
                  {hasOAuth && ' • OAuth'}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className='mt-6 space-y-1'>
            <button
              onClick={handleProfileClick}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                pathname === '/app/profile'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground hover:bg-accent/80',
              )}
              aria-label='Go to Profile'
            >
              <User className='h-5 w-5 shrink-0' />
              <span className='font-medium'>Profile</span>
            </button>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'bg-accent text-accent-foreground hover:bg-accent/80',
              )}
              aria-label='Go to Billing'
            >
              <CreditCard className='h-5 w-5 shrink-0' />
              <span className='font-medium'>Billing</span>
            </button>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'bg-accent text-accent-foreground hover:bg-accent/80',
              )}
              aria-label='Go to Notifications'
            >
              <Bell className='h-5 w-5 shrink-0' />
              <span className='font-medium'>Notifications</span>
            </button>
            <div className='border-t border-border my-2' />
            <button
              onClick={handleSignOut}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'bg-accent hover:bg-accent/80 text-destructive hover:text-destructive',
              )}
              aria-label='Sign out'
            >
              <LogOut className='h-5 w-5 shrink-0' />
              <span className='font-medium'>Sign Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
