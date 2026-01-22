'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Bug, Copy, Home, RefreshCw } from 'lucide-react'
import { ReactNode } from 'react'
import { toast } from 'sonner'

interface ErrorFallbackProps {
  error: Error
  errorId?: string
  showDetails?: boolean
  title?: string
  description?: string
  actions?: ReactNode
}

export function ErrorFallback({
  error,
  errorId,
  showDetails = false,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  actions,
}: ErrorFallbackProps) {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleCopyError = () => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      errorId: errorId || 'N/A',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    const errorText = `Error Details:
Message: ${errorDetails.message}
Error ID: ${errorDetails.errorId}
Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
User Agent: ${errorDetails.userAgent}

Stack Trace:
${errorDetails.stack || 'No stack trace available'}`

    try {
      void navigator.clipboard.writeText(errorText)
      toast.success('Error details copied to clipboard')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = errorText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Error details copied to clipboard')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-xl'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {showDetails && process.env.NODE_ENV === 'development' && (
            <div className='rounded-md bg-muted p-3'>
              <h4 className='text-sm font-medium text-muted-foreground mb-2 flex items-center'>
                <Bug className='h-4 w-4 mr-1' />
                Error Details (Development Only)
              </h4>
              <pre className='text-xs text-muted-foreground overflow-auto max-h-32'>
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </div>
          )}

          {actions || (
            <>
              <div className='flex flex-col sm:flex-row gap-2'>
                <Button onClick={handleRetry} className='flex-1'>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Try Again
                </Button>
                <Button variant='outline' onClick={handleGoHome} className='flex-1'>
                  <Home className='h-4 w-4 mr-2' />
                  Go Home
                </Button>
              </div>

              <div className='flex justify-center'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleCopyError}
                  className='text-muted-foreground hover:text-foreground'
                >
                  <Copy className='h-4 w-4 mr-2' />
                  Copy Error Details
                </Button>
              </div>
            </>
          )}

          {errorId && (
            <div className='text-center text-xs text-muted-foreground'>Error ID: {errorId}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Specific error fallbacks for different scenarios
export function KanbanErrorFallback({ error }: { error: Error }) {
  return (
    <ErrorFallback
      error={error}
      title='Kanban Board Error'
      description='Failed to load the kanban board. This might be due to a network issue or server problem.'
      showDetails={true}
    />
  )
}

export function DashboardErrorFallback({ error }: { error: Error }) {
  return (
    <ErrorFallback
      error={error}
      title='Dashboard Error'
      description='Failed to load dashboard data. Please check your connection and try again.'
      showDetails={true}
    />
  )
}

export function TaskListErrorFallback({ error }: { error: Error }) {
  return (
    <ErrorFallback
      error={error}
      title='Task List Error'
      description='Failed to load the task list. This might be due to a data loading issue.'
      showDetails={true}
    />
  )
}

export function ProfileErrorFallback({ error }: { error: Error }) {
  return (
    <ErrorFallback
      error={error}
      title='Profile Error'
      description='Failed to load profile information. Please try refreshing the page.'
      showDetails={true}
    />
  )
}

// Inline error fallback for smaller components
export function InlineErrorFallback({
  title = 'Error',
  description = 'Something went wrong',
}: {
  title?: string
  description?: string
}) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className='flex flex-col items-center justify-center p-6 text-center'>
      <div className='mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10'>
        <AlertTriangle className='h-4 w-4 text-destructive' />
      </div>
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      <p className='text-sm text-muted-foreground mb-4'>{description}</p>
      <Button onClick={handleRetry} size='sm'>
        <RefreshCw className='h-4 w-4 mr-2' />
        Try Again
      </Button>
    </div>
  )
}
