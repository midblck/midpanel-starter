'use client'

import React, { useCallback, useRef } from 'react'

import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCommentsBlockTranslations } from '@/blocks/translations/useCommentsBlockTranslations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Comment } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { getClientSideURL } from '@/utilities/get-url'

import { COMMENT_LIMITS, validateCommentInput, validateDocID } from '../utils/comment-security'

export const CommentForm: React.FC<{
  docID: string
  buttonPosition?: 'left' | 'right'
}> = ({ docID, buttonPosition }) => {
  const t = useCommentsBlockTranslations()
  // Ensure buttonPosition is always defined to prevent hydration mismatches
  const effectiveButtonPosition = buttonPosition || 'right'

  const formMethods = useForm()
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
    reset,
  } = formMethods

  // const { user } = useAuth()

  const onSubmit = useCallback(
    (data: FieldValues) => {
      // Clear any existing timeout
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }

      // Debounce: prevent rapid submissions
      submitTimeoutRef.current = setTimeout(async () => {
        try {
          // Ensure docID is a string
          const docIDString = typeof docID === 'string' ? docID : String(docID)

          // Validate docID format
          const docIDValidation = validateDocID(docIDString)
          if (!docIDValidation.valid) {
            toast.error(docIDValidation.error || 'Invalid document ID')
            return
          }

          // Validate and sanitize all inputs
          const validationResult = validateCommentInput({
            name: data.name as string,
            email: data.email as string,
            comment: data.comment as string,
            doc: docIDString,
          })

          if (!validationResult.valid) {
            const firstError = validationResult.errors
              ? Object.values(validationResult.errors)[0]
              : 'Validation failed'
            toast.error(firstError)
            return
          }

          // Use sanitized values if available
          const sanitizedData = validationResult.sanitized || {}

          const res = await fetch(`${getClientSideURL()}/api/comments`, {
            body: JSON.stringify({
              // All comments are created as drafts so that they can be moderated before being published
              // Navigate to the admin dashboard and change the comment status to "published" for it to appear on the site
              doc: docIDString,
              status: 'draft',
              name: sanitizedData.name || data.name,
              email: sanitizedData.email || data.email,
              comment: sanitizedData.comment || data.comment,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const json: Comment & {
            message?: string
          } = await res.json()

          if (!res.ok) {
            const errorMessage = json.message || t.somethingWentWrong
            throw new Error(errorMessage)
          }

          toast.success(t.commentSubmitted)

          reset()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : t.somethingWentWrong
          toast.error(errorMessage)
        }
      }, 300) // 300ms debounce
    },
    [docID, reset, t],
  )

  return (
    <FormProvider {...formMethods}>
      <Card>
        <CardHeader>
          <CardTitle>{t.addComment}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>{t.name}</Label>
              <Input
                id='name'
                placeholder={t.enterYourName}
                maxLength={COMMENT_LIMITS.NAME_MAX_LENGTH}
                {...register('name', {
                  required: t.nameRequired,
                  minLength: {
                    value: COMMENT_LIMITS.NAME_MIN_LENGTH,
                    message: t.nameMinLength(COMMENT_LIMITS.NAME_MIN_LENGTH),
                  },
                  maxLength: {
                    value: COMMENT_LIMITS.NAME_MAX_LENGTH,
                    message: t.nameMaxLength(COMMENT_LIMITS.NAME_MAX_LENGTH),
                  },
                })}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <span className='text-sm text-destructive'>{errors.name.message as string}</span>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>{t.email}</Label>
              <Input
                id='email'
                type='email'
                placeholder={t.enterYourEmail}
                maxLength={COMMENT_LIMITS.EMAIL_MAX_LENGTH}
                {...register('email', {
                  required: t.emailRequired,
                  maxLength: {
                    value: COMMENT_LIMITS.EMAIL_MAX_LENGTH,
                    message: t.emailMaxLength(COMMENT_LIMITS.EMAIL_MAX_LENGTH),
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t.invalidEmail,
                  },
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <span className='text-sm text-destructive'>{errors.email.message as string}</span>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='comment'>{t.comment}</Label>
              <Textarea
                id='comment'
                placeholder={t.writeYourComment}
                className='min-h-[100px]'
                maxLength={COMMENT_LIMITS.COMMENT_MAX_LENGTH}
                {...register('comment', {
                  required: t.commentRequired,
                  minLength: {
                    value: COMMENT_LIMITS.COMMENT_MIN_LENGTH,
                    message: t.commentMinLength(COMMENT_LIMITS.COMMENT_MIN_LENGTH),
                  },
                  maxLength: {
                    value: COMMENT_LIMITS.COMMENT_MAX_LENGTH,
                    message: t.commentMaxLength(COMMENT_LIMITS.COMMENT_MAX_LENGTH),
                  },
                })}
                aria-invalid={errors.comment ? 'true' : 'false'}
              />
              {errors.comment && (
                <span className='text-sm text-destructive'>{errors.comment.message as string}</span>
              )}
            </div>
          </CardContent>
          <CardFooter
            className={cn(
              effectiveButtonPosition === 'left' ? 'justify-start' : 'justify-end',
              'pt-6',
            )}
          >
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading ? t.process : t.submit}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  )
}
