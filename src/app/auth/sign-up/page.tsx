import { headers as getHeaders } from 'next/headers.js';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';

import SignUpViewPage from '@/features/auth/components/sign-up-view';
import config from '@/payload.config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.',
};

export default async function Page() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  // Redirect authenticated users to app
  if (user) {
    redirect('/app');
  }

  return <SignUpViewPage />;
}
