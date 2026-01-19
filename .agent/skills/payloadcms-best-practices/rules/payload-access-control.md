# payload-access-control

Implement proper access control patterns for secure PayloadCMS applications with field-level and document-level permissions.

## Why It Matters

Proper access control ensures:
- Data security and privacy
- Role-based permissions
- Field-level data protection
- Audit trails and compliance
- Prevention of unauthorized data access
- Scalable permission management

## Incorrect Example

```typescript
// ❌ Bad: No access control
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'salary', type: 'number' }, // Anyone can see salaries
    { name: 'ssn', type: 'text' }, // Sensitive data exposed
  ],
  // No access control - anyone can read/write
}

// ❌ Bad: Incomplete access control
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true, // Everyone can read
    // Missing create, update, delete permissions
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'isPublished', type: 'checkbox' },
  ],
}
```

## Correct Example

```typescript
// ✅ CORRECT: Comprehensive access control
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // Document-level access
    read: ({ req: { user } }) => {
      if (!user) return false
      // Users can read their own profile, admins can read all
      return user.id === 'id' || user.role === 'admin'
    },
    create: ({ req: { user } }) => {
      // Only admins can create users
      return user?.role === 'admin'
    },
    update: ({ req: { user }, id }) => {
      if (!user) return false
      // Users can update themselves, admins can update anyone
      return user.id === id || user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete users
      return user?.role === 'admin'
    },
  },
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
    },
    {
      name: 'salary',
      type: 'number',
      access: {
        // Field-level access - only admins can see salary
        read: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'ssn',
      type: 'text',
      access: {
        // Extremely sensitive - only specific admins
        read: ({ req: { user } }) => user?.role === 'super-admin',
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: ['user', 'editor', 'admin'],
      defaultValue: 'user',
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}

// ✅ CORRECT: Content management access control
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => {
      // Authenticated users can create posts
      return !!user
    },
    update: ({ req: { user }, doc }) => {
      if (!user) return false
      // Authors can update their own posts, editors can update any
      return doc.author === user.id || user.role === 'editor'
    },
    delete: ({ req: { user }, doc }) => {
      if (!user) return false
      // Only admins can delete posts
      return user.role === 'admin'
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'archived'],
      defaultValue: 'draft',
      access: {
        // Only editors and admins can publish
        update: ({ req: { user }, doc }) => {
          if (doc?.status === 'published') {
            return user?.role === 'editor' || user?.role === 'admin'
          }
          return true // Anyone can update drafts
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        // Author field is set automatically, can't be changed
        update: () => false,
      },
    },
  ],
}
```

## Additional Context

**Access Control Types:**
- **Document-level**: Controls CRUD operations on entire documents
- **Field-level**: Controls access to specific fields within documents
- **Global access**: Controls access to globals and admin UI

**Access Function Parameters:**
- `req` - Request object with user information
- `doc` - Document being accessed (for update/delete)
- `data` - Data being operated on (for create/update)
- `siblingData` - Other fields in the same document

**Best Practices:**
- Always check user authentication first
- Use role-based access control
- Implement principle of least privilege
- Test access control thoroughly
- Document permission requirements
- Use field-level access for sensitive data
- Consider performance impact of complex access rules