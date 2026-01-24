import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMediaUrl } from '@/utilities/get-media-url'

import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
  showCategories?: boolean
}

export function PostCard({ post, showCategories = true }: PostCardProps) {
  const { title, slug, publishedAt, categories, heroImage, populatedAuthors, meta, content } = post

  // Calculate reading time (rough estimate: 200 words per minute)
  const contentText = typeof content === 'object' ? JSON.stringify(content) : content || ''
  const wordCount = contentText.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <Card className='h-full hover:shadow-md transition-shadow group'>
      <Link href={`/blogs/${slug}`} className='block h-full'>
        {/* Featured Image */}
        {heroImage && typeof heroImage === 'object' && (
          <div className='aspect-[3/2] overflow-hidden rounded-t-lg bg-gray-100 relative'>
            <Image
              src={getMediaUrl(
                heroImage.url || (heroImage.filename ? `/media/${heroImage.filename}` : null),
                heroImage.updatedAt,
              )}
              alt={heroImage.alt || title}
              fill
              className='object-cover transition-opacity duration-300 group-hover:opacity-80'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        )}

        <CardHeader>
          {/* Category Badges */}
          {showCategories && categories && categories.length > 0 && (
            <div className='mb-3 flex flex-wrap gap-2'>
              {categories.slice(0, 2).map((category, index) => {
                if (typeof category === 'string') return null
                return (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {category.title}
                  </Badge>
                )
              })}
            </div>
          )}

          <CardTitle className='line-clamp-3 group-hover:text-primary transition-colors'>
            {title}
          </CardTitle>

          {/* Description */}
          {meta?.description && (
            <CardDescription className='line-clamp-2 mt-2'>{meta.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className='pt-0'>
          {/* Meta Information */}
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            {populatedAuthors && populatedAuthors.length > 0 && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <span>By {populatedAuthors.map((author: any) => author.name).join(', ')}</span>
            )}

            {publishedAt && (
              <time dateTime={publishedAt}>{format(new Date(publishedAt), 'MMM dd, yyyy')}</time>
            )}

            <span>{readingTime} min read</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
