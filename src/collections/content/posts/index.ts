import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Banner } from '@/blocks/banner/config'
import { Code } from '@/blocks/code/config'
import { Content } from '@/blocks/content/config'
import { MediaBlock } from '@/blocks/media-block/config'
import { authenticated, authenticatedOrPublished } from '@/lib/access'
import { groups } from '@/lib/groups'
import { generatePreviewPath } from '@/utilities/generate-preview-path'
import { populateAuthors } from './hooks/populate-authors'
import { revalidateDelete, revalidatePost } from './hooks/revalidate-post'

import { slugField } from '@/lib/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    plural: { en: 'Posts', id: 'Artikel' },
    singular: { en: 'Post', id: 'Artikel' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    slug: true,
    categories: true,
    content: true,
    createdAt: true,
    meta: {
      description: true,
      image: true,
    },
    publishedAt: true,
    title: true,
    updatedAt: true,
  },
  admin: {
    group: groups.content,
    defaultColumns: ['title', 'slug', 'categories', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      admin: {
        description: {
          en: 'Post title that appears in the browser tab and navigation',
          id: 'Judul artikel yang muncul di tab browser dan navigasi',
        },
      },
      label: { en: 'Title', id: 'Judul' },
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              admin: {
                description: {
                  en: 'Featured image that appears at the top of the post',
                  id: 'Gambar unggulan yang muncul di bagian atas artikel',
                },
              },
              label: { en: 'Hero Image', id: 'Gambar Hero' },
              name: 'heroImage',
              relationTo: 'media',
              type: 'upload',
            },
            {
              label: { en: 'Content', id: 'Konten' },
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, Content, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              required: true,
            },
            {
              admin: {
                description: {
                  en: 'Conclusion section content.',
                  id: 'Konten bagian kesimpulan.',
                },
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, Content, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: { en: 'Conclusion', id: 'Kesimpulan' },
              localized: true,
              name: 'conclusion',
              type: 'richText',
            },
          ],
          label: { en: 'Content', id: 'Konten' },
        },
        {
          fields: [
            {
              admin: {
                description: {
                  en: 'Select related posts to suggest to readers',
                  id: 'Pilih artikel terkait untuk disarankan kepada pembaca',
                },
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              label: { en: 'Related Posts', id: 'Artikel Terkait' },
              name: 'relatedPosts',
              relationTo: 'posts',
              type: 'relationship',
            },
            {
              admin: {
                description: {
                  en: 'Select categories to organize this post',
                  id: 'Pilih kategori untuk mengorganisir artikel ini',
                },
                position: 'sidebar',
              },
              hasMany: true,
              label: { en: 'Categories', id: 'Kategori' },
              name: 'categories',
              relationTo: 'categories',
              type: 'relationship',
            },
          ],
          label: { en: 'Meta', id: 'Meta' },
        },
        {
          label: { en: 'SEO', id: 'SEO' },
          name: 'meta',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: {
          en: 'Date and time when the post will be published',
          id: 'Tanggal dan waktu ketika artikel akan diterbitkan',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
      label: { en: 'Published At', id: 'Diterbitkan Pada' },
      name: 'publishedAt',
      type: 'date',
    },
    {
      admin: {
        description: {
          en: 'Select authors for this post',
          id: 'Pilih penulis untuk artikel ini',
        },
        position: 'sidebar',
      },
      hasMany: true,
      label: { en: 'Authors', id: 'Penulis' },
      name: 'authors',
      relationTo: 'admins',
      type: 'relationship',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      admin: {
        description: {
          en: 'Toggle to allow or disable comments for this post',
          id: 'Aktifkan atau nonaktifkan komentar untuk artikel ini',
        },
        position: 'sidebar',
      },
      defaultValue: true,
      label: { en: 'Enable Comments', id: 'Aktifkan Komentar' },
      name: 'enableComments',
      type: 'checkbox',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave:
        process.env.NODE_ENV === 'production'
          ? {
              interval: 1000,
            }
          : false,
      schedulePublish: false,
    },
    maxPerDoc: 50,
  },
}
