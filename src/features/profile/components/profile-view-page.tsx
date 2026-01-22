'use client'

import { ErrorBoundary, ProfileErrorFallback } from '@/components/error-boundary'
import { logError } from '@/utilities/logger'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth/context/auth-context'
import { generateAvatarUrl } from '@/lib/avatar'
import { Edit, Mail, Save, Shield, User, X, Calendar, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProfileViewPage() {
  const { user, loading, hasOAuth, oauthProviders, identity, identityDetails, collection } =
    useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      void fetchOAuthAvatar()
    }
  }, [user])

  const fetchOAuthAvatar = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setAvatar(data.oauthAvatar || null)
      }
    } catch (error) {
      logError('Failed to fetch OAuth avatar', error, {
        component: 'ProfileView',
        action: 'fetch-oauth-avatar',
      })
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' })
        setIsEditing(false)
      } else {
        const error = await response.json()
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update profile',
        })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setIsEditing(false)
  }

  const handlePasswordChange = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setIsChangingPassword(false)
      } else {
        const error = await response.json()
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update password',
        })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update password' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGoogleLink = () => {
    const callbackUrl = encodeURIComponent('/app/profile')
    window.location.href = `/api/auth/google?collection=${collection}&callbackUrl=${callbackUrl}`
  }

  if (loading) {
    return (
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Profile</h2>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Profile</h2>
            <p className='text-muted-foreground'>Please sign in to view your profile</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<ProfileErrorFallback error={new Error('Profile failed to load')} />}>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Profile</h2>
            <p className='text-muted-foreground'>Manage your account settings and preferences</p>
          </div>
          <div className='flex space-x-2'>
            {isEditing ? (
              <>
                <Button onClick={handleSave} size='sm' disabled={isUpdating}>
                  <Save className='mr-2 h-4 w-4' />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant='outline' size='sm'>
                  <X className='mr-2 h-4 w-4' />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size='sm'>
                <Edit className='mr-2 h-4 w-4' />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Avatar Card */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader className='text-center'>
                <div className='flex justify-center mb-4'>
                  <Avatar className='h-24 w-24'>
                    <AvatarImage
                      src={avatar || generateAvatarUrl(user.name || 'User', 96)}
                      alt={user.name}
                    />
                    <AvatarFallback className='text-2xl'>
                      {user.name
                        ?.split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className='text-xl'>{user.name}</CardTitle>
                <CardDescription className='text-sm'>{user.role}</CardDescription>
                <div className='flex justify-center gap-2 mt-2'>
                  <Badge variant='secondary'>{collection === 'admins' ? 'Admin' : 'User'}</Badge>
                  {identity === 'both' && <Badge variant='outline'>Multi-Collection</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3 text-sm'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <span>{user.email}</span>
                  </div>
                  {user.lastLoginAt && (
                    <div className='flex items-center space-x-3 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user.createdAt && (
                    <div className='flex items-center space-x-3 text-sm'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span>Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Stats Card */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle className='text-lg'>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>Account Type</span>
                    <span className='font-semibold'>
                      {collection === 'admins' ? 'Administrator' : 'User'}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>Authentication</span>
                    <span className='font-semibold'>
                      {hasOAuth ? 'OAuth + Password' : 'Password Only'}
                    </span>
                  </div>
                  {identityDetails && (
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-muted-foreground'>Multi-Collection</span>
                      <span className='font-semibold'>
                        {identityDetails.existsInAdmins && identityDetails.existsInUsers
                          ? 'Yes (Both Collections)'
                          : 'No'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <User className='mr-2 h-5 w-5' />
                  Account Details
                </CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <Label htmlFor='name'>Full Name</Label>
                    <Input
                      id='name'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={user.email}
                      disabled
                      className='bg-muted'
                    />
                  </div>
                  <div>
                    <Label htmlFor='role'>Role</Label>
                    <Input id='role' value={user.role} disabled className='bg-muted' />
                  </div>
                  <div>
                    <Label htmlFor='collection'>Collection</Label>
                    <Input
                      id='collection'
                      value={collection === 'admins' ? 'Admin' : 'User'}
                      disabled
                      className='bg-muted'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Shield className='mr-2 h-5 w-5' />
                  Security
                </CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {!isChangingPassword ? (
                  <Button onClick={() => setIsChangingPassword(true)} variant='outline'>
                    Change Password
                  </Button>
                ) : (
                  <div className='space-y-4'>
                    {!hasOAuth && (
                      <div>
                        <Label htmlFor='currentPassword'>Current Password</Label>
                        <Input
                          id='currentPassword'
                          type='password'
                          value={passwordData.currentPassword}
                          onChange={e =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor='newPassword'>New Password</Label>
                      <Input
                        id='newPassword'
                        type='password'
                        value={passwordData.newPassword}
                        onChange={e =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                      <Input
                        id='confirmPassword'
                        type='password'
                        value={passwordData.confirmPassword}
                        onChange={e =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    {hasOAuth && (
                      <p className='text-sm text-muted-foreground'>
                        OAuth users can skip current password verification
                      </p>
                    )}
                    <div className='flex space-x-2'>
                      <Button onClick={handlePasswordChange} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button onClick={() => setIsChangingPassword(false)} variant='outline'>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Manage your authentication methods</CardDescription>
              </CardHeader>
              <CardContent>
                {hasOAuth ? (
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      You can sign in with Google or Password
                    </p>
                    <div className='flex gap-2'>
                      {oauthProviders.map(provider => (
                        <Badge key={provider} variant='secondary'>
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Link your Google account to enable Google sign-in
                    </p>
                    <Button onClick={handleGoogleLink} variant='outline'>
                      Link Google Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User-Specific Information */}
            {collection === 'users' && (
              <Card>
                <CardHeader>
                  <CardTitle>User Dashboard</CardTitle>
                  <CardDescription>Your personal dashboard and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='p-4 border rounded-lg'>
                        <h4 className='font-semibold text-sm'>Profile Completion</h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Complete your profile to get the most out of your account
                        </p>
                        <div className='mt-2'>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                              className='bg-blue-600 h-2 rounded-full'
                              style={{ width: '75%' }}
                            ></div>
                          </div>
                          <span className='text-xs text-muted-foreground'>75% Complete</span>
                        </div>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <h4 className='font-semibold text-sm'>Account Status</h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Your account is active and ready to use
                        </p>
                        <Badge variant='secondary' className='mt-2'>
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin-Specific Information */}
            {collection === 'admins' && (
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Panel</CardTitle>
                  <CardDescription>Administrative tools and system information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='p-4 border rounded-lg'>
                        <h4 className='font-semibold text-sm'>System Access</h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Full administrative access to the system
                        </p>
                        <Badge variant='default' className='mt-2'>
                          Full Access
                        </Badge>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <h4 className='font-semibold text-sm'>Role Permissions</h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Role: {user.role || 'Staff'}
                        </p>
                        <Badge variant='outline' className='mt-2'>
                          {user.role || 'Staff'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
