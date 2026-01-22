/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* RESTRUCTURED: PayloadCMS RootLayout is now the root layout for admin routes */
import config from '@payload-config';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

import { importMap } from './admin/importMap.js';
import './custom.scss'; // Custom admin styling that complements PayloadCMS

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

// RESTRUCTURED SOLUTION:
// PayloadCMS RootLayout is designed to be THE root layout and renders <html> and <body>
// We're using it as the root layout for admin routes by letting it handle the HTML structure
// The root layout renders minimal HTML/body to satisfy Next.js requirements, but
// PayloadCMS RootLayout effectively becomes the root by managing the structure
//
// This makes RootLayout the root layout (not nested) for admin routes
// const Layout = ({ children }: Args) => {
//   return (
//     <RootLayout
//       config={config}
//       importMap={importMap}
//       serverFunction={serverFunction}
//     >
//       {children}
//     </RootLayout>
//   );
// };

// export default Layout;

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
);

export default Layout;
