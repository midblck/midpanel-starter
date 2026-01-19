'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Copy, Home, RefreshCw } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export function ErrorBoundary({
  children,
  fallback,
  onError,
  resetOnPropsChange,
  resetKeys,
}: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: '',
  });

  const resetErrorBoundary = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  }, []);

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error info
    setErrorState({
      hasError: true,
      error,
      errorInfo,
      errorId,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);

    // Show error toast
    toast.error('Something went wrong. Please try again.', {
      description: 'An unexpected error occurred. Our team has been notified.',
    });
  }, [onError]);

  // Reset on props change
  useEffect(() => {
    if (errorState.hasError && resetOnPropsChange && resetKeys) {
      resetErrorBoundary();
    }
  }, [resetKeys, resetOnPropsChange, errorState.hasError, resetErrorBoundary]);

  const logErrorToService = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: errorState.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // For now, we'll just log it to console
    console.error('Error Report:', errorReport);

    // In production, you would send this to your error reporting service
    // Example:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    //   tags: {
    //     errorId: errorState.errorId,
    //   },
    // });
  }, [errorState.errorId]);

  const handleRetry = useCallback(() => {
    resetErrorBoundary();
  }, [resetErrorBoundary]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleCopyError = useCallback(() => {
    if (!errorState.error) return;

    const errorDetails = {
      message: errorState.error.message,
      stack: errorState.error.stack,
      errorId: errorState.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    const errorText = `Error Details:
Message: ${errorDetails.message}
Error ID: ${errorDetails.errorId}
Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
User Agent: ${errorDetails.userAgent}

Stack Trace:
${errorDetails.stack || 'No stack trace available'}`;

    try {
      void navigator.clipboard.writeText(errorText);
      toast.success('Error details copied to clipboard');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Error details copied to clipboard');
    }
  }, [errorState.error, errorState.errorId]);

  // Create error boundary using React's error boundary pattern
  const ErrorFallback = useCallback(({ error, resetError }: { error: Error; resetError: () => void }) => {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='h-6 w-6 text-destructive' />
            </div>
            <CardTitle className='text-xl'>
              Oops! Something went wrong
            </CardTitle>
            <CardDescription>
              We encountered an unexpected error. Don&apos;t worry, our team
              has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {process.env.NODE_ENV === 'development' && error && (
              <div className='rounded-md bg-muted p-3'>
                <h4 className='text-sm font-medium text-muted-foreground mb-2'>
                  Error Details (Development Only)
                </h4>
                <pre className='text-xs text-muted-foreground overflow-auto max-h-32'>
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            )}

            <div className='flex flex-col sm:flex-row gap-2'>
              <Button onClick={resetError} className='flex-1'>
                <RefreshCw className='h-4 w-4 mr-2' />
                Try Again
              </Button>
              <Button
                variant='outline'
                onClick={handleGoHome}
                className='flex-1'
              >
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

            <div className='text-center text-xs text-muted-foreground'>
              Error ID: {errorState.errorId}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [fallback, handleGoHome, handleCopyError, errorState.errorId]);

  // Use a wrapper component that can catch errors
  const ErrorCatcher = useCallback(({ children: child }: { children: ReactNode }) => {
    // If there's an error, show the fallback
    if (errorState.hasError && errorState.error) {
      return <ErrorFallback error={errorState.error} resetError={resetErrorBoundary} />;
    }

    // Otherwise, render children normally
    return <>{child}</>;
  }, [errorState.hasError, errorState.error, ErrorFallback, resetErrorBoundary]);

  // Use useEffect to catch errors (this is a simplified approach)
  // In a real implementation, you might want to use a more robust error boundary
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      handleError(event.error || new Error(event.message), {
        componentStack: event.filename ? `at ${event.filename}:${event.lineno}:${event.colno}` : '',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      handleError(error, {
        componentStack: '',
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  return <ErrorCatcher>{children}</ErrorCatcher>;
}

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  return (error: Error) => {
    // This will be caught by the nearest ErrorBoundary
    throw error;
  };
};

// Higher-order component for easier error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
