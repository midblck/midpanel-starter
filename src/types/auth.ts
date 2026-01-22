// Auth collection types
export type AuthCollection = 'admins' | 'users'
export type AccountIdentity = 'admin' | 'user' | 'both' | 'none'

// identity types
export interface IdentityDetails {
  existsInAdmins: boolean
  existsInUsers: boolean
  hasOAuthInAdmins: boolean
  hasOAuthInUsers: boolean
}

export interface GetIdentity {
  identity: AccountIdentity
  identityDetails: IdentityDetails
}

// Auth request types
export interface SignInRequest {
  email: string
  password: string
  collection?: AuthCollection
}

export interface SignUpRequest {
  name: string
  email: string
  password: string
  collection?: AuthCollection
}

export interface SignOutRequest {
  collection?: AuthCollection
}

export interface IdentityCheckRequest {
  email: string
}

// Auth response types
export interface AuthResponse {
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
  collection?: AuthCollection
  identity?: AccountIdentity
  identityDetails?: IdentityDetails
  hasOAuth?: boolean
  oauthProviders?: string[]
  warning?: string
  token?: string
  exp?: number
}

export interface MeResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  collection: AuthCollection
  identity?: AccountIdentity
  identityDetails?: IdentityDetails
  hasOAuth?: boolean
  oauthProviders?: string[]
}

export interface IdentityCheckResponse {
  identity: AccountIdentity
  identityDetails: IdentityDetails
  collections: AuthCollection[]
  message?: string
}
