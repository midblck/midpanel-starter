// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { uploadthingStorage } from '@payloadcms/storage-uploadthing';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Admins } from './collections/user/Admins';
import { Media } from './collections/content/Media';
import { OAuth } from './collections/user/OAuth';
import { Tasks } from './collections/misc/Task';
import { TaskStatuses } from './collections/misc/TaskStatus';
import { TaskType } from './collections/misc/TaskType';
import { Theme } from './collections/configuration/Theme';
import { Users } from './collections/user/Users';
import { SupportedLanguages } from '@payloadcms/translations';
import { id } from './lib/translations/id';
import { en } from '@payloadcms/translations/languages/en';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Admins.slug,
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
  collections: [
    Admins,
    Users,
    OAuth,
    Media,
    Tasks,
    TaskStatuses,
    TaskType,
    Theme,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
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
});
