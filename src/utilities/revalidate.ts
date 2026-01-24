import { logger } from '@/utilities/logger'

// Conditionally import server-only functions to avoid client-side import issues
let revalidatePath: ((path: string, type?: 'page' | 'layout') => void) | undefined
let revalidateTag: ((tag: string, profile: string) => void) | undefined

// Only import server functions when running on server
if (typeof window === 'undefined') {
  import('next/cache')
    .then(cache => {
      revalidatePath = cache.revalidatePath
      revalidateTag = cache.revalidateTag
    })
    .catch(() => {
      // Handle import error gracefully - silently fail as this is expected in client-side environments
    })
}

/**
 * Utility function to trigger Next.js cache revalidation
 * Uses direct Next.js cache functions instead of HTTP requests to avoid timeouts
 * Safe to import in client components - server functions are only loaded on server
 */
export const triggerRevalidation = async (path?: string, tag?: string) => {
  try {
    // Only run on server-side
    if (typeof window !== 'undefined' || !revalidatePath || !revalidateTag) {
      return
    }

    // Use direct Next.js cache functions instead of HTTP requests
    if (path) {
      revalidatePath(path, 'page')
    }

    if (tag) {
      // Next.js 16 requires a second parameter (profile)
      revalidateTag(tag, 'max')
    }

    // Always revalidate pages-sitemap tag
    revalidateTag('pages-sitemap', 'max')

    // Only log in development to reduce production log noise
    if (process.env.NODE_ENV === 'development') {
      logger.info('Revalidation successful', {
        component: 'Revalidate',
        action: 'triggerRevalidation',
        path,
        tag,
      })
    }
  } catch (error) {
    // Log the error but don't throw to prevent breaking the application
    logger.warn('Revalidation failed', {
      component: 'Revalidate',
      action: 'triggerRevalidation',
      path,
      tag,
    })

    // In development, you might want to see the full error
    if (process.env.NODE_ENV === 'development') {
      logger.error('Full revalidation error', error, {
        component: 'Revalidate',
        action: 'triggerRevalidation',
        path,
        tag,
      })
    }
  }
}
