# error-payload-operations

Handle PayloadCMS operation errors gracefully with proper error handling patterns.

## Why It Matters

Proper error handling for PayloadCMS operations ensures:
- Graceful degradation when database operations fail
- Meaningful error messages for users and developers
- Proper logging for debugging and monitoring
- Prevention of application crashes
- Consistent error response patterns

## Incorrect Example

```typescript
// ❌ Bad: No error handling in Payload operations
export async function createUser(data: any) {
  const payload = await getPayload({ config: configPromise })
  const user = await payload.create({
    collection: 'users',
    data,
  })
  return user // What if this fails?
}

// ❌ Bad: Silent failures
export async function updatePost(id: string, data: any) {
  const payload = await getPayload({ config: configPromise })
  await payload.update({
    collection: 'posts',
    id,
    data,
  })
  // No error handling or confirmation
}

// ❌ Bad: Generic error handling
export async function deleteUser(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.delete({
      collection: 'users',
      id,
    })
  } catch (error) {
    console.error('Something went wrong') // Not helpful
  }
}
```

## Correct Example

```typescript
// ✅ CORRECT: Comprehensive error handling in Payload operations
export async function createUser(data: CreateUserData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const user = await payload.create({
      collection: 'users',
      data: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Failed to create user:', error)

    // Handle specific PayloadCMS errors
    if (error.code === 'VALIDATION_ERROR') {
      return {
        success: false,
        errors: error.data,
        message: 'Validation failed'
      }
    }

    if (error.code === 'NOT_UNIQUE') {
      return {
        success: false,
        message: 'A user with this email already exists'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating the user'
    }
  }
}

// ✅ CORRECT: Error handling with proper logging
export async function updatePost(id: string, data: Partial<Post>) {
  try {
    const payload = await getPayload({ config: configPromise })

    const updatedPost = await payload.update({
      collection: 'posts',
      id,
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    })

    return { success: true, post: updatedPost }
  } catch (error) {
    console.error(`Failed to update post ${id}:`, error)

    // Log additional context for debugging
    console.error('Update data:', JSON.stringify(data, null, 2))

    if (error.code === 'NOT_FOUND') {
      return {
        success: false,
        message: 'Post not found'
      }
    }

    return {
      success: false,
      message: 'Failed to update post'
    }
  }
}

// ✅ CORRECT: Transaction-like error handling
export async function publishPost(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    // First check if post exists and is draft
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    if (!post) {
      throw new Error('Post not found')
    }

    if (post.status === 'published') {
      throw new Error('Post is already published')
    }

    // Update status
    const updatedPost = await payload.update({
      collection: 'posts',
      id,
      data: {
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })

    return { success: true, post: updatedPost }
  } catch (error) {
    console.error(`Failed to publish post ${id}:`, error)

    return {
      success: false,
      message: error.message || 'Failed to publish post'
    }
  }
}
```

## Additional Context

- Always wrap PayloadCMS operations in try-catch blocks
- Handle specific error codes (`VALIDATION_ERROR`, `NOT_FOUND`, `NOT_UNIQUE`)
- Provide meaningful error messages for different error types
- Log errors with sufficient context for debugging
- Return consistent error response formats
- Consider user permissions and access control errors