import { NextResponse } from 'next/server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'categories',
      limit: 0,
      select: {
        title: true,
        slug: true,
      },
    })

    return NextResponse.json(result.docs)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
