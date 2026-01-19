# typescript-explicit-types

Avoid `any` types and use explicit interfaces throughout the application.

## Why It Matters

Explicit types provide:
- Compile-time error detection
- Better IDE support and autocomplete
- Self-documenting code
- Prevention of runtime type errors
- Improved code maintainability and refactoring

## Incorrect Example

```typescript
// ❌ Bad: Using any type everywhere
export function UserCard({ user }: { user: any }) {
  return <div>{user.name}</div>
}

// ❌ Bad: Implicit any parameters
function processData(data) { // Missing parameter type
  return data.map(item => item.value) // Unsafe operations
}

// ❌ Bad: Generic any returns
function fetchUser(id): any { // Missing return type
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// ❌ Bad: Any in interfaces
interface ApiResponse {
  data: any // Too generic
  error?: any
}
```

## Correct Example

```typescript
// ✅ CORRECT: Explicit types everywhere
interface UserCardProps {
  user: User
  variant?: 'default' | 'compact'
}

export function UserCard({ user, variant = 'default' }: UserCardProps) {
  return (
    <Card className={variant === 'compact' ? 'p-2' : 'p-4'}>
      <div>{user.name}</div>
    </Card>
  )
}

// ✅ CORRECT: Properly typed functions
interface ProcessDataOptions {
  filter?: (item: DataItem) => boolean
  transform?: (item: DataItem) => ProcessedItem
}

function processData(
  data: DataItem[],
  options: ProcessDataOptions = {}
): ProcessedItem[] {
  let result = data

  if (options.filter) {
    result = result.filter(options.filter)
  }

  return result.map(options.transform || (item => item))
}

// ✅ CORRECT: Strongly typed API responses
interface ApiResponse<T> {
  data: T
  error?: string
  pagination?: {
    page: number
    totalPages: number
    totalDocs: number
  }
}

interface UserResponse extends ApiResponse<User> {}

async function fetchUser(id: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

## Additional Context

- Always define explicit interfaces for props and data structures
- Use union types for limited sets of values (`'admin' | 'editor' | 'viewer'`)
- Create generic interfaces for reusable patterns (`ApiResponse<T>`)
- Leverage PayloadCMS generated types for collection data
- Use `unknown` instead of `any` when you must accept any type
- Add return types to all functions, even when TypeScript can infer them