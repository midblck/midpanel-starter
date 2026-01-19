# payload-collection-structure

Follow proper collection configuration patterns with proper field types and validation.

## Why It Matters

Well-structured collections provide:
- Type safety with generated TypeScript types
- Proper data validation and sanitization
- Consistent admin panel experience
- Efficient database queries and indexing
- Scalable data relationships and access control

## Incorrect Example

```typescript
// ❌ Bad: Poor collection structure
export const Users: CollectionConfig = {
  slug: 'users',
  fields: [
    {
      name: 'name',
      type: 'text',
      // Missing required validation
    },
    {
      name: 'email',
      type: 'text', // Wrong field type
      // No uniqueness constraint
    },
    {
      name: 'role',
      type: 'text', // Should be select with options
    },
  ],
  // Missing auth configuration
}

// ❌ Bad: No admin customization
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'textarea' },
  ],
  // No admin configuration for better UX
}
```

## Correct Example

```typescript
// ✅ CORRECT: Well-structured collection
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Enable authentication
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
      unique: true, // Ensure unique emails
      validate: (value: string) => {
        if (!value.includes('@')) return 'Must be a valid email'
        return true
      },
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'viewer'],
      defaultValue: 'viewer',
      required: true,
    },
  ],
  admin: {
    useAsTitle: 'name', // Display name in admin panel
    group: 'User Management', // Group in admin navigation
  },
}

// ✅ CORRECT: Rich collection configuration
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
}
```

## Additional Context

- Always specify `slug` as the collection identifier
- Use appropriate field types (`email`, `select`, `relationship`, etc.)
- Add validation for data integrity
- Configure `admin` settings for better UX
- Use `defaultValue` for select fields
- Enable `auth` for user collections
- Consider using `timestamps: true` for audit trails