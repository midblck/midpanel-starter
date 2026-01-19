'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: Error | unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = 'An unexpected error occurred',
      } = options;

      // Extract error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : fallbackMessage;

      // Log error in development
      if (logError && process.env.NODE_ENV === 'development') {
        console.error('Error caught by useErrorHandler:', error);
      }

      // Show toast notification
      if (showToast) {
        toast.error('Something went wrong', {
          description: errorMessage,
          duration: 5000,
        });
      }

      // In production, you would send this to an error reporting service
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(error);
        console.error('Production error:', error);
      }
    },
    []
  );

  return { handleError };
}

// Hook for async operations with error handling
export function useAsyncErrorHandler() {
  const { handleError } = useErrorHandler();

  const executeWithErrorHandling = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: ErrorHandlerOptions
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, options);
        return null;
      }
    },
    [handleError]
  );

  return { executeWithErrorHandling };
}
