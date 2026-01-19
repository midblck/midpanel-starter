// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Admins } from './collections/Admins';
import { Media } from './collections/Media';
import { OAuth } from './collections/OAuth';
import { Tasks } from './collections/Task';
import { TaskStatuses } from './collections/TaskStatus';
import { TaskType } from './collections/TaskType';
import { Theme } from './collections/Theme';
import { Users } from './collections/Users';

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
