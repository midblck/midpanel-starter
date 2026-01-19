import { ErrorProvider } from '@/components/error-boundary';
import { ActiveThemeProvider } from '@/components/layout/active-theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth';
import configPromise from '@payload-config';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { getPayload } from 'payload';
import { SWRConfig } from 'swr';
import type { Theme } from '@/payload-types';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Midblck Admin Starter - Production-Ready Admin Panel',
  description:
    'A modern PayloadCMS admin starter template with Next.js 15, TypeScript, and shadcn/ui components. Build production-ready admin panels with Kanban boards, task management, and OAuth integration.',
  keywords: [
    'Admin Panel',
    'PayloadCMS',
    'Next.js',
    'TypeScript',
    'shadcn/ui',
    'Kanban',
    'Task Management',
    'OAuth',
    'Admin Starter',
  ],
  authors: [{ name: 'Midblck Admin Starter Team' }],
  icons: {
    icon: '/branding/favicon.ico',
    shortcut: '/branding/favicon.ico',
    apple: '/branding/icon.svg',
  },
  openGraph: {
    title: 'Midblck Admin Starter - Production-Ready Admin Panel',
    description:
      'A modern PayloadCMS admin starter template with Next.js 15, TypeScript, and shadcn/ui components. Build production-ready admin panels with Kanban boards, task management, and OAuth integration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midblck Admin Starter - Production-Ready Admin Panel',
    description:
      'A modern PayloadCMS admin starter template with Next.js 15, TypeScript, and shadcn/ui components.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if this is an admin route
  // PayloadCMS RootLayout renders its own <html> and <body> tags
  // When used in a nested layout, it creates nested HTML tags (hydration error)
  const headersList = await headers();
  const isAdminRoute = headersList.get('x-admin-route') === 'true';

  // RESTRUCTURED: Make PayloadCMS RootLayout the root layout for admin routes
  // For admin routes, PayloadCMS RootLayout will handle the HTML/body structure
  // We return minimal HTML/body to satisfy Next.js requirements, but PayloadCMS
  // RootLayout effectively becomes the root layout by managing the structure
  // 
  // Note: This still creates nested HTML during SSR, but PayloadCMS RootLayout
  // is effectively the root layout for admin routes
  if (isAdminRoute) {
    // PayloadCMS RootLayout will render its own <html> and <body>
    // We render minimal structure to satisfy Next.js, creating nested HTML
    // suppressHydrationWarning suppresses the warning
    return (
      <html lang='en' suppressHydrationWarning>
        <body suppressHydrationWarning>{children}</body>
      </html>
    );
  }

  // Load themes from PayloadCMS with better error handling
  let themes: Theme[] = [];
  let initialTheme = 'default';

  try {
    // Check if we're in a build context or if database is available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URI) {
      console.log('Skipping theme loading during build - no database connection');
    } else {
      const payload = await getPayload({ config: configPromise });
      const { docs: themesData } = await payload.find({
        collection: 'themes',
        sort: 'name',
      });
      themes = themesData;

      // Get default theme
      const defaultTheme = themesData.find((theme: Theme) => theme.isDefault);
      if (defaultTheme) {
        initialTheme = defaultTheme.name.toLowerCase().replace(/\s+/g, '-');
      }

      // Check cookie for saved theme preference
      const cookieStore = await cookies();
      const savedTheme = cookieStore.get('active_theme')?.value;
      if (
        savedTheme &&
        themesData.find(
          (theme: Theme) =>
            theme.name.toLowerCase().replace(/\s+/g, '-') === savedTheme
        )
      ) {
        initialTheme = savedTheme;
      }
    }
  } catch (error) {
    console.error('Failed to load themes:', error);
    // Fallback to default theme if database is not available
    themes = [];
    initialTheme = 'default';
  }

  return (
    <html
      lang='en'
      className={`${inter.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <link rel='icon' href='/branding/favicon.ico' sizes='any' />
        <link rel='icon' href='/branding/icon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/branding/icon.svg' />
      </head>
      <body className='antialiased'>
        <ErrorProvider>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateOnReconnect: true,
              dedupingInterval: 2000,
              errorRetryCount: 3,
            }}
          >
            <NuqsAdapter>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
              >
                <ActiveThemeProvider initialTheme={initialTheme} themes={themes}>
                  <AuthProvider>
                    {children}
                    <Toaster />
                  </AuthProvider>
                </ActiveThemeProvider>
              </ThemeProvider>
            </NuqsAdapter>
          </SWRConfig>
        </ErrorProvider>
      </body>
    </html>
  );
}
