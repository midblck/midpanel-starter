import { GoogleOAuthService } from '@/features/auth/oauth/google'
import { NextRequest, NextResponse } from 'next/server'
import { createRequestLogger } from '@/utilities/logger'

export function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    const { searchParams } = new URL(request.url)
    // FORCE: Always use users collection with customer role
    const collection = 'users'
    const role = 'customer'
    const callbackUrl = searchParams.get('callbackUrl') || '/app'

    // Validate collection
    if (!['admins', 'users'].includes(collection)) {
      return NextResponse.json({ message: 'Invalid collection specified' }, { status: 400 })
    }

    // Create state object with collection, role, and callback URL
    const state = JSON.stringify({
      collection,
      role,
      callbackUrl,
    })

    // Generate Google OAuth URL
    const googleService = new GoogleOAuthService()

    let authUrl: string
    try {
      authUrl = googleService.getAuthUrl(state)
    } catch (urlError) {
      requestLogger.error('Failed to generate OAuth URL', urlError, {
        component: 'OAuth',
        action: 'GET /api/auth/google',
      })
      return NextResponse.json(
        {
          error: 'OAuth URL Generation Failed',
          message: 'Failed to create Google OAuth URL',
        },
        { status: 500 },
      )
    }

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl)
  } catch (error) {
    requestLogger.error('Google OAuth initiation error', error, {
      component: 'OAuth',
      action: 'GET /api/auth/google',
    })
    return NextResponse.json({ message: 'Failed to initiate Google OAuth' }, { status: 500 })
  }
}
