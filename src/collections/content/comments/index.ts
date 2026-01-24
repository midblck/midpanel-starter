import { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { COMMENT_LIMITS } from '@/blocks/comment-block/utils/comment-security'
import { groups } from '@/lib/groups'

import { revalidatePost } from '@/collections/content/posts/hooks/revalidate-post'
import {
  securityAfterChange,
  securityBeforeChange,
  securityBeforeValidate,
} from './hooks/security-hooks'

const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    plural: { en: 'Comments', id: 'Komentar' },
    singular: { en: 'Comment', id: 'Komentar' },
  },
  access: {
    create: anyone,
    read: anyone,
    // // Public users should only be able to read published comments
    // // Users should be able to read their own comments
    // // Admins should be able to read all comments
    // read: ({ data, req: { user } }) => {
    //   return Boolean(
    //     data?.status === 'published' ||
    //       checkRole(['admin'], user) ||
    //       (typeof data?.user === 'string' ? data?.user : data?.user?.id) === user?.id,
    //   )
    // },
    // // Public users should not be able to create published comments
    // // User should only be allowed to create and their own draft comments
    // // Admins should have full control
    // create: ({ data, req: { user } }) => {
    //   return Boolean(
    //     checkRole(['admin'], user) ||
    //       (data?.status === 'draft' &&
    //         (typeof data?.user === 'string' ? data?.user : data?.user?.id) === user?.id),
    //   )
    // },
    // // Public users should not be able to update published comments
    // // Users should only be allowed to update their own draft comments
    // // Admins should have full control
    // update: ({ data, req: { user } }) => {
    //   return Boolean(
    //     checkRole(['admin'], user) ||
    //       (data?.status === 'draft' &&
    //         (typeof data?.user === 'string' ? data?.user : data?.user?.id) === user?.id),
    //   )
    // },
    // // Only admins can delete comments
    // delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // This field is only used to populate the user data via the `populateUser` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    // {
    //   name: 'populatedUser',
    //   access: {
    //     update: () => false,
    //   },
    //   admin: {
    //     disabled: true,
    //     readOnly: true,
    //   },
    //   fields: [
    //     {
    //       name: 'id',
    //       type: 'text',
    //     },
    //     {
    //       name: 'name',
    //       type: 'text',
    //     },
    //   ],
    //   type: 'group',
    // },
    {
      admin: {
        description: {
          en: 'Select the post this comment belongs to',
          id: 'Pilih postingan yang komentar ini miliki',
        },
      },
      hasMany: false,
      label: { en: 'Document', id: 'Dokumen' },
      name: 'doc',
      relationTo: 'posts',
      type: 'relationship',
    },
    {
      label: { en: 'Name', id: 'Nama' },
      maxLength: COMMENT_LIMITS.NAME_MAX_LENGTH,
      minLength: COMMENT_LIMITS.NAME_MIN_LENGTH,
      name: 'name',
      required: true,
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value || typeof value !== 'string') {
          return 'Name is required'
        }
        if (value.length < COMMENT_LIMITS.NAME_MIN_LENGTH) {
          return `Name must be at least ${COMMENT_LIMITS.NAME_MIN_LENGTH} character long`
        }
        if (value.length > COMMENT_LIMITS.NAME_MAX_LENGTH) {
          return `Name must not exceed ${COMMENT_LIMITS.NAME_MAX_LENGTH} characters`
        }
        return true
      },
    },
    {
      admin: {
        description: { en: 'Commenter email address', id: 'Alamat email pemberi komentar' },
      },
      label: { en: 'Email', id: 'Email' },
      name: 'email',
      required: true,
      type: 'email',
      validate: (value: string | null | undefined) => {
        if (!value || typeof value !== 'string') {
          return 'Email is required'
        }
        if (value.length > COMMENT_LIMITS.EMAIL_MAX_LENGTH) {
          return `Email must not exceed ${COMMENT_LIMITS.EMAIL_MAX_LENGTH} characters`
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailPattern.test(value)) {
          return 'Please enter a valid email address'
        }
        return true
      },
    },
    {
      admin: {
        description: { en: 'Comment content', id: 'Isi komentar' },
      },
      label: { en: 'Comment', id: 'Komentar' },
      maxLength: COMMENT_LIMITS.COMMENT_MAX_LENGTH,
      minLength: COMMENT_LIMITS.COMMENT_MIN_LENGTH,
      name: 'comment',
      required: true,
      type: 'textarea',
      validate: (value: string | null | undefined) => {
        if (!value || typeof value !== 'string') {
          return 'Comment is required'
        }
        if (value.length < COMMENT_LIMITS.COMMENT_MIN_LENGTH) {
          return `Comment must be at least ${COMMENT_LIMITS.COMMENT_MIN_LENGTH} character long`
        }
        if (value.length > COMMENT_LIMITS.COMMENT_MAX_LENGTH) {
          return `Comment must not exceed ${COMMENT_LIMITS.COMMENT_MAX_LENGTH} characters`
        }
        return true
      },
    },
  ],
  admin: {
    group: groups.content,
    // preview: (comment: Partial<Comment>) =>
    //   `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${
    //     comment?.doc && typeof comment?.doc === 'object'
    //       ? comment?.doc?.slug
    //       : (comment?.doc as string)
    //   }`,
    useAsTitle: 'comment',
  },
  hooks: {
    afterChange: [securityAfterChange, revalidatePost],
    beforeChange: [securityBeforeChange],
    beforeValidate: [securityBeforeValidate],
  },
  versions: {
    drafts: true,
  },
}

export default Comments
