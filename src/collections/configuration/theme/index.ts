import type { CollectionConfig } from 'payload'
import { groups } from '@/lib/groups'

export const Theme: CollectionConfig = {
  slug: 'themes',
  labels: {
    plural: { en: 'Themes', id: 'Theme' },
    singular: { en: 'Theme', id: 'Theme' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isDefault', 'createdAt'],
    group: groups.configuration,
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
}
