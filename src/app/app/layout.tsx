import DashboardLayoutWrapper from '@/components/layout/dashboard-layout-wrapper';
import { cookies } from 'next/headers';
import { headers as getHeaders } from 'next/headers.js';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import '../globals.css'; // Global styles for dashboard routes

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on server-side to prevent redirect loops
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  // Redirect unauthenticated users to sign-in
  if (!user) {
    redirect('/auth/sign-in');
  }

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <DashboardLayoutWrapper defaultOpen={defaultOpen}>
      {children}
    </DashboardLayoutWrapper>
  );
}
