# payload-builtin-functions-priority

Always prioritize PayloadCMS built-in functions over custom implementations. PayloadCMS provides robust, optimized APIs for data operations, authentication, and admin functionality.

## Why It Matters

PayloadCMS built-in functions offer:
- Optimized performance and security
- Automatic handling of edge cases and error scenarios
- Consistent API across versions
- Proper caching and deduplication
- Support for advanced features like relationships and access control

## Incorrect Example

```typescript
// ❌ Bad: Custom API calls instead of PayloadCMS built-ins
export default async function UserPage() {
  const response = await fetch('/api/users')
  const { users } = await response.json()

  return <UserList users={users} />
}

// ❌ Bad: Custom auth implementation
export default function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(setUser)
  }, [])

  return <div>{user?.name}</div>
}

// ❌ Bad: Manual localStorage for auth
localStorage.getItem('user')
```

## Correct Example

```typescript
// ✅ CORRECT: Use PayloadCMS built-in functions
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function UserPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 10,
  })

  return <UserList users={users} />
}

// ✅ CORRECT: Use PayloadCMS hooks for client-side
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export default function UserProfile() {
  const { user } = useAuth()
  return <div>{user?.name}</div>
}
```

## Additional Context

- Always import `getPayload` from 'payload' for server-side operations
- Use `@payloadcms/next/useAuth` for client-side authentication
- Prefer PayloadCMS hooks over manual state management
- Built-in functions handle caching, error states, and access control automatically
- Avoid custom fetch calls when PayloadCMS provides equivalent functionality