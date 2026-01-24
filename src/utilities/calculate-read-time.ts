/**
 * Utility function to calculate reading time from Lexical editor content
 * Based on average reading speed of 200-250 words per minute
 */

interface LexicalNode {
  type?: string
  children?: LexicalNode[]
  text?: string
  [key: string]: unknown
}

/**
 * Extract text content from Lexical editor JSON structure
 */
function extractTextFromLexical(node: LexicalNode | LexicalNode[]): string {
  if (!node) return ''

  if (Array.isArray(node)) {
    return node.map(extractTextFromLexical).join(' ')
  }

  if (typeof node === 'object' && node !== null) {
    // If it has text property, use it
    if (typeof node.text === 'string') {
      return node.text
    }

    // If it has children, recursively extract text from them
    if (Array.isArray(node.children)) {
      return node.children.map(extractTextFromLexical).join(' ')
    }

    // Handle root structure
    if (node.root && typeof node.root === 'object' && node.root !== null) {
      const rootObj = node.root as Record<string, unknown>
      if (Array.isArray(rootObj.children)) {
        return rootObj.children.map(extractTextFromLexical).join(' ')
      }
    }
  }

  return ''
}

/**
 * Count words in text content
 */
function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0

  // Remove extra whitespace and split by spaces
  const cleanText = text.trim().replace(/\s+/g, ' ')

  // Split by spaces and filter out empty strings
  const words = cleanText.split(' ').filter(word => word.length > 0)

  return words.length
}

/**
 * Calculate reading time in minutes
 * @param content - Lexical editor content object
 * @param wordsPerMinute - Reading speed (default: 200 words per minute)
 * @returns Object with reading time in minutes and word count
 */
export function calculateReadTime(
  content: unknown,
  wordsPerMinute: number = 200,
): { minutes: number; wordCount: number } {
  if (!content) {
    return { minutes: 0, wordCount: 0 }
  }

  try {
    // Extract text from the Lexical editor content
    const text = extractTextFromLexical(content as LexicalNode)

    // Count words
    const wordCount = countWords(text)

    // Calculate reading time (minimum 1 minute)
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

    return { minutes, wordCount }
  } catch (error) {
    console.error('Failed to calculate reading time:', error)
    // Return default values if calculation fails
    return { minutes: 1, wordCount: 0 }
  }
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read", "1 min read")
 */
export function formatReadTime(minutes: number): string {
  if (minutes <= 0) return '1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}
