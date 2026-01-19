# payload-auth-hooks

Use PayloadCMS authentication hooks for client-side auth state management.

## Why It Matters

PayloadCMS auth hooks provide:
- Automatic authentication state synchronization
- Proper handling of login/logout flows
- Integration with PayloadCMS access control
- Consistent auth state across the application
- Built-in loading states and error handling

## Incorrect Example

```typescript
// ❌ Bad: Manual auth state management
'use client'
import { useState, useEffect } from 'react'

export function UserMenu() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <LoginButton />

  return (
    <div>
      {user.name}
      <button onClick={() => {
        fetch('/api/auth/logout', { method: 'POST' })
          .then(() => setUser(null))
      }}>
        Logout
      </button>
    </div>
  )
}

// ❌ Bad: Using localStorage directly
const token = localStorage.getItem('payload-token')
```

## Correct Example

```typescript
// ✅ CORRECT: Use useAuth hook
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return <LoginButton />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{user.name}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ✅ CORRECT: Auth-aware components
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export function AdminPanel() {
  const { user } = useAuth()

  // Access control is handled automatically
  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>
  }

  return <div>Admin content</div>
}
```

## Additional Context

- Use `useAuth()` for all client-side authentication needs
- The hook provides `user`, `logout`, and loading states
- Auth state automatically syncs with PayloadCMS server state
- Access control is handled at the collection/field level in PayloadCMS
- Avoid manual token management - let PayloadCMS handle it