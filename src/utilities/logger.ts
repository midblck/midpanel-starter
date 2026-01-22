/**
 * Structured Logger Utility using Pino
 * Provides consistent logging across server and client with environment-aware behavior
 */

import pino from 'pino'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogMetadata {
  timestamp?: string
  context?: string
  userId?: string
  requestId?: string
  correlationId?: string
  component?: string
  action?: string
  [key: string]: unknown
}

export interface ErrorContext {
  errorCode: string
  correlationId?: string
  component?: string
  action?: string
  userId?: string
  metadata?: Record<string, unknown>
}

// Determine if we're in development
const isDevelopment = process.env.NODE_ENV === 'development'
const isServer = typeof window === 'undefined'

// pino-pretty has been removed to avoid worker thread issues on Windows with pnpm
// pino-pretty uses thread-stream which can fail due to symlink resolution issues
// The logger works perfectly in JSON format, which is the standard for production
// If you need pretty logging, install pino-pretty and set ENABLE_PINO_PRETTY=true
const enablePrettyTransport = false // Always false since pino-pretty is not installed

// Create pino logger instance
// Note: pino-pretty has been removed to prevent "Cannot find module thread-stream" errors
// on Windows with pnpm. Logs work in JSON format, which is production-ready.
const pinoLogger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport:
    isDevelopment && isServer && enablePrettyTransport
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV,
    context: isServer ? 'server' : 'client',
  },
})

class Logger {
  private logger: pino.Logger

  constructor() {
    this.logger = pinoLogger
  }

  /**
   * Generate unique error code for tracking
   */
  private generateErrorCode(): string {
    const timestamp = Date.now().toString(36).padStart(8, '0')
    const random = Math.random().toString(36).substring(2, 6)
    const processId = process.pid.toString(36).padStart(4, '0')
    return `ERR-${timestamp}-${random}-${processId}`.toUpperCase()
  }

  /**
   * Generate unique request ID for tracing
   */
  generateRequestId(): string {
    const timestamp = Date.now().toString(36).padStart(8, '0')
    const random = Math.random().toString(36).substring(2, 8)
    return `REQ-${timestamp}-${random}`.toUpperCase()
  }

  /**
   * Generate correlation ID for distributed tracing
   */
  generateCorrelationId(): string {
    const timestamp = Date.now().toString(36).padStart(8, '0')
    const random = Math.random().toString(36).substring(2, 8)
    const processId = process.pid.toString(36).padStart(4, '0')
    return `CORR-${timestamp}-${random}-${processId}`.toUpperCase()
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (!isDevelopment) return
    this.logger.debug({ ...metadata }, message)
  }

  /**
   * Log info messages
   */
  info(message: string, metadata?: LogMetadata): void {
    this.logger.info({ ...metadata }, message)
  }

  /**
   * Log warning messages
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn({ ...metadata }, message)
  }

  /**
   * Create a child logger with persistent context
   */
  child(bindings: LogMetadata): Logger {
    const childLogger = new Logger()
    childLogger.logger = this.logger.child(bindings)
    return childLogger
  }

  /**
   * Log error messages with error code generation
   */
  error(message: string, error?: Error | unknown, metadata?: LogMetadata): ErrorContext {
    const errorCode = this.generateErrorCode()
    const correlationId = metadata?.correlationId || this.generateCorrelationId()

    const errorContext: ErrorContext = {
      errorCode,
      correlationId,
      component: metadata?.component,
      action: metadata?.action,
      userId: metadata?.userId,
      metadata: {
        ...metadata,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
    }

    this.logger.error(
      {
        ...metadata,
        errorCode,
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      message
    )

    return errorContext
  }

  /**
   * Create a request-scoped logger with correlation ID
   */
  createRequestLogger(requestId?: string, correlationId?: string): Logger {
    const reqId = requestId || this.generateRequestId()
    const corrId = correlationId || this.generateCorrelationId()

    return this.child({
      requestId: reqId,
      correlationId: corrId,
    })
  }

  /**
   * Log API errors with standardized format
   */
  apiError(
    endpoint: string,
    method: string,
    error: Error | unknown,
    metadata?: LogMetadata
  ): ErrorContext {
    const correlationId = metadata?.correlationId || this.generateCorrelationId()

    return this.error(`API Error: ${method} ${endpoint}`, error, {
      ...metadata,
      correlationId,
      component: 'API',
      action: `${method} ${endpoint}`,
    })
  }

  /**
   * Log authentication errors
   */
  authError(action: string, error: Error | unknown, userId?: string): ErrorContext {
    return this.error(`Auth Error: ${action}`, error, {
      component: 'Auth',
      action,
      userId,
    })
  }

  /**
   * Log database errors
   */
  dbError(operation: string, error: Error | unknown, metadata?: LogMetadata): ErrorContext {
    return this.error(`Database Error: ${operation}`, error, {
      ...metadata,
      component: 'Database',
      action: operation,
    })
  }

  /**
   * Log component errors
   */
  componentError(
    componentName: string,
    error: Error | unknown,
    metadata?: LogMetadata
  ): ErrorContext {
    return this.error(`Component Error: ${componentName}`, error, {
      ...metadata,
      component: componentName,
      action: 'render',
    })
  }

  /**
   * Log block errors
   */
  blockError(blockType: string, error: Error | unknown, metadata?: LogMetadata): ErrorContext {
    return this.error(`Block Error: ${blockType}`, error, {
      ...metadata,
      component: 'Block',
      action: `render-${blockType}`,
    })
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, metadata?: LogMetadata): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      ...metadata,
      component: 'Performance',
      action: operation,
      duration,
    })
  }

  /**
   * Log security events
   */
  security(event: string, metadata?: LogMetadata): void {
    this.warn(`Security: ${event}`, {
      ...metadata,
      component: 'Security',
      action: event,
    })
  }
}

// Create singleton instance
export const logger = new Logger()

// Export convenience functions
export const logDebug = (message: string, metadata?: LogMetadata) => logger.debug(message, metadata)
export const logInfo = (message: string, metadata?: LogMetadata) => logger.info(message, metadata)
export const logWarn = (message: string, metadata?: LogMetadata) => logger.warn(message, metadata)
export const logError = (message: string, error?: Error | unknown, metadata?: LogMetadata) =>
  logger.error(message, error, metadata)

export const logApiError = (
  endpoint: string,
  method: string,
  error: Error | unknown,
  metadata?: LogMetadata
) => logger.apiError(endpoint, method, error, metadata)

export const logAuthError = (action: string, error: Error | unknown, userId?: string) =>
  logger.authError(action, error, userId)

export const logDbError = (operation: string, error: Error | unknown, metadata?: LogMetadata) =>
  logger.dbError(operation, error, metadata)

export const logComponentError = (
  componentName: string,
  error: Error | unknown,
  metadata?: LogMetadata
) => logger.componentError(componentName, error, metadata)

export const logBlockError = (blockType: string, error: Error | unknown, metadata?: LogMetadata) =>
  logger.blockError(blockType, error, metadata)

export const logPerformance = (operation: string, duration: number, metadata?: LogMetadata) =>
  logger.performance(operation, duration, metadata)

export const logSecurity = (event: string, metadata?: LogMetadata) =>
  logger.security(event, metadata)

// Additional convenience functions
export const createRequestLogger = (requestId?: string, correlationId?: string) =>
  logger.createRequestLogger(requestId, correlationId)

export const createCorrelationId = () => logger.generateCorrelationId()
export const createRequestId = () => logger.generateRequestId()
