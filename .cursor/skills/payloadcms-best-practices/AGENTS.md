# PayloadCMS Cursor Rules - Complete Guide

This document contains all PayloadCMS + Next.js + shadcn/ui Cursor Rules in a single compiled reference. Follow these guidelines to maintain code quality, consistency, and developer experience in your PayloadCMS project.

These rules are enriched from the project's .cursorrules file and comprehensive PayloadCMS best practices to provide complete coverage of development patterns and standards.

## Table of Contents

1. [PayloadCMS Built-ins (CRITICAL)](#payloadcms-built-ins-critical)
2. [TypeScript & Type Safety (HIGH)](#typescript--type-safety-high)
3. [Code Quality (HIGH)](#code-quality-high)
4. [File Naming Conventions (HIGH)](#file-naming-conventions-high)
5. [Performance (MEDIUM-HIGH)](#performance-medium-high)
6. [Component Architecture (MEDIUM)](#component-architecture-medium)
7. [Error Handling (MEDIUM)](#error-handling-medium)
8. [Accessibility & UX (LOW-MEDIUM)](#accessibility--ux-low-medium)
9. [Development Workflow (LOW)](#development-workflow-low)

---

## PayloadCMS Built-ins (CRITICAL)

### payload-builtin-functions

Always prioritize PayloadCMS built-in functions over custom implementations.

```typescript
// ✅ CORRECT: Use PayloadCMS built-in functions
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function UserPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 10,
  })

  return <UserList users={users} />
}

// ✅ CORRECT: Use PayloadCMS auth hooks
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export default function UserProfile() {
  const { user } = useAuth()
  return <div>{user?.name}</div>
}
```

### payload-auth-hooks

Use PayloadCMS authentication hooks for client-side auth state management.

```typescript
// ✅ CORRECT: Use useAuth hook
'use client'
import { useAuth } from '@payloadcms/next/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return <LoginButton />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{user.name}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### payload-collection-structure

Follow proper collection configuration patterns with proper field types and validation.

```typescript
// ✅ CORRECT: Well-structured collection
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'viewer'],
      defaultValue: 'viewer',
    },
  ],
  admin: {
    useAsTitle: 'name',
  },
}
```

### payload-relationship-fields

Use proper relationship field configurations for data connections.

```typescript
// ✅ CORRECT: Proper relationship fields
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
}
```

### payload-api-routes

Structure API routes using PayloadCMS patterns with proper error handling.

```typescript
// ✅ CORRECT: Use PayloadCMS in API routes
export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'users',
      where: { status: { equals: 'active' } },
    })

    return Response.json({ users: docs })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
```

---

## TypeScript & Type Safety (HIGH)

### typescript-generated-types

Use PayloadCMS generated types for type safety.

```typescript
// ✅ CORRECT: Use generated types
import type { User, Media, Post } from '@/payload-types'

interface UserCardProps {
  user: User
  variant?: 'default' | 'compact'
}

export function UserCard({ user, variant = 'default' }: UserCardProps) {
  return (
    <Card>
      <CardTitle>{user.name}</CardTitle>
      <CardContent>{user.email}</CardContent>
    </Card>
  )
}
```

### typescript-explicit-types

Avoid `any` types and use explicit interfaces.

```typescript
// ✅ CORRECT: Explicit types everywhere
interface ApiResponse<T> {
  data: T
  error?: string
  pagination?: {
    page: number
    totalPages: number
  }
}

interface UserFormData {
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

export async function updateUser(id: string, data: UserFormData): Promise<ApiResponse<User>> {
  // Implementation
}
```

### typescript-collection-configs

Type collection configurations properly.

```typescript
// ✅ CORRECT: Properly typed collection config
import { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      validate: (value: string) => {
        if (value.length < 2) return 'Name must be at least 2 characters'
        return true
      },
    },
  ],
}
```

### typescript-api-responses

Type API route responses and requests.

```typescript
// ✅ CORRECT: Typed API routes
import type { NextRequest } from 'next/server'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  user: User
  message: string
}

export async function POST(request: NextRequest) {
  const body: CreateUserRequest = await request.json()

  // Implementation

  const response: UserResponse = { user, message: 'User created' }
  return Response.json(response)
}
```

---

## Code Quality (HIGH)

### quality-linter-first

Always run linter and typecheck before making changes.

```bash
# ✅ CORRECT: Check before coding
pnpm lint
pnpm typecheck

