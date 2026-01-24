import { OAuth2Client } from 'google-auth-library'
import type { OAuthProvider, OAuthUserInfo } from './base'
import { logAuthError } from '@/utilities/logger'

export class GoogleOAuthService implements OAuthProvider {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    )
  }

  getAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      state,
    })
  }

  async verifyToken(code: string): Promise<OAuthUserInfo> {
    try {
      const { tokens } = await this.client.getToken(code)

      if (!tokens.id_token) {
        throw new Error('No ID token received from Google')
      }

      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload) {
        throw new Error('Invalid token payload from Google')
      }

      return {
        id: payload.sub,
        email: payload.email || '',
        name: payload.name || '',
        picture: payload.picture,
      }
    } catch (error) {
      logAuthError('google-oauth-verification', error)
      throw new Error('Failed to verify Google OAuth token')
    }
  }
}
