/**
 * Rate limiting utility for comment submissions
 * Tracks requests by IP address and email to prevent spam/DoS attacks
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory storage for rate limits
// In production, consider using Redis for distributed systems
const ipRateLimitMap = new Map<string, RateLimitEntry>()
const emailRateLimitMap = new Map<string, RateLimitEntry>()

// Configuration
const RATE_LIMIT_CONFIG = {
  // 3 comments per hour per email
  EMAIL_MAX_REQUESTS: 3,
  EMAIL_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  // 5 comments per 15 minutes per IP
  IP_MAX_REQUESTS: 5,
  IP_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
} as const

/**
 * Cleans up expired rate limit entries
 */
const cleanupExpiredEntries = (map: Map<string, RateLimitEntry>): void => {
  const now = Date.now()
  for (const [key, entry] of map.entries()) {
    if (entry.resetTime < now) {
      map.delete(key)
    }
  }
}

/**
 * Checks rate limit for IP address
 */
export const checkIPRateLimit = (
  ip: string,
): { allowed: boolean; error?: string; retryAfter?: number } => {
  if (!ip || typeof ip !== 'string') {
    return { allowed: false, error: 'Invalid IP address' }
  }

  cleanupExpiredEntries(ipRateLimitMap)

  const now = Date.now()
  const entry = ipRateLimitMap.get(ip)

  if (!entry) {
    // First request from this IP
    ipRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.IP_WINDOW_MS,
    })
    return { allowed: true }
  }

  // Check if window has expired
  if (entry.resetTime < now) {
    // Reset the counter
    ipRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.IP_WINDOW_MS,
    })
    return { allowed: true }
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.IP_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000) // seconds
    return {
      allowed: false,
      error: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      retryAfter,
    }
  }

  // Increment counter
  entry.count++
  ipRateLimitMap.set(ip, entry)

  return { allowed: true }
}

/**
 * Checks rate limit for email address
 */
export const checkEmailRateLimit = (
  email: string,
): { allowed: boolean; error?: string; retryAfter?: number } => {
  if (!email || typeof email !== 'string') {
    return { allowed: false, error: 'Invalid email address' }
  }

  // Normalize email (lowercase)
  const normalizedEmail = email.trim().toLowerCase()

  cleanupExpiredEntries(emailRateLimitMap)

  const now = Date.now()
  const entry = emailRateLimitMap.get(normalizedEmail)

  if (!entry) {
    // First request from this email
    emailRateLimitMap.set(normalizedEmail, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.EMAIL_WINDOW_MS,
    })
    return { allowed: true }
  }

  // Check if window has expired
  if (entry.resetTime < now) {
    // Reset the counter
    emailRateLimitMap.set(normalizedEmail, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.EMAIL_WINDOW_MS,
    })
    return { allowed: true }
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.EMAIL_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000) // seconds
    return {
      allowed: false,
      error: `Too many comments from this email. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      retryAfter,
    }
  }

  // Increment counter
  entry.count++
  emailRateLimitMap.set(normalizedEmail, entry)

  return { allowed: true }
}

/**
 * Checks both IP and email rate limits
 */
export const checkRateLimit = (
  ip: string,
  email: string,
): { allowed: boolean; error?: string; retryAfter?: number } => {
  // Check IP rate limit
  const ipCheck = checkIPRateLimit(ip)
  if (!ipCheck.allowed) {
    return ipCheck
  }

  // Check email rate limit
  const emailCheck = checkEmailRateLimit(email)
  if (!emailCheck.allowed) {
    return emailCheck
  }

  return { allowed: true }
}

/**
 * Resets rate limit for an IP address (admin function)
 */
export const resetIPRateLimit = (ip: string): void => {
  if (ip && typeof ip === 'string') {
    ipRateLimitMap.delete(ip)
  }
}

/**
 * Resets rate limit for an email address (admin function)
 */
export const resetEmailRateLimit = (email: string): void => {
  if (email && typeof email === 'string') {
    emailRateLimitMap.delete(email.trim().toLowerCase())
  }
}

/**
 * Gets current rate limit status for an IP
 */
export const getIPRateLimitStatus = (
  ip: string,
): { count: number; resetTime: number; limit: number } | null => {
  if (!ip || typeof ip !== 'string') {
    return null
  }

  const entry = ipRateLimitMap.get(ip)
  if (!entry) {
    return null
  }

  return {
    count: entry.count,
    limit: RATE_LIMIT_CONFIG.IP_MAX_REQUESTS,
    resetTime: entry.resetTime,
  }
}

/**
 * Gets current rate limit status for an email
 */
export const getEmailRateLimitStatus = (
  email: string,
): { count: number; resetTime: number; limit: number } | null => {
  if (!email || typeof email !== 'string') {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()
  const entry = emailRateLimitMap.get(normalizedEmail)
  if (!entry) {
    return null
  }

  return {
    count: entry.count,
    limit: RATE_LIMIT_CONFIG.EMAIL_MAX_REQUESTS,
    resetTime: entry.resetTime,
  }
}

// Export configuration
export { RATE_LIMIT_CONFIG }
