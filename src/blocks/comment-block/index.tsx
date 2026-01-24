'use client'

import React from 'react'

import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'

import { useComments } from '@/blocks/comment-block/hooks/use-comments'
import { useCommentsBlockTranslations } from '@/blocks/translations/useCommentsBlockTranslations'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Comment, Post, User } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatDateTime } from '@/utilities/format-date-time'
import { getClientSideURL } from '@/utilities/get-url'

import { CommentForm } from './components/comment-form'

export type CommentsBlockProps = {
  blockName: string
  blockType: 'comments'
  comments?: Comment[] // Made optional - will fetch client-side if not provided
  doc: Post
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  introContent?: any
  relationTo: 'posts'
  user?: User
  buttonPosition?: 'left' | 'right'
}

export const CommentsBlock: React.FC<CommentsBlockProps> = props => {
  const { comments: propsComments, doc, user, buttonPosition } = props
  const t = useCommentsBlockTranslations()

  // Fetch comments client-side if not provided via props
  const { comments: fetchedComments, loading: commentsLoading } = useComments({
    doc: doc?.id,
  })

  // Use props comments if provided (backward compatibility), otherwise use fetched
  const comments = propsComments && propsComments.length > 0 ? propsComments : fetchedComments

  // Ensure buttonPosition is always defined to prevent hydration mismatches
  const effectiveButtonPosition = buttonPosition || 'right'

  const filteredComments = !!user
    ? comments
    : comments.filter(comment => comment._status === 'published')

  return (
    <div className='mx-auto space-y-6 w-full max-w-3xl'>
      <div className='space-y-2'>
        <h2 className='font-bold text-2xl'>{t.comments}</h2>
        <p className='text-muted-foreground'>{t.shareThoughts}</p>
      </div>

      {commentsLoading && <div className='text-muted-foreground text-sm'>Loading comments...</div>}

      {!commentsLoading && filteredComments && filteredComments.length > 0 && (
        <div className='space-y-6'>
          {filteredComments.map(com => {
            const { _status, comment, name, createdAt, id } = com

            if (!comment) return null

            return (
              <div
                key={id}
                className={cn(
                  'flex items-start gap-4 relative',
                  _status === 'draft' ? 'border-primary border p-1 rounded-md' : '',
                )}
              >
                {_status === 'draft' && (
                  <Link
                    className='absolute right-10 px-3 bg-background rounded-md border-black dark:border-white -top-3 border'
                    href={`${getClientSideURL()}/admin/collections/comments/${com.id}`}
                  >
                    {t.gotoAdminAndPublish}
                  </Link>
                )}

                <Avatar className='w-10 h-10 border'>
                  <AvatarFallback>
                    <CircleUserRound size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className='grid gap-1.5'>
                  <div className='flex items-center gap-2'>
                    <div className='font-medium'>{name || t.unnamedUser}</div>
                    {createdAt && (
                      <div className='text-muted-foreground text-xs'>
                        {formatDateTime(createdAt)}
                      </div>
                    )}
                  </div>
                  <div className='prose prose-sm dark:prose-invert max-w-none'>{comment}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CommentForm
        docID={typeof doc.id === 'string' ? doc.id : String(doc.id)}
        buttonPosition={effectiveButtonPosition}
      />
    </div>
  )
}
