import { NextRequest, NextResponse } from 'next/server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const payload = await getPayload({ config: configPromise })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      _status: { equals: 'published' },
    }

    if (category && category !== 'all') {
      where.categories = {
        in: [category],
      }
    }

    if (search) {
      where.title = {
        like: search,
      }
    }

    const result = await payload.find({
      collection: 'posts',
      where,
      limit,
      page,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        meta: true,
        publishedAt: true,
        authors: true,
        populatedAuthors: true,
        categories: true,
        heroImage: true,
        content: true, // For reading time calculation
      },
    })

    return NextResponse.json({
      posts: result.docs,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
      page: result.page,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
