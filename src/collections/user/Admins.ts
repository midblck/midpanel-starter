import type { CollectionConfig } from 'payload';
import { groups } from '@/lib/groups';

export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: {
    plural: { en: 'Admins', id: 'Admin' },
    singular: { en: 'Admin', id: 'Admin' },
  },
  admin: {
    useAsTitle: 'email',
    group: groups.user,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Master',
          value: 'master',
        },
        {
          label: 'Staff',
          value: 'staff',
        },
      ],
      defaultValue: 'staff',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'hasOAuth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        description: 'User has OAuth login capability',
      },
    },
    {
      name: 'hasOAuthOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        description: 'User only has OAuth login (no password)',
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        description: 'Last time this user logged in',
        readOnly: true,
      },
    },
  ],
};
