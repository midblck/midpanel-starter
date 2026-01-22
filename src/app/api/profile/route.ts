import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { createRequestLogger } from '@/utilities/logger'

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    const payload = await getPayload({ config: configPromise })

    // Use PayloadCMS built-in auth function to get current user
    const result = await payload.auth({ headers: request.headers })

    if (!result.user) {
      return NextResponse.json({ message: 'No authenticated user' }, { status: 401 })
    }

    // Extract collection from JWT token or determine from user data
    const collection = result.user.collection || 'admins'

    // Get OAuth connections for this user
    const oauthRecords = await payload.find({
      collection: 'oauth',
      where: {
        and: [{ userId: { equals: result.user.id } }, { targetCollection: { equals: collection } }],
      },
    })

    // Get OAuth avatar if available
    const oauthAvatar = oauthRecords.docs.find(record => record.avatar)?.avatar

    return NextResponse.json(
      {
        user: result.user,
        collection,
        hasOAuth: oauthRecords.docs.length > 0,
        oauthProviders: oauthRecords.docs.map(o => o.provider),
        oauthAvatar,
      },
      { status: 200 }
    )
  } catch (error) {
    requestLogger.error('Profile fetch error', error, {
      component: 'Profile',
      action: 'GET /api/profile',
    })
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    const payload = await getPayload({ config: configPromise })

    // Use PayloadCMS built-in auth function to get current user
    const result = await payload.auth({ headers: request.headers })

    if (!result.user) {
      return NextResponse.json({ message: 'No authenticated user' }, { status: 401 })
    }

    const requestBody = (await request.json()) as { name?: string }
    const name = requestBody.name || ''

    if (!name || name.length === 0) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }

    // Extract collection from JWT token
    const collection = result.user.collection || 'admins'

    // Update user profile
    const updatedUser = await payload.update({
      collection,
      id: result.user.id,
      data: {
        name,
      },
    })

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    requestLogger.error('Profile update error', error, {
      component: 'Profile',
      action: 'PATCH /api/profile',
    })
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
  }
}
