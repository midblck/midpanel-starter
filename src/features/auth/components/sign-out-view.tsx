'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';

export default function SignOutViewPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut();
      // Add query parameter to prevent auth check on sign-in page
      router.push('/auth/sign-in?signedOut=true');
    };

    void handleSignOut();
  }, [signOut, router]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
        <p className='text-muted-foreground'>Signing you out...</p>
      </div>
    </div>
  );
}
