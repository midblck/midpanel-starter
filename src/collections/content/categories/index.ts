import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/fields/slug'
import { groups } from '@/lib/groups'

import { anyone, authenticated } from '@/lib/access/'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    plural: { en: 'Categories', id: 'Kategori' },
    singular: { en: 'Category', id: 'Kategori' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      admin: {
        description: {
          en: 'Category title for organizing content',
          id: 'Judul kategori untuk mengorganisir konten',
        },
      },
      label: { en: 'Title', id: 'Judul' },
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: {
          en: 'Order number for sorting categories (lower numbers appear first)',
          id: 'Nomor urut untuk menyortir kategori (angka lebih rendah muncul terlebih dahulu)',
        },
        position: 'sidebar',
      },
      defaultValue: 0,
      label: { en: 'Order', id: 'Urutan' },
      name: 'order',
      type: 'number',
    },
    ...slugField(),
  ],
  admin: {
    group: groups.content,
    defaultColumns: ['title', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultSort: 'order',
}
