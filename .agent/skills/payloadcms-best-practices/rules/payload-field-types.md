# payload-field-types

Use appropriate PayloadCMS field types and configurations for optimal data modeling, validation, and admin experience.

## Why It Matters

Proper field types ensure:
- Data integrity and validation
- Optimal database storage and querying
- Rich admin panel editing experience
- Type-safe generated TypeScript interfaces
- Proper handling of complex data structures

## Incorrect Example

```typescript
// ❌ Bad: Wrong field types for data
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text', // Fine for simple strings
    },
    {
      name: 'price',
      type: 'text', // Should be number for calculations
    },
    {
      name: 'description',
      type: 'text', // Should be richText for formatted content
    },
    {
      name: 'images',
      type: 'relationship', // Should be upload for media files
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'text', // Should be array for multiple values
    },
    {
      name: 'isActive',
      type: 'text', // Should be checkbox for boolean
    },
  ],
}
```

## Correct Example

```typescript
// ✅ CORRECT: Proper field types for data modeling
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product display name',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in USD',
        step: 0.01,
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true, // Multiple images
      required: true,
      admin: {
        description: 'Product images',
      },
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
      ],
      admin: {
        description: 'Product categories',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this product active?',
        position: 'sidebar',
      },
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'weight',
          type: 'number',
          admin: {
            description: 'Weight in grams',
          },
        },
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            { name: 'length', type: 'number' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'SEO tags',
      },
    },
  ],
}
```

## Additional Context

**Common Field Types:**
- `text` - Single line text, with optional `maxLength`
- `textarea` - Multi-line text
- `richText` - Rich text editor with formatting
- `number` - Numeric values with `min`, `max`, `step`
- `date` - Date picker
- `upload` - File/media uploads
- `relationship` - Links to other collections
- `select` - Dropdown with predefined options
- `radio` - Radio button group
- `checkbox` - Boolean values
- `array` - Repeating field groups
- `group` - Logical grouping of fields
- `tabs` - Tabbed interface for complex forms

**Field Configuration Best Practices:**
- Use `required: true` for mandatory fields
- Add `admin.description` for better UX
- Use `admin.position: 'sidebar'` for important fields
- Configure validation with `min`, `max`, `validate` functions
- Use `defaultValue` for better user experience
- Consider `hidden: true` for system fields
- Use `admin.readOnly: true` for computed fields