# Make changes that pass validation

# ✅ CORRECT: Verify after changes
pnpm lint
pnpm typecheck
```

### quality-kiss-principle

Keep solutions simple - avoid over-engineering.

```typescript
// ✅ CORRECT: Simple solution
export async function getUser(id: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'users',
    where: { id: { equals: id } },
    limit: 1,
  })
  return docs[0] || null
}

// ❌ AVOID: Over-engineered solution
interface IUserService {
  getUser(id: string): Promise<User | null>
}

class UserService implements IUserService {
  constructor(private payload: Payload) {}

  async getUser(id: string): Promise<User | null> {
    // Complex implementation
  }
}
```

### quality-dry-principle

Don't repeat yourself, but don't over-extract.

```typescript
// ✅ CORRECT: Extract when used 3+ times
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// ✅ CORRECT: Don't extract single-use logic
export function UserCard({ user }: { user: User }) {
  const displayName = user.name || 'Anonymous' // Simple, single-use
  return <Card>{displayName}</Card>
}
```

### quality-constants-file

Use constants file for static data.

```typescript
// ✅ CORRECT: Constants in dedicated file
// lib/constants.ts
export const USER_ROLES = ['admin', 'editor', 'viewer'] as const
export const POST_STATUSES = ['draft', 'published', 'archived'] as const

export const FEATURES = [
  { id: 'auth', title: 'Authentication', description: 'Secure user authentication' },
  { id: 'cms', title: 'Content Management', description: 'Easy content editing' },
] as const
```

### quality-import-organization

Organize imports in proper order.

```typescript
// ✅ CORRECT: Organized imports
// 1. React and Next.js
import React from 'react'
import Image from 'next/image'
import { headers } from 'next/headers'

// 2. Third-party libraries
import { getPayload } from 'payload'

// 3. Internal utilities and types
import { cn } from '@/utilities/cn'
import type { User } from '@/payload-types'

// 4. Components
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/user-card'

// 5. Local imports
import { UserPageProps } from './types'
```

### logging-structured

Use structured logging instead of console.log/error/warn statements.

```typescript
// ✅ CORRECT: Structured logging with context
import { logInfo, logError, logDbError, logApiError } from '@/utilities/logger'

export async function createUser(data: UserData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await payload.create({
      collection: 'users',
      data,
    })

    logInfo('User created successfully', {
      component: 'UserService',
      action: 'create',
      userId: user.id,
    })
    return user
  } catch (error) {
    logDbError('create-user', error, {
      component: 'UserService',
      action: 'create',
      userData: data,
    })
    throw error
  }
}

// ✅ CORRECT: Request-scoped logging in API routes
import { createRequestLogger } from '@/utilities/logger'

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  try {
    requestLogger.info('Processing request', {
      component: 'API',
      action: 'GET /endpoint',
    })
    // ... logic
  } catch (error) {
    logApiError('/endpoint', 'GET', error, {
      component: 'API',
      action: 'GET /endpoint',
    })
  }
}

// ❌ Bad: Console logging
console.log('User created:', user.id)
console.error('Failed to create user:', error)
```

---

## File Naming Conventions (HIGH)

### file-naming-conventions

Use consistent file and folder naming conventions throughout the codebase to maintain readability and predictability.

#### File Naming Rules

**TSX Files (React Components): Always use kebab-case for TSX filenames:**

```typescript
// ✅ CORRECT
src/components/
├── rich-text-renderer.tsx
├── payload-redirects.tsx
├── user-profile-card.tsx
└── slug-component.tsx

// ❌ INCORRECT - PascalCase
src/components/
├── RichTextRenderer.tsx
├── PayloadRedirects.tsx
└── UserProfileCard.tsx
```

**TypeScript/JavaScript Files: Use kebab-case for multi-word filenames:**

```typescript
// ✅ CORRECT
src/lib/
├── generate-preview-path.ts
├── format-date-time.ts
├── validate-user-input.ts
└── handle-api-errors.ts

