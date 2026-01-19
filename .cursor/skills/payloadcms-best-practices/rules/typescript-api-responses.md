# typescript-api-responses

Type API route responses and requests properly for type safety.

## Why It Matters

Properly typed API routes provide:
- Type safety between frontend and backend
- Better error handling and validation
- Self-documenting API contracts
- Compile-time validation of request/response shapes
- Improved developer experience with autocomplete

## Incorrect Example

```typescript
// ❌ Bad: Untyped API routes
export async function GET(request) {
  const payload = await getPayload({ config: configPromise })
  const users = await payload.find({ collection: 'users' })

  return Response.json({ users: users.docs })
}

// ❌ Bad: Any types in request handlers
export async function POST(request) {
  const body = await request.json() // Any type
  const { name, email } = body // No validation

  // Unsafe operations
  const user = await payload.create({
    collection: 'users',
    data: { name, email }, // No type safety
  })

  return Response.json({ user })
}

// ❌ Bad: Untyped responses
export async function PUT(request) {
  const result = await updateUser(request)
  return Response.json(result) // No response contract
}
```

## Correct Example

```typescript
// ✅ CORRECT: Properly typed API routes
import type { NextRequest } from 'next/server'

interface GetUsersResponse {
  users: User[]
  pagination: {
    page: number
    totalPages: number
    totalDocs: number
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs, totalPages, totalDocs } = await payload.find({
      collection: 'users',
      limit: 10,
      page: 1,
    })

    const response: GetUsersResponse = {
      users: docs,
      pagination: {
        page: 1,
        totalPages,
        totalDocs,
      },
    }

    return Response.json(response)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// ✅ CORRECT: Typed request/response interfaces
interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: 'admin' | 'editor' | 'viewer'
}

interface CreateUserResponse {
  user: User
  message: string
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: CreateUserRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return Response.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const user = await payload.create({
      collection: 'users',
      data: {
        ...body,
        role: body.role || 'viewer',
      },
    })

    const response: CreateUserResponse = {
      user,
      message: 'User created successfully',
    }

    return Response.json(response, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return Response.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

## Additional Context

- Define clear interfaces for request and response shapes
- Use `NextRequest` type for Next.js API routes
- Validate request data before processing
- Return properly typed Response objects
- Include error responses in your type definitions
- Use status codes appropriately (200, 201, 400, 404, 500)