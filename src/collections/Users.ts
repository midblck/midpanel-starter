import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Customer',
          value: 'customer',
        },
        {
          label: 'Premium',
          value: 'premium',
        },
      ],
      defaultValue: 'customer',
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
