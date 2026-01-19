import type { CollectionConfig, CollectionSlug } from 'payload';
import { statusAccess } from '@/lib/access';

export const TaskStatuses: CollectionConfig = {
  slug: 'task-statuses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'color', 'order', 'createdAt'],
  },
  access: {
    read: statusAccess,
    create: statusAccess,
    update: statusAccess,
    delete: statusAccess,
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
      maxLength: 20,
      defaultValue: '#6B7280',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users' as CollectionSlug,
      required: true,
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
};
