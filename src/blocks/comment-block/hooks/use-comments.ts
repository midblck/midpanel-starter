import { useCallback, useEffect, useState } from 'react'

import type { Comment, Post } from '@/payload-types'
import { getClientSideURL } from '@/utilities/get-url'
import { logger } from '@/utilities/logger'

interface UseCommentsOptions {
  doc?: Post['id']
  limit?: number
  sort?: string
}

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook to fetch comments from Payload's built-in API
 * Fetches comments filtered by document ID (post ID) with depth=1
 */
export function useComments(options: UseCommentsOptions = {}): UseCommentsReturn {
  const { doc, limit = 1000, sort = '-createdAt' } = options
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!doc) {
      setComments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        'where[doc][equals]': doc,
        depth: '1',
        limit: limit.toString(),
        pagination: 'false',
        sort,
      })
      const queryString = params.toString()

      const response = await fetch(`${getClientSideURL()}/api/comments?${queryString}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`)
      }

      const data = (await response.json()) as {
        docs: Comment[]
      }

      setComments(data.docs || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comments'
      setError(errorMessage)
      setComments([])
      logger.error('Failed to fetch comments', err, {
        component: 'useComments',
        action: 'fetchComments',
        doc,
      })
    } finally {
      setLoading(false)
    }
  }, [doc, limit, sort])

  useEffect(() => {
    void fetchComments()
  }, [fetchComments])

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
  }
}
