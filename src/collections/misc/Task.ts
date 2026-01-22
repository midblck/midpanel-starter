import type { CollectionConfig, CollectionSlug } from 'payload';
import { taskAccess } from '@/lib/access';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { groups } from '@/lib/groups';

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    plural: { en: 'Tasks', id: 'Task' },
    singular: { en: 'Task', id: 'Task' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'status',
      'priority',
      'assignee',
      'dueDate',
      'createdAt',
    ],
    group: groups.misc,
  },
  access: {
    read: taskAccess,
    create: taskAccess,
    update: taskAccess,
    delete: taskAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'status',
      type: 'relationship',
      relationTo: 'task-statuses' as CollectionSlug,
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Critical',
          value: 'critical',
        },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'assignee',
      type: 'text',
      maxLength: 50,
    },
    {
      name: 'dueDate',
      type: 'date',
    },
    {
      name: 'taskTypes',
      type: 'relationship',
      relationTo: 'task-types' as CollectionSlug,
      hasMany: true,
      hooks: {
        beforeChange: [
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          async ({ value, req }) => {
            // If no task types are provided, auto-assign the "General" task type
            if (!value || (Array.isArray(value) && value.length === 0)) {
              try {
                const payload = await getPayload({ config: configPromise });
                const { docs: taskTypes } = await payload.find({
                  collection: 'task-types',
                  where: {
                    name: { equals: 'General' },
                  },
                  limit: 1,
                });

                if (taskTypes.length > 0) {
                  return [taskTypes[0].id];
                }
              } catch (error) {
                console.error(
                  'Failed to auto-assign General task type:',
                  error
                );
              }
            }
            return value as string[];
          },
        ],
      },
    },
    {
      name: 'order',
      type: 'number',
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
