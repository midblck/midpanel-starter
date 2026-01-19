import type { CollectionConfig } from 'payload';

export const TaskType: CollectionConfig = {
  slug: 'task-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'color', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      defaultValue: '#6B7280',
      validate: (val: string | null | undefined) => {
        // Basic hex color validation
        if (val && !/^#[0-9A-F]{6}$/i.test(val)) {
          return 'Please enter a valid hex color (e.g., #6B7280)';
        }
        return true;
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
  timestamps: true,
};
