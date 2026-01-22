import type { CollectionConfig } from 'payload';
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import { groups } from '@/lib/groups';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: { en: 'Media', id: 'Media' },
    singular: { en: 'Media', id: 'Media' },
  },
  admin: {
    group: groups.content,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: { en: 'Caption', id: 'Keterangan' },
      name: 'caption',
      type: 'richText',
    },
  ],
  upload: {
    // Auto-compress and convert to WebP with quality optimization
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85, // Good balance between size and quality
        effort: 6, // Compression effort (1-6, higher = better compression)
      },
    },
  },
};
