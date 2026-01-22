'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { ErrorBoundary } from './error-boundary'

interface ErrorContextType {
  error: Error | null

  setError: (error: Error | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider')
  }
  return context
}

interface ErrorProviderProps {
  children: ReactNode
  fallback?: ReactNode

  onError?: (err: Error, errInfo: React.ErrorInfo) => void
}

export function ErrorProvider({ children, fallback, onError }: ErrorProviderProps) {
  const [error, setError] = useState<Error | null>(null)

  const clearError = () => {
    setError(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: Error, errorInfo: any) => {
    setError(error)
    onError?.(error, errorInfo)
  }

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      <ErrorBoundary fallback={fallback} onError={handleError}>
        {children}
      </ErrorBoundary>
    </ErrorContext.Provider>
  )
}

// Hook for manually triggering errors
export function useErrorHandler() {
  const { setError } = useErrorContext()

  return (error: Error) => {
    setError(error)
  }
}

// Hook for clearing errors
export function useErrorClear() {
  const { clearError } = useErrorContext()

  return clearError
}
