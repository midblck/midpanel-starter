# Development Guidelines

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   │   ├── layout.tsx     # Frontend layout
│   │   └── page.tsx       # Homepage
│   ├── (payload)/         # PayloadCMS admin & API
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── collections/           # PayloadCMS collections
├── lib/                  # Utilities and configurations
└── types/                # TypeScript definitions
```

## 🛠️ Development Rules

### 1. Code Organization

- **KISS Principle**: Keep components simple and focused
- **DRY Principle**: Extract common patterns into utilities
- **Single Responsibility**: One component, one purpose
- **Consistent Naming**: Use clear, descriptive names

### 2. Component Guidelines

```typescript
// ✅ Good component structure
interface UserCardProps {
  user: User
  onEdit: (userId: string) => void
  variant?: 'default' | 'compact'
}

export function UserCard({ user, onEdit, variant = 'default' }: UserCardProps) {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false)

  // 2. Event handlers
  const handleEdit = () => {
    setIsLoading(true)
    onEdit(user.id)
  }

  // 3. Render
  return (
    <Card className={cn('w-full', variant === 'compact' && 'p-2')}>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEdit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Edit'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 3. PayloadCMS Integration

```typescript
// ✅ Server-side data fetching
export default async function UserPage() {
  const payload = await getPayload({ config: payloadConfig })
  const { docs: users } = await payload.find({
    collection: 'users',
    where: { status: { equals: 'active' } },
    limit: 10,
  })

  return <UserList users={users} />
}

// ✅ API route
export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const { docs } = await payload.find({ collection: 'users' })
    return Response.json({ users: docs })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
```

### 4. Styling with Tailwind CSS

```typescript
// ✅ Use design tokens
<div className="bg-background text-foreground border border-border">
  <h1 className="text-2xl font-bold text-primary">Title</h1>
</div>

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// ✅ Conditional classes with cn utility
<Button
  className={cn(
    'w-full',
    variant === 'outline' && 'border-2',
    isLoading && 'opacity-50'
  )}
>
  {children}
</Button>
```

## 🎨 shadcn/ui Usage

### Installing Components

```bash
# Install a new component
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
```

### Using Components

```typescript
// ✅ Proper component usage
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function UserDialog({ user }: { user: User }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit User</Button>
      </DialogTrigger>
      <DialogContent>
        <Card>
          <CardHeader>
            <CardTitle>Edit {user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Form content */}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
```

## 🔧 TypeScript Best Practices

### Type Definitions

```typescript
// ✅ Use PayloadCMS generated types
import type { User, Media, Post } from '@/payload-types';

// ✅ Create specific interfaces
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  variant?: 'default' | 'compact';
}

// ✅ Use utility types
type UserUpdateData = Partial<Pick<User, 'name' | 'email'>>;
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### Generic Components

```typescript
// ✅ Generic list component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={keyExtractor(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
```

## 🚀 Performance Optimization

### Image Optimization

```typescript
// ✅ Optimized images
import Image from 'next/image'

<Image
  src={user.avatar}
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
  priority={false} // Only true for above-the-fold images
/>
```

### Code Splitting

```typescript
// ✅ Lazy load heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Only if component doesn't need SSR
})
```

## 🧪 Testing Guidelines

### Component Testing

```typescript
// ✅ Test component behavior
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './user-card'

test('renders user information and handles edit', () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }
  const mockOnEdit = jest.fn()

  render(<UserCard user={mockUser} onEdit={mockOnEdit} />)

  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('john@example.com')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Edit'))
  expect(mockOnEdit).toHaveBeenCalledWith('1')
})
```

## 🔍 Code Review Checklist

Before submitting code:

- [ ] Components are properly typed with TypeScript
- [ ] PayloadCMS data fetching is server-side when possible
- [ ] shadcn/ui components are used correctly
- [ ] Tailwind classes follow design system
- [ ] Error handling is implemented
- [ ] Accessibility attributes are present
- [ ] Performance optimizations are applied
- [ ] Code follows DRY and KISS principles
- [ ] File structure is consistent

## 🎯 Common Patterns

### Avatar Generation

```typescript
const generateAvatarUrl = (name: string, size = 40) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&color=fff&bold=true&format=png`;
```

### Class Name Utility

```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  props.className
);
```

### PayloadCMS Data Fetching

```typescript
const payload = await getPayload({ config: payloadConfig });
const { docs } = await payload.find({
  collection: 'collection-name',
  where: { field: { equals: 'value' } },
});
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

Remember: Keep it simple, maintain consistency, and prioritize developer experience!
