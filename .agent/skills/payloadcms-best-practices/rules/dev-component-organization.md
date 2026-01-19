# dev-component-organization

Structure components with clear separation of concerns, proper organization, and consistent patterns following React and TypeScript best practices.

## Why It Matters

Well-organized components provide:
- Clear separation of concerns between logic, UI, and data
- Easier testing and debugging
- Better maintainability and reusability
- Consistent code patterns across the project
- Improved developer experience

## Incorrect Example

```typescript
// ❌ Bad: Mixed concerns, unclear structure
export function UserCard({ user, onEdit }) {
  return <div>{/* everything mixed together */}</div>
}

// ❌ Bad: Logic mixed with JSX
export function UserList({ users }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      await deleteUser(id)
      // refresh logic here
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## Correct Example

```typescript
// ✅ CORRECT: Clear component structure
export function UserCard({ user, onEdit }: UserCardProps) {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false)

  // 2. Event handlers
  const handleEdit = () => {
    setIsLoading(true)
    onEdit(user.id).finally(() => setIsLoading(false))
  }

  // 3. Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Edit'}
        </Button>
      </CardContent>
    </Card>
  )
}

// ✅ CORRECT: Separated concerns
interface UserListProps {
  users: User[]
  onDelete: (id: string) => Promise<void>
  loading?: boolean
}

export function UserList({ users, onDelete, loading }: UserListProps) {
  if (loading) return <div>Loading users...</div>

  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onDelete}
        />
      ))}
    </div>
  )
}
```

## Additional Context

- **Hooks first**: Place all useState, useEffect, and other hooks at the top
- **Event handlers second**: Define event handler functions after hooks
- **Render last**: Keep JSX return statement at the bottom
- **Single responsibility**: Each component should have one clear purpose
- **Props interfaces**: Always define clear TypeScript interfaces for props
- **Consistent naming**: Use PascalCase for components, camelCase for props and functions