import type { OAuthState, OAuthUserInfo } from '@/features/auth/oauth/base'
import { GoogleOAuthService } from '@/features/auth/oauth/google'
import { getIdentityDetails } from '@/features/auth/services/identity'
import { createRequestLogger, logApiError } from '@/utilities/logger'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check for OAuth errors from Google
    if (error) {
      logApiError('/api/auth/google/callback', 'GET', new Error(`Google OAuth error: ${error}`), {
        component: 'OAuth',
        action: 'callback',
        googleError: error,
        callbackUrl: request.url.toString(),
      })

      // Handle specific Google OAuth errors
      let errorMessage = 'Google OAuth failed'
      if (error === 'access_denied') {
        errorMessage = 'User denied access to Google account'
      } else if (error === 'invalid_request') {
        errorMessage = 'Invalid OAuth request'
      } else if (error === 'unauthorized_client') {
        errorMessage = 'Unauthorized OAuth client'
      } else if (error === 'unsupported_response_type') {
        errorMessage = 'Unsupported response type'
      } else if (error === 'invalid_scope') {
        errorMessage = 'Invalid OAuth scope requested'
      } else if (error === 'server_error') {
        errorMessage = 'Google OAuth server error'
      } else if (error === 'temporarily_unavailable') {
        errorMessage = 'Google OAuth temporarily unavailable'
      }

      return NextResponse.json(
        { error: 'OAuth Error', message: errorMessage, googleError: error },
        { status: 400 },
      )
    }

    if (!code || !state) {
      requestLogger.error('Missing OAuth parameters', undefined, {
        component: 'OAuth',
        action: 'callback',
        code: !!code,
        state: !!state,
      })
      return NextResponse.json({ message: 'Missing code or state parameter' }, { status: 400 })
    }

    // Parse state
    let stateData: OAuthState
    try {
      const parsedState = JSON.parse(state) as OAuthState
      // Validate required fields
      if (!parsedState.callbackUrl) {
        throw new Error('Invalid state structure')
      }
      stateData = parsedState
    } catch (parseError) {
      requestLogger.error('State parsing failed', parseError, {
        component: 'OAuth',
        action: 'callback',
        state,
      })
      return NextResponse.json({ message: 'Invalid state parameter' }, { status: 400 })
    }

    const { callbackUrl } = stateData

    // Verify Google OAuth token and get user info
    const googleService = new GoogleOAuthService()

    let googleUser: OAuthUserInfo | undefined
    try {
      const verifyResult = await googleService.verifyToken(code)
      googleUser = verifyResult
    } catch (verifyError) {
      requestLogger.error('Google OAuth verification failed', verifyError, {
        component: 'OAuth',
        action: 'callback',
        email: googleUser?.email,
        googleId: googleUser?.id,
      })
      return NextResponse.json(
        {
          error: 'OAuth Verification Failed',
          message: 'Failed to verify Google OAuth token',
        },
        { status: 400 },
      )
    }

    const email = googleUser.email
    const googleId = googleUser.id
    const name = googleUser.name
    const picture = googleUser.picture

    // Validate required fields
    if (!email || !name) {
      requestLogger.error('Missing required OAuth data', undefined, {
        component: 'OAuth',
        action: 'callback',
        email,
        name,
        googleId,
      })
      return NextResponse.json(
        { message: 'Invalid OAuth data received from Google' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Step 1: Check if OAuth record exists (by providerId)
    const existingOAuth = await payload.find({
      collection: 'oauth',
      where: {
        and: [{ providerId: { equals: googleId } }, { provider: { equals: 'google' } }],
      },
      limit: 1,
    })

    // Get identity details
    const getIdentity = await getIdentityDetails(email, payload)

    let targetCollection: 'admins' | 'users'

    // Priority: admins > users for existing accounts
    if (getIdentity.identityDetails.existsInAdmins && getIdentity.identityDetails.existsInUsers) {
      targetCollection = 'admins'
    } else if (getIdentity.identityDetails.existsInAdmins) {
      targetCollection = 'admins'
    } else if (getIdentity.identityDetails.existsInUsers) {
      targetCollection = 'users'
    } else {
      // New user from Google OAuth - always use users collection
      targetCollection = 'users'
    }

    // Get or create user
    let user

    if (existingOAuth.docs.length > 0) {
      // OAuth record exists - find linked user
      const oauthRecord = existingOAuth.docs[0]

      try {
        user = await payload.findByID({
          collection: oauthRecord.targetCollection || 'admins',
          id: oauthRecord.userId,
        })
        targetCollection = oauthRecord.targetCollection || 'admins'
      } catch {
        // Linked user not found - find by email instead
        if (getIdentity.identityDetails.existsInAdmins) {
          const adminResult = await payload.find({
            collection: 'admins',
            where: { email: { equals: email } },
            limit: 1,
          })
          user = adminResult.docs[0]
          targetCollection = 'admins'
        } else if (getIdentity.identityDetails.existsInUsers) {
          const userResult = await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
          })
          user = userResult.docs[0]
          targetCollection = 'users'
        } else {
          // Create new user
          user = await payload.create({
            collection: targetCollection,
            data: {
              email: email,
              name: name,
              role: 'customer',
              isActive: true,
              password: 'oauth-' + googleId,
              hasOAuth: true,
              lastLoginAt: new Date().toISOString(),
            },
          })
        }

        // Update OAuth record
        await payload.update({
          collection: 'oauth',
          id: oauthRecord.id,
          data: {
            userId: user.id,
            targetCollection: targetCollection,
            providerEmail: email,
            providerName: name,
            avatar: picture,
            lastLoginAt: new Date().toISOString(),
          },
        })
      }
    } else if (
      getIdentity.identityDetails.existsInAdmins ||
      getIdentity.identityDetails.existsInUsers
    ) {
      // Email exists - link OAuth to existing account
      if (getIdentity.identityDetails.existsInAdmins) {
        const adminResult = await payload.find({
          collection: 'admins',
          where: { email: { equals: email } },
          limit: 1,
        })
        user = adminResult.docs[0]
      } else {
        const userResult = await payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
        })
        user = userResult.docs[0]
      }

      await payload.create({
        collection: 'oauth',
        data: {
          provider: 'google',
          providerId: googleId,
          providerEmail: email,
          providerName: name,
          avatar: picture,
          targetCollection: targetCollection,
          userId: user.id,
          lastLoginAt: new Date().toISOString(),
        },
      })
    } else {
      // New user - create OAuth account
      user = await payload.create({
        collection: targetCollection,
        data: {
          email: email,
          name: name,
          role: 'customer',
          isActive: true,
          password: 'oauth-' + googleId,
          hasOAuthOnly: true,
          lastLoginAt: new Date().toISOString(),
        },
      })

      // Create OAuth record
      await payload.create({
        collection: 'oauth',
        data: {
          provider: 'google',
          providerId: googleId,
          providerEmail: email,
          providerName: name,
          avatar: picture,
          targetCollection: targetCollection,
          userId: user.id,
          lastLoginAt: new Date().toISOString(),
        },
      })
    }

    // Generate JWT token using PayloadCMS's expected format
    let token

    try {
      const crypto = await import('crypto')
      const jwt = await import('jsonwebtoken')

      // Step 1: Hash the secret using SHA-256 and take first 32 characters
      const originalSecret = process.env.PAYLOAD_SECRET || 'your-secret-key'
      const hashedSecret = crypto.default
        .createHash('sha256')
        .update(originalSecret)
        .digest('hex')
        .slice(0, 32)

      // Generate session ID and create session in user's sessions array
      const { v4: uuidv4 } = await import('uuid')
      const sid = uuidv4()
      const sessionExpiry = new Date()
      sessionExpiry.setDate(sessionExpiry.getDate() + 7)

      await payload.update({
        collection: targetCollection,
        id: user.id,
        data: {
          sessions: [
            ...(user.sessions || []), // Keep existing sessions
            {
              id: sid,
              createdAt: new Date().toISOString(),
              expiresAt: sessionExpiry.toISOString(),
            },
          ],
        },
      })

      token = jwt.default.sign(
        {
          id: user.id,
          email: user.email,
          collection: targetCollection,
          sid: sid,
        },
        hashedSecret,
        { expiresIn: '7d' },
      )
    } catch (jwtError) {
      requestLogger.error('Failed to generate JWT token', jwtError, {
        component: 'OAuth',
        action: 'callback',
        userId: user.id,
        collection: targetCollection,
      })
      throw new Error('OAuth authentication failed - unable to generate token')
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Failed to generate authentication token' },
        { status: 500 },
      )
    }

    // Set the JWT token in a cookie
    const absoluteCallbackUrl = callbackUrl.startsWith('http')
      ? callbackUrl
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${callbackUrl}`

    const response = NextResponse.redirect(absoluteCallbackUrl)

    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    requestLogger.error('Google OAuth callback error', error, {
      component: 'OAuth',
      action: 'callback',
    })
    return NextResponse.json({ message: 'OAuth authentication failed' }, { status: 500 })
  }
}
