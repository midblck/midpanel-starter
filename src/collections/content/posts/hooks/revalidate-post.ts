import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '@/payload-types'
import { triggerRevalidation } from '@/utilities/revalidate'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      await triggerRevalidation(path, 'posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      await triggerRevalidation(oldPath, 'posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/blogs/${doc?.slug}`

    await triggerRevalidation(path, 'posts-sitemap')
  }

  return doc
}
