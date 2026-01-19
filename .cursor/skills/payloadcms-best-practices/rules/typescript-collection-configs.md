# typescript-collection-configs

Type collection configurations properly using PayloadCMS types.

## Why It Matters

Properly typed collections provide:
- Type safety in collection configurations
- Better IDE support and autocomplete
- Compile-time validation of field configurations
- Consistent typing across the application
- Prevention of configuration errors

## Incorrect Example

```typescript
// ❌ Bad: Untyped collection configuration
export const Users = {
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
  ],
}

// ❌ Bad: Missing type imports
export const Posts = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText', // Not validated
    },
  ],
}
```

## Correct Example

```typescript
// ✅ CORRECT: Properly typed collection configuration
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
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      validate: (value: string) => {
        if (!value.includes('@')) return 'Must be a valid email'
        return true
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      defaultValue: 'viewer',
      required: true,
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'User Management',
  },
}

// ✅ CORRECT: Complex collection with proper typing
import { CollectionConfig } from 'payload/types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the post',
      },
    },
    {
      name: 'content',
      type: 'richText',
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
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'archived'],
      defaultValue: 'draft',
    },
  ],
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
}
```

## Additional Context

- Always import `CollectionConfig` from 'payload/types'
- Explicitly type your collection exports with `: CollectionConfig`
- Field validation functions receive proper types
- Use PayloadCMS field types correctly for type safety
- Admin configuration gets proper typing support
- Generated types will reflect your collection structure