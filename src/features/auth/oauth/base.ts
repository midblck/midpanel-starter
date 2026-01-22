/**
 * Base OAuth interface for all providers
 * Provides a consistent interface for implementing different OAuth providers
 */

export interface OAuthUserInfo {
  id: string
  email: string
  name: string
  picture?: string
}

export interface OAuthProvider {
  getAuthUrl(state: string): string
  verifyToken(code: string): Promise<OAuthUserInfo>
}

export interface OAuthState {
  collection: 'admins' | 'users'
  role?: string
  callbackUrl: string
}

export interface OAuthResult {
  success: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
  collection?: 'admins' | 'users'
  identity?: 'admin' | 'user' | 'both' | 'none'
  warning?: string
  token?: string
  exp?: number
}
