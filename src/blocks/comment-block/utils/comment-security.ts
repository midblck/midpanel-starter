/**
 * Security utilities for comment block
 * Provides input sanitization, validation, and security checks
 */

// Validation constants
const NAME_MIN_LENGTH = 1
const NAME_MAX_LENGTH = 100
const EMAIL_MAX_LENGTH = 255
const COMMENT_MIN_LENGTH = 1
const COMMENT_MAX_LENGTH = 5000

// Dangerous patterns for injection attacks
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
  /(--|#|\/\*|\*\/|;)/g,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
]

const NOSQL_INJECTION_PATTERNS = [
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$gte/gi,
  /\$lte/gi,
  /\$in/gi,
  /\$nin/gi,
  /\$regex/gi,
  /\$exists/gi,
  /\$elemMatch/gi,
  /\$or/gi,
  /\$and/gi,
  /\$not/gi,
  /\$nor/gi,
  /\{\s*\$[a-z]+/gi,
]

const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<img[^>]*onerror/gi,
  /<svg[^>]*onload/gi,
]

/**
 * Sanitizes input by removing HTML tags and dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')

  // Normalize whitespace (preserve single spaces, newlines, and tabs)
  sanitized = sanitized.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')

  // Trim
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Validates and sanitizes comment name field
 */
export const validateName = (
  name: string,
): { valid: boolean; error?: string; sanitized?: string } => {
  if (!name || typeof name !== 'string') {
    return { error: 'Name is required', valid: false }
  }

  const sanitized = sanitizeInput(name)

  if (sanitized.length < NAME_MIN_LENGTH) {
    return { error: `Name must be at least ${NAME_MIN_LENGTH} character long`, valid: false }
  }

  if (sanitized.length > NAME_MAX_LENGTH) {
    return { error: `Name must not exceed ${NAME_MAX_LENGTH} characters`, valid: false }
  }

  // Check for injection patterns
  for (const pattern of [...SQL_INJECTION_PATTERNS, ...NOSQL_INJECTION_PATTERNS, ...XSS_PATTERNS]) {
    if (pattern.test(sanitized)) {
      return { error: 'Name contains invalid characters', valid: false }
    }
  }

  // Allow alphanumeric, spaces, and basic punctuation
  const namePattern = /^[a-zA-Z0-9\s.,'\-()]+$/
  if (!namePattern.test(sanitized)) {
    return { error: 'Name contains invalid characters', valid: false }
  }

  return { sanitized, valid: true }
}

/**
 * Validates and sanitizes email field
 */
export const validateEmail = (
  email: string,
): { valid: boolean; error?: string; sanitized?: string } => {
  if (!email || typeof email !== 'string') {
    return { error: 'Email is required', valid: false }
  }

  const sanitized = email.trim().toLowerCase()

  if (sanitized.length > EMAIL_MAX_LENGTH) {
    return { error: `Email must not exceed ${EMAIL_MAX_LENGTH} characters`, valid: false }
  }

  // Strict email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(sanitized)) {
    return { error: 'Please enter a valid email address', valid: false }
  }

  // Check for injection patterns
  for (const pattern of [...SQL_INJECTION_PATTERNS, ...NOSQL_INJECTION_PATTERNS, ...XSS_PATTERNS]) {
    if (pattern.test(sanitized)) {
      return { error: 'Email contains invalid characters', valid: false }
    }
  }

  return { sanitized, valid: true }
}

/**
 * Validates and sanitizes comment content field
 */
export const validateComment = (
  comment: string,
): { valid: boolean; error?: string; sanitized?: string } => {
  if (!comment || typeof comment !== 'string') {
    return { error: 'Comment is required', valid: false }
  }

  const sanitized = sanitizeInput(comment)

  if (sanitized.length < COMMENT_MIN_LENGTH) {
    return { error: `Comment must be at least ${COMMENT_MIN_LENGTH} character long`, valid: false }
  }

  if (sanitized.length > COMMENT_MAX_LENGTH) {
    return { error: `Comment must not exceed ${COMMENT_MAX_LENGTH} characters`, valid: false }
  }

  // Check for injection patterns
  for (const pattern of [...SQL_INJECTION_PATTERNS, ...NOSQL_INJECTION_PATTERNS, ...XSS_PATTERNS]) {
    if (pattern.test(sanitized)) {
      return { error: 'Comment contains invalid content', valid: false }
    }
  }

  return { sanitized, valid: true }
}

