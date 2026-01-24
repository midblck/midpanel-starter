import type { Metadata } from 'next'

import { locales } from '@/i18n/config'
import type { Post } from '@/payload-types'

import { getServerSideURL } from './get-url'

export const generateMeta = async (args: { doc?: Post }): Promise<Metadata> => {
  const { doc } = args

  const siteUrl = getServerSideURL()
  const siteName = 'Midpanel Starter'
  const siteDescription =
    'A modern, production-ready website and CMS template built with Payload CMS and Next.js.'

  // If no document is provided, return basic site metadata
  if (!doc) {
    return {
      title: {
        default: siteName,
        template: `%s | ${siteName}`,
      },
      description: siteDescription,
      keywords: ['website', 'cms', 'payload', 'nextjs', 'template'],
      authors: [{ name: 'MakeinDev' }],
      creator: 'MakeinDev',
      publisher: siteName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName,
        title: siteName,
        description: siteDescription,
        images: [
          {
            url: `${siteUrl}/website-template-OG.webp`,
            width: 1200,
            height: 630,
            alt: siteName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: siteName,
        description: siteDescription,
        creator: '@payloadcms',
        images: [`${siteUrl}/website-template-OG.webp`],
      },
      metadataBase: new URL(siteUrl),
    }
  }

  // Use post meta if available, otherwise fall back to site defaults
  const title = doc.meta?.title || doc.title || siteName
  let description = doc.meta?.description || siteDescription
  const image = doc.meta?.image

  // Validate and optimize description length (150-160 characters is optimal)
  if (description) {
    const descLength = description.length
    if (descLength < 120) {
      // Description too short, but keep it
    } else if (descLength > 160) {
      // Truncate to 160 characters at word boundary
      const truncated = description.substring(0, 157)
      const lastSpace = truncated.lastIndexOf(' ')
      description = lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
    }
  }

  const url = `${siteUrl}/blogs/${doc.slug}`

  // Build OpenGraph object
  const openGraph: Metadata['openGraph'] = {
    type: 'article',
    locale: 'en_US',
    url,
    siteName,
    title,
    description,
    images:
      image && typeof image === 'object' && image.url
        ? [
            {
              url: image.url,
              width: image.width || 1200,
              height: image.height || 630,
              alt: image.alt || title,
            },
          ]
        : [
            {
              url: `${siteUrl}/website-template-OG.webp`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
  }

  // Add publication date for posts
  if (doc.publishedAt) {
    openGraph.publishedTime = doc.publishedAt
  }

  // Add modification date
  if (doc.updatedAt) {
    openGraph.modifiedTime = doc.updatedAt
  }

  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ['website', 'cms', 'payload', 'nextjs', 'template'],
    authors: [{ name: 'MakeinDev' }],
    creator: 'MakeinDev',
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@payloadcms',
      images:
        image && typeof image === 'object' && image.url
          ? [image.url]
          : [`${siteUrl}/website-template-OG.webp`],
    },
    alternates: {
      canonical: url,
      // Add hreflang tags for multi-language support (if multiple locales exist)
      ...(locales.length > 1 && {
        languages: locales.reduce(
          (acc, loc) => {
            // Map locale codes: 'en' -> 'en-US', 'id' -> 'id-ID'
            const localeCode = loc === 'en' ? 'en-US' : 'id-ID'
            // For posts, construct alternate URLs
            acc[localeCode] = `${siteUrl}/blogs/${doc.slug}`
            return acc
          },
          {} as Record<string, string>,
        ),
      }),
    },
    metadataBase: new URL(siteUrl),
  }

  return metadata
}
