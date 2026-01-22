# Error Boundary System

A comprehensive error boundary system for handling React errors gracefully throughout the application.

## Components

### ErrorBoundary

The main error boundary component that catches JavaScript errors anywhere in the child component tree.

```tsx
import { ErrorBoundary } from '@/components/error-boundary'
;<ErrorBoundary fallback={<CustomFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Error Fallbacks

Pre-built error fallback components for different scenarios:

- `ErrorFallback` - Generic error fallback
- `KanbanErrorFallback` - Specific to kanban board errors
- `DashboardErrorFallback` - Specific to dashboard errors
- `TaskListErrorFallback` - Specific to task list errors
- `ProfileErrorFallback` - Specific to profile errors
- `InlineErrorFallback` - Compact error fallback for smaller components

### ErrorProvider

Context provider for managing error state across the application.

```tsx
import { ErrorProvider } from '@/components/error-boundary'
;<ErrorProvider>
  <App />
</ErrorProvider>
```

## Hooks

### useErrorHandler

Hook for manually triggering errors and handling them consistently.

```tsx
import { useErrorHandler } from '@/hooks/use-error-handler'

const { handleError } = useErrorHandler()

// Handle an error
handleError(new Error('Something went wrong'))
```

### useAsyncErrorHandler

Hook for handling async operations with automatic error handling.

```tsx
import { useAsyncErrorHandler } from '@/hooks/use-error-handler'

const { executeWithErrorHandling } = useAsyncErrorHandler()

// Execute async operation with error handling
const result = await executeWithErrorHandling(async () => {
  return await fetchData()
})
```

## Usage Examples

### Basic Error Boundary

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components/error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error('App failed')} />}>
      <YourApp />
    </ErrorBoundary>
  )
}
```

### Specific Error Fallback

```tsx
import { ErrorBoundary, KanbanErrorFallback } from '@/components/error-boundary'

function KanbanPage() {
  return (
    <ErrorBoundary fallback={<KanbanErrorFallback error={new Error('Kanban failed')} />}>
      <KanbanBoard />
    </ErrorBoundary>
  )
}
```

### Inline Error Handling

```tsx
import { InlineErrorFallback } from '@/components/error-boundary'

function ComponentWithError() {
  const [error, setError] = useState(null)

  if (error) {
    return (
      <InlineErrorFallback
        error={error}
        title='Component Error'
        description='This component failed to load'
      />
    )
  }

  return <div>Your component content</div>
}
```

### Error Context Usage

```tsx
import { useErrorContext, useErrorHandler } from '@/components/error-boundary'

function MyComponent() {
  const { error, clearError } = useErrorContext()
  const triggerError = useErrorHandler()

  const handleClick = () => {
    triggerError(new Error('Manual error'))
  }

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleClick}>Trigger Error</button>
      <button onClick={clearError}>Clear Error</button>
    </div>
  )
}
```

## Features

- **Automatic Error Catching**: Catches JavaScript errors anywhere in the component tree
- **Custom Fallback UI**: Provides customizable error fallback components
- **Error Logging**: Logs errors to console in development and external services in production
- **Toast Notifications**: Shows user-friendly error messages
- **Error Recovery**: Provides retry and reset functionality
- **Context Management**: Global error state management
- **TypeScript Support**: Full TypeScript support with proper typing
- **Development Tools**: Error details shown in development mode

## Error Reporting

In production, errors are automatically logged and can be sent to external error reporting services like Sentry, LogRocket, or Bugsnag. The error boundary includes:

- Error message and stack trace
- Component stack trace
- Unique error ID for tracking
- User agent and URL information
- Timestamp

## Testing

To test error boundary functionality, you can create a simple test component that throws errors:

```tsx
function TestErrorComponent() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('Test error for error boundary')
  }

  return (
    <div>
      <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
    </div>
  )
}
```

## Best Practices

1. **Wrap Key Components**: Wrap major sections of your app with error boundaries
2. **Use Specific Fallbacks**: Use specific error fallbacks for different features
3. **Provide Recovery Options**: Always provide ways for users to recover from errors
4. **Log Errors**: Ensure errors are properly logged for debugging
5. **Test Error Scenarios**: Test your error boundaries by creating components that throw errors
6. **Keep Fallbacks Simple**: Keep error fallback UI simple and user-friendly
