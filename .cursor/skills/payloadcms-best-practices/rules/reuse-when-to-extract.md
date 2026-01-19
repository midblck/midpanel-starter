# reuse-when-to-extract

Extract reusable code only when it truly adds value. Don't extract code just to reduce duplication - consider complexity, readability, and actual reuse patterns.

## Why It Matters

Proper reusability decisions ensure:
- Code remains readable and maintainable
- Abstractions add value rather than complexity
- Components and utilities are genuinely reusable
- Development velocity is maintained
- Technical debt is minimized

## Incorrect Example

```typescript
// ❌ Bad: Over-extraction - used only once
// utils/single-use-helper.ts
export function formatUserDisplayName(user: User): string {
  return user.name || 'Anonymous'
}

// ❌ Bad: Extracting simple logic that doesn't benefit from abstraction
// components/generic-list.tsx
interface GenericListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

export function GenericList<T>({ items, renderItem, emptyMessage }: GenericListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage || 'No items'}</div>
  }
  return <div>{items.map(renderItem)}</div>
}

// ❌ Bad: Complex generic component that's hard to understand
interface GenericCardRenderer<T extends Record<string, unknown>> {
  data: T
  renderer: (item: T) => React.ReactNode
  config: CardConfig<T>
  transformers?: Transformer<T>[]
}

export function GenericCard<T>({ data, renderer, config, transformers }: GenericCardRenderer<T>) {
  const transformed = transformers?.reduce((acc, t) => t(acc), data) ?? data
  return <Card className={config.className}>{renderer(transformed)}</Card>
}
```

## Correct Example

```typescript
// ✅ CORRECT: Extract when used 3+ times and adds value
// lib/utils/format-date.ts
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format === 'short'
    ? d.toLocaleDateString()
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ✅ CORRECT: Extract when pattern is complex and repeated
// components/user/user-card.tsx
interface UserCardProps {
  user: User
  variant?: 'default' | 'compact'
  showEmail?: boolean
}

export function UserCard({ user, variant = 'default', showEmail = false }: UserCardProps) {
  return (
    <Card className={variant === 'compact' ? 'p-2' : 'p-4'}>
      <div>{user.name}</div>
      {showEmail && <div className="text-sm text-muted-foreground">{user.email}</div>}
    </Card>
  )
}

// ✅ CORRECT: Simple inline logic when used only once or twice
export function UserProfile({ user }: { user: User }) {
  const displayName = user.name || 'Anonymous' // Simple, single-use
  return <Card>{displayName}</Card>
}
```

## Additional Context

**Extract when:**
- Code is used in 3+ places
- Logic is complex and would benefit from testing
- Pattern is clear and consistent
- Abstraction reduces complexity, not increases it

**Don't extract when:**
- Code is used only once or twice
- Extraction would make code harder to understand
- The abstraction doesn't add clear value
- Simple inline logic is clearer than an abstraction

**Reusability Checklist:**
- [ ] Is this code used in multiple places? (3+ times)
- [ ] Is the abstraction clear and easy to understand?
- [ ] Does it follow the same pattern consistently?
- [ ] Can it be easily tested?
- [ ] Does it reduce code duplication without adding complexity?