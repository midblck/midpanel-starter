import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Plugin } from 'payload'

import { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/get-url'

const generateTitle: GenerateTitle<Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Midblock Admin Starter` : 'Midblock Admin Starter'
}

const generateURL: GenerateURL<Post> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'keywords',
        type: 'text',
      },
    ],
  }),
]
