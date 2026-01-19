# payload-upload-configuration

Configure upload fields and media collections properly for optimal file handling, performance, and user experience.

## Why It Matters

Proper upload configuration ensures:
- File security and validation
- Optimized storage and serving
- Rich media management experience
- Performance optimization for large files
- Proper image processing and resizing
- Access control for media files

## Incorrect Example

```typescript
// ❌ Bad: Basic upload without configuration
export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // Minimal configuration
  fields: [
    { name: 'alt', type: 'text' },
  ],
}

// ❌ Bad: No file restrictions or processing
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      // No restrictions on file types or sizes
    },
  ],
}

// ❌ Bad: No image optimization
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Missing image processing
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
}
```

## Correct Example

```typescript
// ✅ CORRECT: Comprehensive media collection
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // File restrictions
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    crop: true, // Enable cropping in admin

    // Image processing
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        crop: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        crop: 'center',
      },
    ],

    // File naming and organization
    prefix: '{date}',
    formatOptions: {
      format: 'webp',
      options: { quality: 85 },
    },
  },
  access: {
    read: () => true, // Public media access
    create: ({ req: { user } }) => !!user, // Auth required to upload
    update: ({ req: { user }, doc }) => {
      // Users can update their own uploads, admins can update any
      return doc?.uploadedBy === user?.id || user?.role === 'admin'
    },
    delete: ({ req: { user }, doc }) => {
      // Only admins can delete media
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption text',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photo credit or source',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who uploaded this file',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Set uploadedBy automatically
        if (req.user && !data.uploadedBy) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },
}

// ✅ CORRECT: Upload fields with proper configuration
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: {
          contains: 'image',
        },
      },
      admin: {
        description: 'Main product image (will be resized automatically)',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Additional product images',
      },
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          in: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        },
      },
      admin: {
        description: 'Product manuals or specifications (PDF/DOC only)',
      },
    },
  ],
}
```

## Additional Context

**Upload Configuration Options:**
- `mimeTypes` - Array of allowed MIME types
- `maxSize` - Maximum file size in bytes
- `crop` - Enable cropping in admin UI
- `imageSizes` - Automatic image resizing configurations
- `formatOptions` - Output format and quality settings
- `prefix` - File naming prefix (e.g., date-based)
- `staticDir` - Custom upload directory

**Image Processing:**
- Define multiple sizes for different use cases
- Use appropriate crop modes ('center', 'top', 'bottom')
- Configure output formats (webp, jpeg, png)
- Set quality levels for optimization

**Access Control:**
- Public read access for media files
- Authenticated create access
- Owner or admin update permissions
- Restricted delete permissions

**Best Practices:**
- Validate file types and sizes
- Implement proper access control
- Use descriptive alt text
- Optimize images for web delivery
- Consider CDN integration for production
- Implement proper error handling for uploads