// ❌ INCORRECT - camelCase for files
src/lib/
├── generatePreviewPath.ts
├── formatDateTime.ts
└── validateUserInput.ts
```

**Directory Names: Use kebab-case for directory names:**

```typescript
// ✅ CORRECT
src/
├── collections/
│   ├── content/
│   │   ├── posts/
│   │   └── categories/
│   └── user/
│       ├── admins/
│       └── users/
├── components/
│   ├── ui/
│   ├── layout/
│   └── forms/
└── features/
    ├── user-auth/
    └── task-management/
```

#### Export Naming Rules

**Component Exports: Use PascalCase for React component exports (regardless of filename):**

```typescript
// ✅ CORRECT - kebab-case filename, PascalCase export
// slug-component.tsx
export const SlugComponent: React.FC<Props> = ({ ... }) => { ... }

// ✅ CORRECT - kebab-case filename, PascalCase export
// rich-text-renderer.tsx
export const RichTextRenderer: React.FC<Props> = ({ ... }) => { ... }
```

**Utility Function Exports: Use camelCase for utility function exports:**

```typescript
// ✅ CORRECT
// generate-preview-path.ts
export const generatePreviewPath = (params: Params) => { ... }

// ✅ CORRECT
// format-date-time.ts
export const formatDateTime = (date: Date) => { ... }
```

**Type/Interface Exports: Use PascalCase for TypeScript types and interfaces:**

```typescript
// ✅ CORRECT
export interface UserProfile { ... }
export type ApiResponse<T> = { ... }
export const USER_ROLES = { ... } as const
```

#### Import Path Consistency

**Relative Imports: Use relative imports with correct case sensitivity:**

```typescript
// ✅ CORRECT
import { RichTextRenderer } from '../components/rich-text-renderer'
import { generatePreviewPath } from '../../lib/generate-preview-path'

// ❌ INCORRECT - wrong case
import { RichTextRenderer } from '../components/RichTextRenderer'
```

**Absolute Imports: Use absolute imports with @/ alias and correct case:**

```typescript
// ✅ CORRECT
import { RichTextRenderer } from '@/components/rich-text-renderer'
import { generatePreviewPath } from '@/lib/generate-preview-path'

// ❌ INCORRECT - wrong case
import { RichTextRenderer } from '@/components/RichTextRenderer'
```

#### Special Cases

**Index Files: Use index.ts or index.tsx for barrel exports:**

```typescript
// ✅ CORRECT
src / components / ui / index.ts
src / lib / hooks / index.ts
```

**Test Files: Use .test.ts or .spec.ts suffix with same naming as source:**

```typescript
// ✅ CORRECT
src/
├── components/
│   ├── user-profile-card.tsx
│   └── user-profile-card.test.tsx
└── lib/
    ├── format-date-time.ts
    └── format-date-time.test.ts
```

#### Migration Guide

When renaming files to follow these conventions:

1. **Rename the file** using `git mv` to preserve history
2. **Update all imports** that reference the old filename
3. **Update any dynamic imports** or path references
4. **Test the changes** to ensure no broken imports

```bash
# Example migration
git mv RichTextRenderer.tsx rich-text-renderer.tsx
# Then update imports in all files that reference it
```

---

## Performance (MEDIUM-HIGH)

### performance-query-optimization

Optimize PayloadCMS queries with proper limits and field selection.

```typescript
// ✅ CORRECT: Optimized queries
export async function getUsersPage(page = 1) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'users',
    limit: 10,
    page,
    select: {
      // Only needed fields
      name: true,
      email: true,
      id: true,
    },
    sort: '-createdAt',
  })
}

// ✅ CORRECT: Filtered queries
export async function getActiveUsers() {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'users',
    where: {
      status: { equals: 'active' },
      role: { not_equals: 'banned' },
    },
    limit: 50,
  })
}
```

### performance-code-splitting

Use dynamic imports for heavy components.

```typescript
// ✅ CORRECT: Code splitting for admin panels
import dynamic from 'next/dynamic'

const AdminPanel = dynamic(
  () => import('@/components/AdminPanel'),
  {
    loading: () => <div>Loading admin panel...</div>,
    ssr: false, // Admin panels often need client-side only
  }
)

