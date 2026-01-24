import type { CollectionConfig } from 'payload'
import { groups } from '@/lib/groups'

export const OAuth: CollectionConfig = {
  slug: 'oauth',
  labels: {
    plural: { en: 'OAuth', id: 'OAuth' },
    singular: { en: 'OAuth', id: 'OAuth' },
  },
  admin: {
    useAsTitle: 'providerEmail',
    defaultColumns: ['provider', 'providerEmail', 'collection', 'lastLoginAt'],
    group: groups.user,
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'GitHub', value: 'github' },
        { label: 'Facebook', value: 'facebook' },
      ],
      required: true,
      admin: {
        description: 'OAuth provider used for authentication',
      },
    },
    {
      name: 'providerId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique ID from the OAuth provider (e.g., Google sub)',
        hidden: true,
      },
    },
    {
      name: 'providerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address from the OAuth provider',
      },
    },
    {
      name: 'providerName',
      type: 'text',
      admin: {
        description: 'Display name from the OAuth provider',
      },
    },
    {
      name: 'avatar',
      type: 'text',
      admin: {
        description: 'Profile picture URL from the OAuth provider',
      },
    },
    {
      name: 'targetCollection',
      type: 'select',
      options: [
        { label: 'Admins', value: 'admins' },
        { label: 'Users', value: 'users' },
      ],
      required: true,
      admin: {
        description: 'Target collection for this OAuth connection',
      },
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the user in the target collection',
        hidden: true,
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      admin: {
        hidden: true,
        description: 'OAuth access token (encrypted)',
      },
    },
    {
      name: 'refreshToken',
      type: 'text',
      admin: {
        hidden: true,
        description: 'OAuth refresh token (encrypted)',
      },
    },
    {
      name: 'tokenExpiresAt',
      type: 'date',
      admin: {
        description: 'When the access token expires',
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        description: 'Last time this OAuth connection was used',
      },
    },
  ],
  indexes: [
    {
      fields: ['providerId', 'provider'],
    },
    {
      fields: ['userId', 'targetCollection'],
    },
    {
      fields: ['providerEmail'],
    },
  ],
}
