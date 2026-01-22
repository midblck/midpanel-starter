'use client';

import type { Admin } from '@/payload-types';
import type {
  AccountIdentity,
  IdentityDetails,
  MeResponse,
  AuthResponse,
} from '@/types/auth';
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: Admin | null;
  loading: boolean;
  hasOAuth: boolean;
  oauthProviders: string[];
  identity: AccountIdentity | null;
  identityDetails: IdentityDetails | null;
  collection: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOAuth, setHasOAuth] = useState(false);
  const [oauthProviders, setOAuthProviders] = useState<string[]>([]);
  const [identity, setIdentity] = useState<AccountIdentity | null>(null);
  const [identityDetails, setIdentityDetails] =
    useState<IdentityDetails | null>(null);
  const [collection, setCollection] = useState<string | null>(null);

  useLayoutEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if user is authenticated on mount
      void checkAuth();
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if user is authenticated on mount
      void checkAuth();
    }
  }, []);

  // Also check auth when the page becomes visible (for OAuth redirects)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('Auth context: visibility change detected');
          void checkAuth();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () =>
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Get the JWT token from the cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('payload-token='))
        ?.split('=')[1];

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', { headers });

      if (response.ok) {
        const userData: MeResponse = await response.json();
        setUser(userData.user);
        setHasOAuth(userData.hasOAuth || false);
        setOAuthProviders(userData.oauthProviders || []);
        setIdentity(userData.identity || null);
        setIdentityDetails(userData.identityDetails || null);
        setCollection(userData.collection || null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        setUser(data.user);

        // Show warning if email exists in multiple collections
        if (data.warning) {
          console.warn('Auth warning:', data.warning);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          collection: 'admins', // Hardcode to admin collection
        }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        setUser(data.user);

        // Show warning if email exists in other collection
        if (data.warning) {
          console.warn('Signup warning:', data.warning);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up failed:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'users' }), // Use users collection
      });
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasOAuth,
        oauthProviders,
        identity,
        identityDetails,
        collection,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
