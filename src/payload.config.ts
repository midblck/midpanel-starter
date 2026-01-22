// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { getServerSideURL } from '@/utilities/getURL'
import { SupportedLanguages } from '@payloadcms/translations'
import { en } from '@payloadcms/translations/languages/en'
import { Theme } from './collections/configuration/Theme'
import { Media } from './collections/content/Media'
import { Tasks } from './collections/misc/Task'
import { TaskStatuses } from './collections/misc/TaskStatus'
import { TaskType } from './collections/misc/TaskType'
import { Admins } from './collections/user/Admins'
import { OAuth } from './collections/user/OAuth'
import { Users } from './collections/user/Users'
import { id } from './lib/translations/id'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    components: {
      graphics: {
        Icon: '@/components/admin/logo#Icon',
        Logo: '@/components/admin/logo#Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Midblck Admin Starter',
    },
  },
  i18n: {
    fallbackLanguage: 'id' as keyof SupportedLanguages,
    supportedLanguages: { en, id } as SupportedLanguages,
  },
  localization: {
    locales: [
      {
        label: 'Indonesia',
        code: 'id',
      },
      { label: 'English', code: 'en' },
    ], // required
    defaultLocale: 'id', // required
  },
  collections: [Admins, Users, OAuth, Media, Tasks, TaskStatuses, TaskType, Theme],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'no-reply@midblock.com',
    defaultFromName: 'MID Block',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST || '',
      port: 587,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  }),
  sharp,
  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
    uploadthingStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
  // Configure JWT authentication strategy
  auth: {
    jwtOrder: ['Bearer', 'cookie'], // Check Authorization header first, then cookies
  },
  cors: [getServerSideURL()].filter(Boolean),
})
