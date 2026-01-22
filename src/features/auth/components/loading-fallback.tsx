import { Icon } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md mx-4'>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center space-y-6'>
            {/* Logo/Icon */}
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <Icon name='logo' size='xl' className='text-primary' />
            </div>

            {/* Loading text */}
            <div className='text-center space-y-2'>
              <h2 className='text-lg font-semibold text-foreground'>Loading...</h2>
              <p className='text-sm text-muted-foreground'>
                Please wait while we verify your access
              </p>
            </div>

            {/* Loading animation */}
            <div className='flex space-x-2'>
              <Skeleton className='w-2 h-2 rounded-full' />
              <Skeleton className='w-2 h-2 rounded-full' />
              <Skeleton className='w-2 h-2 rounded-full' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
