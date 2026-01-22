// Main error boundary components
export {
  ErrorBoundary,
  useErrorHandler as useErrorBoundaryHandler,
  withErrorBoundary,
} from './error-boundary'

// Error fallback components
export {
  DashboardErrorFallback,
  ErrorFallback,
  InlineErrorFallback,
  KanbanErrorFallback,
  ProfileErrorFallback,
  TaskListErrorFallback,
} from './error-fallback'

// Error provider and context
export { ErrorProvider, useErrorClear, useErrorContext, useErrorHandler } from './error-provider'
