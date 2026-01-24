import { deepMerge, Field, RadioField, TextField, UploadField } from 'payload'

import { convertYoutubeUrlHook, validateYoutubeUrl } from './hooks/convertYoutubeUrlHook'

type MediaPickerOverrides = {
  uploadFieldOverrides?: Omit<UploadField, 'type'>
  label?: string | { en: string; id: string }
  name?: string
  useAspectRatio?: boolean // Enable aspect ratio field for media
  admin?: {
    description?: string | { en: string; id: string }
    condition?: (data: unknown, siblingData: Record<string, unknown>) => boolean
  }
}

type MediaPickerFieldType = (overrides?: MediaPickerOverrides) => Field

export const MediaPickerField: MediaPickerFieldType = (overrides?) => {
  const mediaTypeOptions = [
    { label: 'File Upload', value: 'upload' },
    { label: 'YouTube Video', value: 'video' },
  ]

  const mediaTypeField = deepMerge<RadioField, Omit<RadioField, 'type' | 'options' | 'hasMany'>>(
    {
      name: 'mediaType',
      type: 'radio',
      defaultValue: 'upload',
      options: mediaTypeOptions,
      dbName: 'mt',
    },
    {},
  )

  const uploadField = deepMerge<UploadField, Omit<UploadField, 'type'>>(
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data: unknown) => {
          const mediaData = data as { mediaType?: string }
          return mediaData.mediaType === 'upload'
        },
      },
    },
    overrides?.uploadFieldOverrides || {},
  )

  const videoUrlField = deepMerge<TextField, Omit<TextField, 'type'>>(
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description:
          'Paste YouTube URL - supported formats:\n\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n• https://youtube.com/watch?v=VIDEO_ID\n\nURLs will be automatically converted to embed URLs.',
        placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        width: '75%',
        condition: (data: unknown) => {
          const mediaData = data as { mediaType?: string }
          return mediaData.mediaType === 'video'
        },
      },
      hooks: {
        beforeValidate: [convertYoutubeUrlHook],
      },
      validate: (value: unknown) => {
        if (value && typeof value === 'string') {
          const error = validateYoutubeUrl(value)
          if (error) {
            return error
          }
        }
        return true
      },
    },
    {},
  )

  const fieldsArray: Field[] = [mediaTypeField, uploadField, videoUrlField]
  if (overrides?.useAspectRatio) {
    fieldsArray.push({
      name: 'aspectRatio',
      type: 'text',
      label: { en: 'Aspect Ratio', id: 'Rasio Aspek' },
      defaultValue: '1/1',
      admin: {
        description: {
          en: 'Aspect ratio for media (e.g., "3/4", "4/3", "16/9", "1/1")',
          id: 'Rasio aspek untuk media (mis., "3/4", "4/3", "16/9", "1/1")',
        },
        placeholder: 'e.g., 1/1 or 4/3',
      },
      validate: (value: unknown) => {
        if (value && typeof value === 'string') {
          if (!value.includes('/')) {
            return 'Aspect ratio must contain a "/" (e.g., "4/3", "16/9")'
          }
          const parts = value.split('/')
          if (parts.length !== 2) {
            return 'Aspect ratio must be in format "width/height" (e.g., "4/3")'
          }
          const width = parseFloat(parts[0])
          const height = parseFloat(parts[1])
          if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            return 'Aspect ratio must contain valid positive numbers (e.g., "4/3", "16/9")'
          }
        }
        return true
      },
    })
  }

  const finalField: Field = {
    name: overrides?.name || 'mainMedia',
    type: 'group' as const,
    label: overrides?.label || { en: 'Media Selector', id: 'Pilihan Media' },
    admin: overrides?.admin,
    fields: fieldsArray,
  }

  return finalField
}
