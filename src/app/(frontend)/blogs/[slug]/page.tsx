import { cache } from 'react'

import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { NextIntlProvider } from '@/components/next-intl-provider'
import { PayloadRedirects } from '@/components/payload-redirects'
import type { Post } from '@/payload-types'
import { calculateReadTime } from '@/utilities/calculate-read-time'
import { extractHeadings } from '@/utilities/extract-headings'
import { generateBreadcrumb } from '@/utilities/generate-breadcrumb'
import { generateMeta } from '@/utilities/generate-meta'
import { getUserLocale } from '@/utilities/get-locale'
import { PostStyle } from './post-style'

// Make the route dynamic to respect locale changes
export const dynamic = 'force-dynamic'

// Only generate static params for recent posts to reduce build time
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 20, // Generate for recent posts only
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    sort: '-publishedAt',
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

const queryPostBySlug = cache(
  async ({
    slug,
    draft,
    locale,
  }: {
    slug: string
    draft: boolean
    locale: string
  }): Promise<Post | undefined> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      locale: locale as 'en' | 'id',
      overrideAccess: draft,
      pagination: false,
      select: {
        title: true,
        slug: true,
        content: true,
        conclusion: true,
        publishedAt: true,
        authors: true,
        populatedAuthors: true,
        categories: true,
        meta: true,
        heroImage: true,
        enableComments: true,
        relatedPosts: true,
        updatedAt: true,
        createdAt: true,
      },
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return (result.docs?.[0] as unknown as Post) || undefined
  },
)

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getUserLocale()

  const post = await queryPostBySlug({ slug, draft, locale })

  if (!post) return <PayloadRedirects url={`/blogs/${slug}`} />

  // Extract headings for table of contents
  const headings = extractHeadings(post.content)

  // Calculate reading time
  const readTime = calculateReadTime(post.content)

  // Generate breadcrumbs
  const breadcrumbItems = generateBreadcrumb({
    slug,
    title: post.title,
    middleItems: [],
  })

  return (
    <NextIntlProvider>
      <PostStyle
        post={post}
        headings={headings}
        readTime={readTime}
        user={null}
        url={`/blogs/${slug}`}
        draft={draft}
        breadcrumbItems={breadcrumbItems}
      />
    </NextIntlProvider>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const locale = await getUserLocale()

  const post = await queryPostBySlug({ slug, draft: false, locale })

  return await generateMeta({ doc: post ?? undefined })
}
