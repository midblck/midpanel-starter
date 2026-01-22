# logging-structured

Use structured logging instead of console.log/error/warn statements for better observability and debugging.

## Why It Matters

Structured logging provides:

- Consistent log format across the entire application
- Rich metadata and context for better debugging
- Correlation IDs for distributed tracing
- Error codes for easier issue tracking
- Environment-aware behavior (development vs production)
- Proper log levels and filtering capabilities
- Better performance monitoring and security auditing

## Incorrect Example

```typescript
// ❌ Bad: Using console.log/error directly
export async function createUser(data: UserData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await payload.create({
      collection: 'users',
      data,
    })

    console.log('User created successfully:', user.id)
    return user
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}

// ❌ Bad: Console logging in React components
;('use client')
export function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    console.log('Loading user profile for:', userId)
    // ... fetch logic
  }, [userId])

  const handleUpdate = () => {
    console.warn('Updating user profile')
    // ... update logic
  }
}

// ❌ Bad: Console logging in API routes
export async function GET(request: NextRequest) {
  try {
    console.log('Processing GET request')
    // ... logic
  } catch (error) {
    console.error('API error:', error)
  }
}
```

## Correct Example

```typescript
// ✅ CORRECT: Use structured logging with proper context
import { logInfo, logError, logDbError, logApiError } from '@/utilities/logger'

export async function createUser(data: UserData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await payload.create({
      collection: 'users',
      data,
    })

    logInfo('User created successfully', {
      component: 'UserService',
      action: 'create',
      userId: user.id,
      collection: 'users',
    })
    return user
  } catch (error) {
    logDbError('create-user', error, {
      component: 'UserService',
      action: 'create',
      userData: data,
    })
    throw error
  }
}

// ✅ CORRECT: Structured logging in React components
;('use client')
import { logInfo, logWarn } from '@/utilities/logger'

export function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    logInfo('Loading user profile', {
      component: 'UserProfile',
      action: 'load',
      userId,
    })
    // ... fetch logic
  }, [userId])

  const handleUpdate = () => {
    logWarn('User profile update initiated', {
      component: 'UserProfile',
      action: 'update',
      userId,
    })
    // ... update logic
  }
}

// ✅ CORRECT: Request-scoped logging in API routes
import { createRequestLogger, logApiError } from '@/utilities/logger'

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    requestLogger.info('Processing GET request', {
      component: 'API',
      action: 'GET /endpoint',
    })
    // ... logic
  } catch (error) {
    logApiError('/endpoint', 'GET', error, {
      component: 'API',
      action: 'GET /endpoint',
    })
  }
}

// ✅ CORRECT: Error logging with correlation IDs
export async function processPayment(orderId: string, amount: number) {
  const correlationId = createCorrelationId()

  try {
    const requestLogger = logger.child({
      correlationId,
      orderId,
      amount,
    })

    requestLogger.info('Starting payment processing', {
      component: 'PaymentService',
      action: 'process-payment',
    })

    // ... payment logic

    requestLogger.info('Payment processed successfully', {
      component: 'PaymentService',
      action: 'process-payment',
      status: 'completed',
    })
  } catch (error) {
    logger.error('Payment processing failed', error, {
      component: 'PaymentService',
      action: 'process-payment',
      correlationId,
      orderId,
      amount,
    })
    throw error
  }
}
```

## Additional Context

- **ALWAYS** use `logInfo`, `logError`, `logWarn` instead of `console.log/error/warn`
- **Use specialized loggers** for specific use cases:
  - `logApiError()` for API-related errors
  - `logDbError()` for database operations
  - `logAuthError()` for authentication issues
  - `logComponentError()` for React component errors
- **Include rich metadata** in every log entry:
  - `component`: The component/module name
  - `action`: The specific action being performed
  - `userId`: User identifier when available
  - `correlationId`: For distributed tracing
  - `requestId`: For request tracking
- **Use request-scoped loggers** in API routes: `const requestLogger = createRequestLogger()`
- **Create correlation IDs** for complex operations: `const correlationId = createCorrelationId()`
- **Child loggers** inherit context: `const childLogger = logger.child({ userId, sessionId })`
- **Environment-aware**: Logs are automatically filtered based on `NODE_ENV`
- **Performance monitoring**: Use `logPerformance()` for timing operations
- **Security events**: Use `logSecurity()` for audit trails

## Logger Methods Available

```typescript
// Basic logging
logInfo(message, metadata)
logWarn(message, metadata)
logError(message, error, metadata)

// Specialized loggers
logApiError(endpoint, method, error, metadata)
logDbError(operation, error, metadata)
logAuthError(action, error, userId)
logComponentError(componentName, error, metadata)
logBlockError(blockType, error, metadata)

// Utilities
const requestLogger = createRequestLogger(requestId, correlationId)
const correlationId = createCorrelationId()
const requestId = createRequestId()

// Child loggers with context inheritance
const childLogger = logger.child({ userId, sessionId })

// Performance monitoring
logPerformance('operation-name', durationMs, metadata)

// Security auditing
logSecurity('event-description', metadata)
```
