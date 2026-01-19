# kiss-avoid-over-engineering

Keep It Simple, Stupid - prefer simple solutions over complex ones. Avoid over-engineering and unnecessary abstractions when a simple solution works.

## Why It Matters

Simple solutions provide:
- Easier maintenance and debugging
- Better readability and understanding
- Faster development and iteration
- Reduced chance of introducing bugs
- Lower cognitive load for other developers

## Incorrect Example

```typescript
// ❌ Bad: Over-engineered with unnecessary abstractions
interface IUserServiceFactory {
  createUserService(): IUserService
}

class UserServiceFactory implements IUserServiceFactory {
  private dependencyInjector: DependencyInjector

  constructor(di: DependencyInjector) {
    this.dependencyInjector = di
  }

  createUserService(): IUserService {
    return new UserService(
      this.dependencyInjector.getRepository(),
      this.dependencyInjector.getCache(),
      this.dependencyInjector.getLogger()
    )
  }
}

// ❌ Bad: Unnecessary wrapper, complex state management
class UserStateManager {
  private state: UserState
  private observers: Observer[]

  setUser(user: User) {
    this.state = { ...this.state, user }
    this.notifyObservers()
  }

  private notifyObservers() {
    this.observers.forEach(obs => obs.update(this.state))
  }
}

// ❌ Bad: Premature optimization, complex caching
class UserCacheManager {
  private cache: Map<string, CachedUser>
  private ttl: number
  private refreshStrategy: RefreshStrategy

  async getUser(id: string): Promise<User> {
    if (this.cache.has(id) && !this.isExpired(id)) {
      return this.cache.get(id)!.data
    }
    // ... complex refresh logic
  }
}
```

## Correct Example

```typescript
// ✅ CORRECT: Simple, direct solution
export async function getUser(id: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'users',
    where: { id: { equals: id } },
    limit: 1,
  })
  return docs[0] || null
}

// ✅ CORRECT: Simple React state for straightforward use cases
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export function UserProfile() {
  const { user } = useAuth()
  return <div>{user?.name}</div>
}

// ✅ CORRECT: Simple component without over-abstraction
export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
      </CardContent>
    </Card>
  )
}
```

## Additional Context

- **Start Simple**: Write the simplest solution that works first
- **Add Complexity Only When Needed**: Don't anticipate future needs that may never come
- **Question Abstractions**: Always ask "Do I really need this abstraction?"
- **Use Built-ins First**: PayloadCMS, Next.js, and React have built-in solutions for most needs
- **Avoid Premature Optimization**: Optimize only when you have a proven performance problem
- **Simple > Complex**: Choose the simpler solution unless complexity provides clear benefits