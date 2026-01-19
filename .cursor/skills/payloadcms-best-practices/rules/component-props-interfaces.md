# component-props-interfaces

Define clear prop interfaces for components with proper TypeScript typing.

## Why It Matters

Clear prop interfaces provide:
- Type safety and compile-time error checking
- Better IDE support and autocomplete
- Self-documenting component APIs
- Easier refactoring and maintenance
- Prevention of prop-related runtime errors

## Incorrect Example

```typescript
// ❌ Bad: No prop interfaces
export function UserCard(user) { // Missing types
  return (
    <Card>
      <div>{user.name}</div>
      <div>{user.email}</div>
    </Card>
  )
}

// ❌ Bad: Any types in props
export function PostCard({ post }: { post: any }) { // Too generic
  return (
    <Card>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </Card>
  )
}

// ❌ Bad: Missing optional props
export function Button({ children, variant, size, onClick }) {
  // No type definitions, unclear which props are optional
  return <button>{children}</button>
}
```

## Correct Example

```typescript
// ✅ CORRECT: Clear prop interfaces with proper typing
interface UserCardProps {
  user: User
  variant?: 'default' | 'compact'
  showEmail?: boolean
  onClick?: (user: User) => void
}

export function UserCard({
  user,
  variant = 'default',
  showEmail = true,
  onClick
}: UserCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors",
        variant === 'compact' ? 'p-2' : 'p-4',
        onClick && "hover:bg-muted/50"
      )}
      onClick={() => onClick?.(user)}
    >
      <CardHeader className={variant === 'compact' ? 'p-2' : 'p-4'}>
        <CardTitle className={variant === 'compact' ? 'text-sm' : 'text-lg'}>
          {user.name}
        </CardTitle>
      </CardHeader>
      {showEmail && (
        <CardContent className={variant === 'compact' ? 'p-2 pt-0' : 'p-4 pt-0'}>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardContent>
      )}
    </Card>
  )
}

// ✅ CORRECT: Complex component with well-defined props
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  loading?: boolean
  error?: string
  onRowClick?: (item: T) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

interface ColumnDefinition<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], item: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error,
  onRowClick,
  onSort,
  pagination
}: DataTableProps<T>) {
  // Implementation with full type safety
}
```

## Additional Context

- Always define explicit interfaces for component props
- Use optional props with `?:` for non-required properties
- Provide sensible defaults for optional props
- Use union types for limited value sets (`'default' | 'compact'`)
- Leverage PayloadCMS generated types for data props
- Consider using `React.ComponentProps` for extending HTML element props
- Keep interfaces focused and not overly complex