/**
 * Validates document ID format (MongoDB ObjectId or UUID)
 * Supports both MongoDB ObjectId (24 hex chars) and UUID v4 formats
 */
export const validateDocID = (docID: string): { valid: boolean; error?: string } => {
  if (!docID || typeof docID !== 'string') {
    return { error: 'Document ID is required', valid: false }
  }

  // MongoDB ObjectId pattern (24 hexadecimal characters)
  const mongoObjectIdPattern = /^[0-9a-f]{24}$/i
  // UUID v4 pattern (for compatibility with other database adapters)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!mongoObjectIdPattern.test(docID) && !uuidPattern.test(docID)) {
    return { error: 'Invalid document ID format', valid: false }
  }

  return { valid: true }
}

/**
 * Comprehensive validation for all comment input fields
 */
export const validateCommentInput = (data: {
  name?: string
  email?: string
  comment?: string
  doc?: string
}): { valid: boolean; errors?: Record<string, string>; sanitized?: Record<string, string> } => {
  const errors: Record<string, string> = {}
  const sanitized: Record<string, string> = {}

  // Validate name
  if (data.name !== undefined) {
    const nameResult = validateName(data.name)
    if (!nameResult.valid) {
      errors.name = nameResult.error || 'Invalid name'
    } else if (nameResult.sanitized) {
      sanitized.name = nameResult.sanitized
    }
  }

  // Validate email
  if (data.email !== undefined) {
    const emailResult = validateEmail(data.email)
    if (!emailResult.valid) {
      errors.email = emailResult.error || 'Invalid email'
    } else if (emailResult.sanitized) {
      sanitized.email = emailResult.sanitized
    }
  }

  // Validate comment
  if (data.comment !== undefined) {
    const commentResult = validateComment(data.comment)
    if (!commentResult.valid) {
      errors.comment = commentResult.error || 'Invalid comment'
    } else if (commentResult.sanitized) {
      sanitized.comment = commentResult.sanitized
    }
  }

  // Validate doc ID
  if (data.doc !== undefined) {
    const docResult = validateDocID(data.doc)
    if (!docResult.valid) {
      errors.doc = docResult.error || 'Invalid document ID'
    }
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    sanitized: Object.keys(sanitized).length > 0 ? sanitized : undefined,
    valid: Object.keys(errors).length === 0,
  }
}

/**
 * Checks if input contains suspicious patterns
 */
export const checkInjectionPatterns = (input: string): boolean => {
  if (typeof input !== 'string') {
    return false
  }

  const allPatterns = [...SQL_INJECTION_PATTERNS, ...NOSQL_INJECTION_PATTERNS, ...XSS_PATTERNS]

  for (const pattern of allPatterns) {
    if (pattern.test(input)) {
      return true
    }
  }

  return false
}

/**
 * Sanitizes HTML content (for display purposes)
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') {
    return ''
  }

  // Remove all HTML tags
  let sanitized = html.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')

  return sanitized.trim()
}

/**
 * Checks content length against limits
 */
export const checkContentLength = (
  content: string,
  minLength: number,
  maxLength: number,
): { valid: boolean; error?: string } => {
  if (typeof content !== 'string') {
    return { error: 'Content must be a string', valid: false }
  }

  const length = content.length

  if (length < minLength) {
    return { error: `Content must be at least ${minLength} characters long`, valid: false }
  }

  if (length > maxLength) {
    return { error: `Content must not exceed ${maxLength} characters`, valid: false }
  }

  return { valid: true }
}

// Export constants for use in other modules
export const COMMENT_LIMITS = {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
} as const
