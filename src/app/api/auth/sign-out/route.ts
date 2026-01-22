import { NextRequest, NextResponse } from 'next/server'
import { createRequestLogger } from '@/utilities/logger'

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    const requestBody = (await request.json()) as { collection?: string }
    const collection = requestBody.collection || 'users'

    // Validate collection
    if (!['admins', 'users'].includes(collection)) {
      return NextResponse.json({ message: 'Invalid collection specified' }, { status: 400 })
    }

    // Create response and clear cookies directly
    const logoutResponse = NextResponse.json(
      { message: 'Signed out successfully', collection },
      { status: 200 }
    )

    // Clear the JWT token cookie
    logoutResponse.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    // Clear any additional PayloadCMS cookies that might exist
    logoutResponse.cookies.set('payload-user', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    // Clear session cookie if it exists
    logoutResponse.cookies.set('payload-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return logoutResponse
  } catch (error) {
    requestLogger.error('Sign out error', error, {
      component: 'Auth',
      action: 'POST /api/auth/sign-out',
    })
    return NextResponse.json({ message: 'An error occurred during sign out' }, { status: 500 })
  }
}