const UserManagement = dynamic(
  () => import('@/components/UserManagement'),
  { loading: () => <div>Loading...</div> }
)
```

### performance-static-data

Pre-compute static data in constants.

```typescript
// ✅ CORRECT: Static data in constants
// lib/constants.ts
export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export const SOCIAL_LINKS = [
  { platform: 'twitter', url: 'https://twitter.com/example' },
  { platform: 'github', url: 'https://github.com/example' },
] as const
```

### performance-image-optimization

Use Next.js Image component for media fields.

```typescript
// ✅ CORRECT: Optimized images
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface OptimizedImageProps {
  media: Media
  alt: string
  className?: string
}

export function OptimizedImage({ media, alt, className }: OptimizedImageProps) {
  return (
    <Image
      src={media.url}
      alt={alt}
      width={media.width}
      height={media.height}
      className={className}
      priority={false} // Set to true only for above-the-fold images
    />
  )
}
```

### performance-avatar-caching

Cache avatar generation utilities.

```typescript
// ✅ CORRECT: Cached avatar generation
// lib/avatar.ts
const avatarCache = new Map<string, string>()

export function generateAvatarUrl(email: string): string {
  if (avatarCache.has(email)) {
    return avatarCache.get(email)!
  }

  const hash = btoa(email.toLowerCase().trim()).slice(0, 16)
  const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${hash}`

  avatarCache.set(email, url)
  return url
}
```

---

## Component Architecture (MEDIUM)

### component-shadcn-integration

Properly integrate shadcn/ui components with PayloadCMS data.

```typescript
// ✅ CORRECT: shadcn/ui integration
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/payload-types'

interface UserCardProps {
  user: User
  onEdit?: () => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user.name}
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit} className="mt-2">
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

### component-organization

Structure components with clear separation of concerns.

```typescript
// ✅ CORRECT: Well-organized component
interface UserProfileProps {
  user: User
  isEditing: boolean
  onSave: (data: Partial<User>) => void
  onCancel: () => void
}

export function UserProfile({ user, isEditing, onSave, onCancel }: UserProfileProps) {
  // 1. Hooks
  const [formData, setFormData] = useState({ name: user.name, email: user.email })

  // 2. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // 3. Render
  return (
    <Card>
      {isEditing ? (
        <UserProfileForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      ) : (
        <UserProfileView user={user} onEdit={() => setIsEditing(true)} />
      )}
    </Card>
  )
}
```

### component-reusable-patterns

Extract reusable components when used 3+ times.

```typescript
// ✅ CORRECT: Reusable data table component
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
}

export function DataTable<T>({ data, columns, loading, onRowClick }: DataTableProps<T>) {
  if (loading) return <div>Loading...</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index} onClick={() => onRowClick?.(item)}>
            {columns.map(col => (
              <TableCell key={col.key}>{col.render(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### component-props-interfaces

Define clear prop interfaces for components.

```typescript
// ✅ CORRECT: Clear prop interfaces
interface UserFormProps {
  user?: User // Optional for create mode
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  errors?: Record<string, string>
}

interface UserFormData {
  name: string
  email: string
  role: User['role']
  avatar?: Media
}

export function UserForm({ user, onSubmit, onCancel, loading, errors }: UserFormProps) {
  // Implementation with proper TypeScript support
}
```

---

## Error Handling (MEDIUM)

### error-payload-operations

Handle PayloadCMS operation errors gracefully.

```typescript
// ✅ CORRECT: Error handling in Payload operations
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
      return { success: false, errors: error.data }
    }

    return { success: false, error: 'An unexpected error occurred' }
  }
}
```

### error-api-routes

Implement proper error handling in API routes.

```typescript
// ✅ CORRECT: API route error handling
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.email || !body.password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const result = await createUser(body)

    if (!result.success) {
      return Response.json({ error: result.error, details: result.errors }, { status: 400 })
    }

    return Response.json({ user: result.user }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### error-user-feedback

Provide meaningful error messages to users.

```typescript
// ✅ CORRECT: User-friendly error messages
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function UserForm() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      // Success handling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  )
}
```

### error-boundary-components

Use error boundaries for component failures.

```typescript
// ✅ CORRECT: Error boundary component
'use client'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} />
      }

      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}
```

---

## Accessibility & UX (LOW-MEDIUM)

### accessibility-form-labels

Ensure all form fields have proper labels.

```typescript
// ✅ CORRECT: Accessible form fields
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function UserForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">User Role</Label>
        <Select name="role">
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}
```

### accessibility-keyboard-navigation

Support keyboard navigation in admin panels.

```typescript
// ✅ CORRECT: Keyboard navigation support
'use client'
import { useEffect, useRef } from 'react'

