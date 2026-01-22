import type { CheckboxField, TextField } from 'payload'

import { formatSlugHook } from './formatSlug'

type Overrides = {
  slugOverrides?: Partial<TextField>
  checkboxOverrides?: Partial<CheckboxField>
  unique?: boolean
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { unique, checkboxOverrides, slugOverrides } = overrides

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    label: { en: 'Lock Slug', id: 'Kunci Slug' },
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  }

  // @ts-expect-error - ts mismatch Partial<TextField> with TextField
  const slugField: TextField = {
    name: 'slug',
    type: 'text',
    label: { en: 'Slug', id: 'Slug' },
    admin: {
      components: {
        Field: {
          clientProps: {
            checkboxFieldPath: checkBoxField.name,
            fieldToUse,
          },
          path: '@/fields/slug/SlugComponent#SlugComponent',
        },
      },
      ...(slugOverrides?.admin || {}),
      position: 'sidebar',
    },
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    ...(slugOverrides || {}),
    ...(unique && { unique: true }),
    unique: true,
    index: true,
  }

  return [slugField, checkBoxField]
}
