import config from '@payload-config'
import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
      depth: 0,
      draft: false,
      limit: 0,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter(post => Boolean(post?.slug))
          .map(post => {
            // Calculate priority based on recency (newer posts get higher priority)
            const updatedDate = post.updatedAt ? new Date(post.updatedAt) : new Date()
            const daysSinceUpdate = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
            const priority = daysSinceUpdate < 30 ? 0.9 : daysSinceUpdate < 90 ? 0.8 : 0.7

            return {
              lastmod: post.updatedAt || dateFallback,
              loc: `${SITE_URL}/blogs/${post?.slug}`,
              changefreq: 'weekly' as const,
              priority,
            }
          })
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
