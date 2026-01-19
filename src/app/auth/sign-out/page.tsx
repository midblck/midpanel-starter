import SignOutViewPage from '@/features/auth/components/sign-out-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Sign Out',
  description: 'Sign Out page for authentication.',
};

export default function Page() {
  return <SignOutViewPage />;
}
