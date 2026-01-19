# component-reusable-patterns

Extract reusable components when used 3+ times and follow proper patterns for component reusability.

## Why It Matters

Reusable components provide:
- Consistent UI patterns across the application
- Reduced code duplication
- Easier maintenance and updates
- Better testing coverage
- Improved development velocity

## Incorrect Example

```typescript
// ❌ Bad: Duplicate component logic
export function UserList() {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="p-4 border rounded">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}

export function PostList() {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}

// ❌ Bad: Over-extracted single-use component
export function StatusBadge({ status }: { status: string }) {
  return <span className="px-2 py-1 rounded text-xs">{status}</span>
}
// Used only once - not worth extracting
```

## Correct Example

```typescript
// ✅ CORRECT: Reusable data display component
interface DataCardProps<T> {
  item: T
  renderTitle: (item: T) => React.ReactNode
  renderContent: (item: T) => React.ReactNode
  onClick?: (item: T) => void
}

export function DataCard<T>({
  item,
  renderTitle,
  renderContent,
  onClick
}: DataCardProps<T>) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick?.(item)}
    >
      <CardHeader>
        <CardTitle>{renderTitle(item)}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent(item)}
      </CardContent>
    </Card>
  )
}

// ✅ CORRECT: Specific implementations using the reusable component
export function UserList({ users, onUserClick }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <DataCard
          key={user.id}
          item={user}
          renderTitle={(user) => user.name}
          renderContent={(user) => (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          )}
          onClick={onUserClick}
        />
      ))}
    </div>
  )
}

export function PostList({ posts, onPostClick }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <DataCard
          key={post.id}
          item={post}
          renderTitle={(post) => post.title}
          renderContent={(post) => (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={post.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          )}
          onClick={onPostClick}
        />
      ))}
    </div>
  )
}

// ✅ CORRECT: Reusable status badge (used multiple times)
export function StatusBadge({ status }: { status: PostStatus }) {
  const variants = {
    draft: 'secondary',
    published: 'default',
    archived: 'outline',
  } as const

  return (
    <Badge variant={variants[status] || 'secondary'}>
      {status}
    </Badge>
  )
}
```

## Additional Context

- Extract components when used in 3+ different places
- Use generic types for flexible reusable components
- Create render prop patterns for customizable content
- Keep component APIs simple and focused
- Consider composition over complex prop drilling
- Use TypeScript generics for type-safe reusable components