export function UserTable({ users, onUserSelect }: UserTableProps) {
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tableRef.current) return

      const rows = tableRef.current.querySelectorAll('tbody tr')
      const currentRow = document.activeElement?.closest('tr')
      const currentIndex = Array.from(rows).indexOf(currentRow as HTMLTableRowElement)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          const nextRow = rows[currentIndex + 1] as HTMLTableRowElement
          nextRow?.focus()
          break
        case 'ArrowUp':
          e.preventDefault()
          const prevRow = rows[currentIndex - 1] as HTMLTableRowElement
          prevRow?.focus()
          break
        case 'Enter':
          e.preventDefault()
          if (currentRow) {
            const userId = currentRow.dataset.userId
            if (userId) onUserSelect(userId)
          }
          break
      }
    }

    tableRef.current?.addEventListener('keydown', handleKeyDown)
    return () => tableRef.current?.removeEventListener('keydown', handleKeyDown)
  }, [onUserSelect])

  return (
    <Table ref={tableRef} tabIndex={0}>
      {/* Table content */}
    </Table>
  )
}
```

### accessibility-loading-states

Provide loading states and feedback.

```typescript
// ✅ CORRECT: Loading states and feedback
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserList({ loading, users, error }: UserListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" role="status" aria-label="Loading users">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTitle>Failed to load users</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try Again
        </Button>
      </Alert>
    )
  }

  return (
    <div aria-label={`${users.length} users loaded`}>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

### accessibility-semantic-html

Use semantic HTML elements.

```typescript
// ✅ CORRECT: Semantic HTML
export function UserProfile({ user }: { user: User }) {
  return (
    <article className="user-profile">
      <header>
        <h1>{user.name}</h1>
        <p className="text-muted-foreground">{user.role}</p>
      </header>

      <section aria-labelledby="contact-info">
        <h2 id="contact-info">Contact Information</h2>
        <dl>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          {user.phone && (
            <>
              <dt>Phone</dt>
              <dd>{user.phone}</dd>
            </>
          )}
        </dl>
      </section>

      {user.bio && (
        <section aria-labelledby="bio">
          <h2 id="bio">Biography</h2>
          <p>{user.bio}</p>
        </section>
      )}

      <footer>
        <time dateTime={user.createdAt}>
          Member since {formatDate(user.createdAt)}
        </time>
      </footer>
    </article>
  )
}
```

---

## Development Workflow (LOW)

### workflow-build-commands

Use proper build commands for different scenarios.

```bash
# ✅ CORRECT: Development builds
pnpm dev                    # Start dev server
pnpm devsafe               # Clean dev build and start

# ✅ CORRECT: Production builds
pnpm build                 # Full production build (8GB memory)
pnpm build:fast           # Fast build (4GB memory)
pnpm start                # Start production server

# ✅ CORRECT: Utility commands
pnpm clean                # Clean all build directories
pnpm lint                 # Check linting
pnpm typecheck           # Check TypeScript
pnpm analyze             # Bundle analysis
```

### workflow-folder-structure

Maintain consistent folder structure.

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public pages
│   ├── (payload)/         # Payload admin & API
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── user/             # Feature components
├── collections/          # Payload collections
├── lib/                  # Utilities
│   ├── constants.ts      # App constants
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validations
├── types/                # TypeScript types
└── payload.config.ts     # Payload configuration
```

### workflow-naming-conventions

Follow naming conventions for files and components.

```typescript
// ✅ CORRECT: Naming conventions

// Component Exports: PascalCase (regardless of filename)
export function UserCard() {}
export function UserManagement() {}

// TSX Files: kebab-case
// components/user-card.tsx
// components/user-management.tsx
// components/rich-text-renderer.tsx

// Utilities: camelCase
// lib/format-date-time.ts
// lib/generate-preview-path.ts

// Types: PascalCase with suffixes
interface UserCardProps {}
type ApiResponse<T> = {}
type UserRole = 'admin' | 'editor' | 'viewer'

// Collections: PascalCase
export const Users: CollectionConfig = {}
export const Posts: CollectionConfig = {}

// Directory Names: kebab-case
// features/user-auth/
// components/ui/
// lib/url-conversion/
```

## Quick Reference

### Essential Patterns

```typescript
// 1. Always use PayloadCMS built-ins first
import { getPayload } from 'payload'
import { useAuth } from '@payloadcms/next/useAuth'
import configPromise from '@payload-config'

// 2. Use generated types
import type { User, Media } from '@/payload-types'

// 3. Linter and typecheck first
// pnpm lint && pnpm typecheck

// 4. KISS principle - simple solutions
export async function getUser(id: string) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({ collection: 'users', where: { id: { equals: id } } })
}

