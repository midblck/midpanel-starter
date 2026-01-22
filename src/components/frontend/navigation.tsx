import { LogOut, User, LayoutDashboard } from 'lucide-react'

import { Branding } from '@/components/branding'
import { logAuthError } from '@/utilities/logger'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { generateAvatarUrl } from '@/lib/avatar'

interface NavigationProps {
  user?: {
    email?: string
  } | null
}

async function handleLogout() {
  try {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collection: 'users' }),
    })

    if (response.ok) {
      // Redirect to home page after successful logout
      window.location.href = '/'
    } else {
      logAuthError('logout', new Error('Logout failed - response not ok'))
    }
  } catch (error) {
    logAuthError('logout', error)
  }
}

export function Navigation({ user }: NavigationProps) {
  return (
    <nav className='border-b'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Branding variant='icon' size='md' />
          <div className='flex items-center space-x-4'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={generateAvatarUrl(user.email || 'User')}
                        alt={user.email || 'User'}
                      />
                      <AvatarFallback className='text-xs'>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-sm text-muted-foreground'>Welcome back</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem asChild>
                    <a href='/app' className='flex items-center'>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      Dashboard
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href='/app/profile' className='flex items-center'>
                      <User className='mr-2 h-4 w-4' />
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='flex items-center text-red-600 focus:text-red-600'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant='outline' size='sm' asChild>
                <a href='/auth/sign-in'>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
