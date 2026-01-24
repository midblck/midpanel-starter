/**
 * URL conversion utilities for media processing
 */

/**
 * Converts YouTube URLs to embed format
 * Supports various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 */
export function convertYoutubeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided')
  }

  // Extract video ID from various YouTube URL formats
  let videoId = ''

  // youtu.be format
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (youtuBeMatch) {
    videoId = youtuBeMatch[1]
  }

  // youtube.com/watch format
  if (!videoId) {
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    if (watchMatch) {
      videoId = watchMatch[1]
    }
  }

  // youtube.com/embed format (already embed)
  if (!videoId) {
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) {
      videoId = embedMatch[1]
    }
  }

  if (!videoId) {
    throw new Error('Invalid YouTube URL format')
  }

  // Return embed URL
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Validates YouTube URL format
 * Returns true if valid, error message string if invalid
 */
export function validateYoutubeUrl(url: string): string | true {
  if (!url || typeof url !== 'string') {
    return 'URL is required'
  }

  try {
    convertYoutubeUrl(url)
    return true
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid YouTube URL'
  }
}