// 5. Constants for static data
import { USER_ROLES, FEATURES } from '@/lib/constants'

// 6. shadcn/ui integration
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
```

### Key Principles

- **PayloadCMS Built-ins** > Custom implementations
- **Generated Types** > Manual type definitions
- **Linter/Typecheck** > Ignoring errors
- **Simple Solutions** > Complex abstractions
- **DRY When Needed** > Premature extraction
- **shadcn/ui Variants** > Custom styling
- **Error Boundaries** > Silent failures
- **Accessible by Default** > Accessibility as afterthought

### Development Checklist

- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] Used PayloadCMS built-in functions
- [ ] Applied KISS principle (no over-engineering)
- [ ] Used generated types, no `any` types
- [ ] Proper error handling implemented
- [ ] Structured logging used (no console.log/error/warn)
- [ ] shadcn/ui components used correctly
- [ ] Accessible markup and keyboard navigation
- [ ] Optimized queries with limits and select
- [ ] Static data in constants file
- [ ] Code split heavy components

---

## PayloadCMS Fields (HIGH)

### payload-field-types

Use appropriate PayloadCMS field types and configurations for optimal data modeling.

```typescript
// ✅ CORRECT: Proper field types for data modeling
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

---

## PayloadCMS Access Control (CRITICAL)

### payload-access-control

Implement proper access control patterns for secure PayloadCMS applications.

```typescript
// ✅ CORRECT: Comprehensive access control
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: ({ req: { user }, id }) => {
      if (!user) return false
      return user.id === id || user.role === 'admin'
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user }, id }) => {
      if (!user) return false
      return user.id === id || user.role === 'admin'
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'salary',
      type: 'number',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
```

---

## PayloadCMS Hooks (HIGH)

### payload-collection-hooks

Use PayloadCMS collection hooks for business logic and side effects.

```typescript
// ✅ CORRECT: Business logic in collection hooks
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'status', type: 'select', options: ['draft', 'published'] },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Generate slug from title
        if (data.title && !data.slug) {
          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        // Send notifications for published posts
        if (doc.status === 'published' && previousDoc?.status !== 'published') {
          await sendNotification(doc.author, 'Post published')
        }
      },
    ],
  },
}
```

---

## PayloadCMS Upload (MEDIUM)

### payload-upload-configuration

Configure upload fields and media collections properly.

```typescript
// ✅ CORRECT: Comprehensive media collection
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        crop: 'center',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
```

---

## PayloadCMS Admin (MEDIUM)

### payload-admin-customization

Customize PayloadCMS admin panels for optimal content management experience.

```typescript
// ✅ CORRECT: Well-organized admin interface
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
    group: 'Content Management',
    components: {
      views: {
        Edit: {
          Component: CustomPostEditView,
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'SEO-friendly title',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'archived'],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
```

## Quick Reference

### Essential Patterns

```typescript
// 1. Always use PayloadCMS built-ins first
import { getPayload } from 'payload'
import { useAuth } from '@payloadcms/next/useAuth'
import configPromise from '@payload-config'

// 2. Use generated types
import type { User, Media } from '@/payload-types'

// 3. Linter and typecheck first
// pnpm lint && pnpm typecheck

// 4. KISS principle - simple solutions
export async function getUser(id: string) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({ collection: 'users', where: { id: { equals: id } } })
}

// 5. Constants for static data
import { USER_ROLES, FEATURES } from '@/lib/constants'

// 6. shadcn/ui integration
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
```

### Key Principles

- **PayloadCMS Built-ins** > Custom implementations
- **Generated Types** > Manual type definitions
- **Linter/Typecheck** > Ignoring errors
- **Simple Solutions** > Complex abstractions
- **DRY When Needed** > Premature extraction
- **shadcn/ui Variants** > Custom styling
- **Error Boundaries** > Silent failures
- **Accessible by Default** > Accessibility as afterthought

