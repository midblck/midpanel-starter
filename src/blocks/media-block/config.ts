import type { Block } from 'payload'

import { MediaPickerField } from '@/lib/fields/media-picker'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    MediaPickerField({
      label: { en: 'Media', id: 'Media' },
      name: 'media',
    }),
    {
      defaultValue: '350px',
      label: { en: 'Minimum Height', id: 'Tinggi Minimum' },
      name: 'minHeight',
      options: [
        { label: '150px', value: '150px' },
        { label: '350px', value: '350px' },
        { label: '500px', value: '500px' },
        { label: 'Full Screen', value: 'screen' },
      ],
      required: true,
      type: 'select',
    },
    {
      defaultValue: 'contained',
      label: { en: 'Media Layout', id: 'Tata Letak Media' },
      name: 'mediaLayout',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
      type: 'select',
    },
    {
      defaultValue: 'cover',
      label: { en: 'Media Object Fit', id: 'Object Fit Media' },
      name: 'objectFit',
      options: [
        { label: 'Cover (crop to fill)', value: 'cover' },
        { label: 'Contain (fit within bounds)', value: 'contain' },
      ],
      type: 'select',
    },
    {
      defaultValue: 'medium',
      label: { en: 'Section Spacing', id: 'Jarak Section' },
      name: 'sectionSpacing',
      options: [
        { label: 'No Spacing', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' },
      ],
      type: 'select',
    },
  ],
}
