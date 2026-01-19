# lint-always-run

Always run linter and typecheck before making code changes. Ensure code passes `pnpm lint` and `pnpm typecheck` before proceeding with any development work.

## Why It Matters

Linter and typecheck validation ensures:
- Code quality and consistency across the project
- Early detection of potential runtime errors
- Adherence to project coding standards
- Prevention of common mistakes and anti-patterns
- Better developer experience with immediate feedback

## Incorrect Example

```typescript
// ❌ Bad: Writing code without checking linter/typecheck first
export function UserCard(props: any) {
  const unusedVariable = 'test' // Will cause linter warning: unused variable
  return <div>{props.user?.name}</div> // TypeScript error: implicit any
}

// ❌ Bad: Ignoring existing lint/typecheck errors
async function fetchUser(id) { // Missing parameter type
  const result = await fetch(`/api/users/${id}`) // TypeScript error: any type
  return result.json() // Unsafe return type
}
```

## Correct Example

```typescript
// ✅ CORRECT: Run pnpm lint and pnpm typecheck first
// 1. Check existing errors: pnpm lint && pnpm typecheck
// 2. Write code that passes validation
// 3. Verify after changes: pnpm lint && pnpm typecheck

interface UserCardProps {
  user: User
  variant?: 'default' | 'compact'
}

export function UserCard({ user, variant = 'default' }: UserCardProps) {
  // No unused variables, proper TypeScript types
  return (
    <Card className={variant === 'compact' ? 'p-2' : 'p-4'}>
      <div>{user.name}</div>
    </Card>
  )
}

// ✅ CORRECT: Proper async function with types
async function fetchUser(id: string): Promise<User | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'users',
    where: { id: { equals: id } },
    limit: 1,
  })
  return docs[0] || null
}
```

## Additional Context

- **CRITICAL**: Run `pnpm lint` to check for code style and potential bugs before any changes
- **CRITICAL**: Run `pnpm typecheck` to verify TypeScript types are correct
- Fix all linter and typecheck errors before committing code
- Use the linter as a development tool, not just a gatekeeper
- Set up your IDE to show linter errors in real-time for immediate feedback
- Integrate linting into your development workflow to catch issues early