### Development Checklist

- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] Used PayloadCMS built-in functions
- [ ] Applied KISS principle (no over-engineering)
- [ ] Used generated types, no `any` types
- [ ] Proper error handling implemented
- [ ] Structured logging used (no console.log/error/warn)
- [ ] shadcn/ui components used correctly
- [ ] Accessible markup and keyboard navigation
- [ ] Optimized queries with limits and select
- [ ] Static data in constants file
- [ ] Code split heavy components
- [ ] Proper access control implemented
- [ ] Collection hooks used for business logic
- [ ] Upload fields properly configured
- [ ] Admin panel customized for UX

---

## Feature Architecture (MEDIUM)

### structure-feature-architecture

Use feature-based architecture to organize code by business domains and improve scalability.

```typescript
// ✅ CORRECT: Feature-based architecture
src/
├── features/             # Feature modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Feature-specific components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── protected-route.tsx
│   │   │   └── index.ts
│   │   ├── services/     # Feature business logic
│   │   │   ├── auth-api.ts
│   │   │   ├── identity.ts
│   │   │   └── index.ts
│   │   ├── hooks/        # Feature-specific hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-login.ts
│   │   │   └── index.ts
│   │   ├── context/      # React context providers
│   │   │   └── auth-context.tsx
│   │   ├── utils/        # Feature utilities
│   │   │   └── password-validation.ts
│   │   ├── types/        # Feature-specific types
│   │   │   └── auth.types.ts
│   │   ├── constants.ts  # Feature constants
│   │   ├── index.ts      # Feature barrel exports
│   │   └── README.md     # Feature documentation
│   ├── dashboard/        # Dashboard feature
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── products/         # Products feature
│       ├── components/
│       ├── services/
│       ├── hooks/
│       └── types/
├── components/          # Shared components
│   ├── ui/             # Design system (shadcn/ui)
│   └── common/         # Application-wide shared components
└── lib/                # Core utilities
    ├── hooks/          # Shared custom hooks
    ├── utils/          # Shared utilities
    └── constants/      # Global constants
```

## Quick Reference

### Essential Patterns

```typescript
// 1. Always use PayloadCMS built-ins first
import { getPayload } from 'payload'
import { useAuth } from '@payloadcms/next/useAuth'
import configPromise from '@payload-config'

// 2. Use generated types
import type { User, Media } from '@/payload-types'

// 3. Linter and typecheck first
// pnpm lint && pnpm typecheck

// 4. KISS principle - simple solutions
export async function getUser(id: string) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({ collection: 'users', where: { id: { equals: id } } })
}

// 5. Constants for static data
import { USER_ROLES, FEATURES } from '@/lib/constants'

// 6. shadcn/ui integration
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 7. Feature-based organization (for scaling)
import { LoginForm, useAuth } from '@/features/auth'
```

### Key Principles

- **PayloadCMS Built-ins** > Custom implementations
- **Generated Types** > Manual type definitions
- **Linter/Typecheck** > Ignoring errors
- **Simple Solutions** > Complex abstractions
- **DRY When Needed** > Premature extraction
- **Feature Architecture** > Monolithic structure (for scaling)
- **shadcn/ui Variants** > Custom styling
- **Error Boundaries** > Silent failures
- **Accessible by Default** > Accessibility as afterthought

### Development Checklist

- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] Used PayloadCMS built-in functions
- [ ] Applied KISS principle (no over-engineering)
- [ ] Used generated types, no `any` types
- [ ] Proper error handling implemented
- [ ] Structured logging used (no console.log/error/warn)
- [ ] shadcn/ui components used correctly
- [ ] Accessible markup and keyboard navigation
- [ ] Optimized queries with limits and select
- [ ] Static data in constants file
- [ ] Code split heavy components
- [ ] Proper access control implemented
- [ ] Collection hooks used for business logic
- [ ] Upload fields properly configured
- [ ] Admin panel customized for UX
- [ ] Feature-based architecture used for scalability
- [ ] Clean separation between shared and feature-specific code

Remember: PayloadCMS provides powerful built-in functionality. Use it first, build custom solutions only when necessary, and always keep solutions simple and maintainable. For larger applications, adopt feature-based architecture early to ensure long-term scalability.
