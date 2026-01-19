# payload-relationship-fields

Use proper relationship field configurations for data connections.

## Why It Matters

Proper relationships enable:
- Efficient data querying with joins
- Type-safe relationships in TypeScript
- Automatic population of related data
- Proper cascading deletes and updates
- Flexible data modeling for complex applications

## Incorrect Example

```typescript
// ❌ Bad: Manual relationship handling
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'authorId',
      type: 'number', // Manual ID storage
      required: true,
    },
    {
      name: 'categoryIds',
      type: 'json', // Array of IDs as JSON
    },
  ],
}

// ❌ Bad: Incorrect relationship configuration
export const Comments: CollectionConfig = {
  slug: 'comments',
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts', // Should be array for multiple relations
    },
  ],
}
```

## Correct Example

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
      admin: {
        description: 'The author of this post',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true, // Multiple categories
      admin: {
        description: 'Categories this post belongs to',
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Featured image for this post',
      },
    },
  ],
}

// ✅ CORRECT: Bidirectional relationships
export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        readOnly: true, // Auto-populated
        description: 'Posts in this category',
      },
    },
  ],
}
```

## Additional Context

- Use `relationship` field type instead of manual ID storage
- Set `relationTo` to the target collection slug
- Use `hasMany: true` for one-to-many relationships
- Use `required: true` for mandatory relationships
- Configure admin settings for better UX
- Relationships are automatically typed in generated types
- Use `depth` parameter in queries to populate relationships