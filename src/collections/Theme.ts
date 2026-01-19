import type { CollectionConfig } from 'payload';

export const Theme: CollectionConfig = {
  slug: 'themes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isDefault', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Display name for the theme',
      },
    },
    {
      name: 'codeCSS',
      type: 'code',
      required: true,
      admin: {
        language: 'css',
        description: 'Complete CSS with :root and .dark selectors',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set as the default theme for new users',
      },
    },
  ],
  timestamps: true,
};
