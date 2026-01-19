# quality-error-handling

Implement proper error handling patterns throughout the application to provide a robust user experience and prevent crashes.

## Why It Matters

Proper error handling ensures:
- Graceful degradation when things go wrong
- Better user experience with meaningful error messages
- Easier debugging and maintenance
- Prevention of application crashes
- Proper logging for monitoring and troubleshooting

## Incorrect Example

```typescript
// ❌ Bad: No error handling
export default async function UserPage() {
  const payload = await getPayload({ config: payloadConfig })
  const users = await payload.find({ collection: 'users' })
  return <UserList users={users.docs} />
}

// ❌ Bad: Silent failures
export async function createUser(data: any) {
  const user = await payload.create({
    collection: 'users',
    data,
  })
  return user // What if this fails?
}

// ❌ Bad: Generic error messages
export function UserForm() {
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    try {
      await submitForm()
    } catch (err) {
      setError('Something went wrong') // Not helpful
    }
  }
}
```

## Correct Example

```typescript
// ✅ CORRECT: Proper error handling in server components
export default async function UserPage() {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const users = await payload.find({ collection: 'users' })
    return <UserList users={users.docs} />
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return <ErrorMessage message="Failed to load users" />
  }
}

// ✅ CORRECT: Comprehensive error handling in API routes
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.email || !body.password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const result = await createUser(body)

    if (!result.success) {
      return Response.json(
        { error: result.error, details: result.errors },
        { status: 400 }
      )
    }

    return Response.json({ user: result.user }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ✅ CORRECT: User-friendly error messages
'use client'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function UserForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      // Success handling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  )
}
```

## Additional Context

- Always wrap async operations in try-catch blocks
- Provide specific error messages instead of generic ones
- Use proper HTTP status codes in API routes
- Log errors for debugging while showing user-friendly messages
- Handle both expected errors (validation) and unexpected errors (server issues)
- Use error boundaries for React component failures