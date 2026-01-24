import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  PayloadRequest,
} from 'payload'

import {
  checkInjectionPatterns,
  COMMENT_LIMITS,
  validateCommentInput,
} from '@/blocks/comment-block/utils/comment-security'
import { checkRateLimit } from '@/blocks/comment-block/utils/rate-limiter'
import { logger } from '@/utilities/logger'

/**
 * Extract IP address from request headers
 */
const getIpFromRequest = (req: PayloadRequest): string => {
  const forwardedFor = req.headers?.get('x-forwarded-for')
  const realIp = req.headers?.get('x-real-ip')
  return forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || 'unknown'
}

/**
 * Check if user is admin
 */
const isAdminUser = (user: PayloadRequest['user']): boolean => {
  return user?.collection === 'admins' && user.role === 'master'
}

/**
 * BeforeValidate hook - Sanitizes and validates all input fields
 */
export const securityBeforeValidate: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  // Only apply to create operations from public API
  if (operation !== 'create') {
    return data
  }

  // Skip if user is admin (trusted)
  if (isAdminUser(req.user)) {
    return data
  }

  // Early return if data is undefined
  if (!data) {
    return data
  }

  try {
    // Validate post exists and comments are enabled
    if (data.doc) {
      const payload = req.payload
      try {
        const postDoc = await payload.findByID({
          collection: 'posts',
          id: data.doc as string,
          depth: 0,
        })

        if (!postDoc) {
          throw new Error('Invalid post ID')
        }

        // Check if comments are enabled for this post
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(postDoc as any).enableComments) {
          throw new Error('Comments are disabled for this post')
        }
      } catch (error) {
        const ip = getIpFromRequest(req)
        logger.warn('Post validation failed for comment', {
          action: 'beforeValidate',
          component: 'securityHooks',
          postId: data.doc,
          ip,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    }

    // Validate and sanitize all inputs
    const validationResult = validateCommentInput({
      comment: data.comment as string | undefined,
      doc: typeof data.doc === 'string' ? data.doc : undefined,
      email: data.email as string | undefined,
      name: data.name as string | undefined,
    })

    if (!validationResult.valid && validationResult.errors) {
      // Log suspicious activity
      const ip = getIpFromRequest(req)
      logger.warn('Comment validation failed', {
        action: 'beforeValidate',
        component: 'securityHooks',
        errors: validationResult.errors,
        ip,
      })

      // Throw validation error
      const firstError = Object.values(validationResult.errors)[0]
      throw new Error(typeof firstError === 'string' ? firstError : 'Validation failed')
    }

    // Apply sanitized values
    if (validationResult.sanitized) {
      if (validationResult.sanitized.name) {
        data.name = validationResult.sanitized.name
      }
      if (validationResult.sanitized.email) {
        data.email = validationResult.sanitized.email
      }
      if (validationResult.sanitized.comment) {
        data.comment = validationResult.sanitized.comment
      }
    }

    // Additional injection pattern check
    const fieldsToCheck = [
      { field: 'name', value: data.name },
      { field: 'email', value: data.email },
      { field: 'comment', value: data.comment },
    ]

    for (const { field, value } of fieldsToCheck) {
      if (typeof value === 'string' && checkInjectionPatterns(value)) {
        const ip = getIpFromRequest(req)
        logger.warn('Injection pattern detected', {
          action: 'beforeValidate',
          component: 'securityHooks',
          field,
          ip,
        })
        throw new Error(`Invalid content detected in ${field}`)
      }
    }

    // Rate limiting check - extract IP from headers
    const ip = getIpFromRequest(req)
    const email = (data.email as string) || ''

    if (email) {
      const rateLimitCheck = checkRateLimit(ip, email)
      if (!rateLimitCheck.allowed) {
        logger.warn('Rate limit exceeded', {
          action: 'beforeValidate',
          component: 'securityHooks',
          email,
          ip,
        })
        throw new Error(rateLimitCheck.error || 'Too many requests. Please try again later.')
      }
    }

    return data
  } catch (error) {
    // Re-throw validation errors
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Validation failed')
  }
}

/**
 * BeforeChange hook - Additional security layer and status enforcement
 */
export const securityBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  // Only apply to create operations from public API
  if (operation !== 'create') {
    return data
  }

  // Skip if user is admin (trusted)
  if (isAdminUser(req.user)) {
    return data
  }

  // Early return if data is undefined
  if (!data) {
    return data
  }

  try {
    // Enforce draft status for public users
    if (data.status && data.status !== 'draft') {
      const ip = getIpFromRequest(req)
      logger.warn('Attempted to create non-draft comment', {
        action: 'beforeChange',
        attemptedStatus: data.status,
        component: 'securityHooks',
        ip,
      })
      data.status = 'draft'
    } else if (!data.status) {
      data.status = 'draft'
    }

    // Final sanitization pass
    if (typeof data.name === 'string') {
      data.name = data.name.trim().slice(0, COMMENT_LIMITS.NAME_MAX_LENGTH)
    }

    if (typeof data.email === 'string') {
      data.email = data.email.trim().toLowerCase().slice(0, COMMENT_LIMITS.EMAIL_MAX_LENGTH)
    }

    if (typeof data.comment === 'string') {
      data.comment = data.comment.trim().slice(0, COMMENT_LIMITS.COMMENT_MAX_LENGTH)
    }

    return data
  } catch (error) {
    logger.error('Error in securityBeforeChange hook', error, {
      action: 'beforeChange',
      component: 'securityHooks',
    })
    throw error
  }
}

/**
 * AfterChange hook - Log comment creation for audit trail
 */
export const securityAfterChange: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // Only log create operations
  if (operation !== 'create') {
    return doc
  }

  try {
    const ip = getIpFromRequest(req)
    logger.info('Comment created', {
      action: 'afterChange',
      commentId: doc.id,
      component: 'securityHooks',
      email: doc.email || 'unknown',
      ip,
      status: (doc as { status?: string }).status || 'draft',
    })
  } catch (error) {
    // Don't throw - logging failure shouldn't break the operation
    logger.error('Error logging comment creation', error, {
      action: 'afterChange',
      component: 'securityHooks',
    })
  }

  return doc
}
