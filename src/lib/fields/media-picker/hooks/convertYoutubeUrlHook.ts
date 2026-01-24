import type { FieldHook } from 'payload'

import { logger } from '@/utilities/logger'
import {
  convertYoutubeUrl,
  validateYoutubeUrl as validateYoutubeUrlUtil,
} from '@/utilities/url-conversion'

/**
 * Hook to convert YouTube URLs to embed format before saving
 * Now uses shared conversion utilities
 */
export const convertYoutubeUrlHook: FieldHook = async ({ value }) => {
  // Only process if we have a value and it's a string
  if (!value || typeof value !== 'string') {
    return value
  }

  try {
    return convertYoutubeUrl(value)
  } catch (error) {
    logger.error('Failed to convert YouTube URL', error, {
      action: 'convertYoutubeUrl',
      component: 'ConvertYoutubeUrl',
      value,
    })
    // Return original value if conversion fails
    return value
  }
}

/**
 * Validates YouTube URL format
 * Returns error message if invalid, true if valid
 * Now uses shared validation utilities
 */
export const validateYoutubeUrl = (youtubeUrl: string): string | true => {
  return validateYoutubeUrlUtil(youtubeUrl)
}
