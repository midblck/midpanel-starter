'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Info } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useAuth } from '../context/auth-context';
import { passwordRequirements } from '../utils/password-validation';
import type { IdentityCheckResponse } from '@/types/auth';
import GoogleSignInButton from './google-auth-button';
import PasswordStrengthIndicator from './password-strength-indicator';

const signInSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: passwordRequirements[0].label })
      .regex(/[A-Z]/, {
        message: passwordRequirements[1].label,
      })
      .regex(/[a-z]/, {
        message: passwordRequirements[2].label,
      })
      .regex(/[0-9]/, { message: passwordRequirements[3].label })
      .regex(/[^A-Za-z0-9]/, {
        message: passwordRequirements[4].label,
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignInFormValue = z.infer<typeof signInSchema>;
type SignUpFormValue = z.infer<typeof signUpSchema>;

interface UserAuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

export default function UserAuthForm({ mode }: UserAuthFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/app';
  const [loading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailIdentity, setEmailIdentity] =
    useState<IdentityCheckResponse | null>(null);
  const [checkingIdentity, setCheckingIdentity] = useState(false);
  useAuth();

  const signInForm = useForm<SignInFormValue>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormValue>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Check email identity for sign-up
  const checkEmailIdentity = async (email: string) => {
    if (!email || !email.includes('@')) return;

    setCheckingIdentity(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmailIdentity(data);
      }
    } catch (error) {
      console.error('Identity check failed:', error);
    } finally {
      setCheckingIdentity(false);
    }
  };

  const onSignIn = async (data: SignInFormValue) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result = await response.json();

        if (response.ok) {
          // Show identity info if available
          if (result.identity === 'both') {
            toast.warning(
              result.warning || 'Email exists in multiple accounts'
            );
          }

          toast.success('Signed in successfully!');
          window.location.href = callbackUrl;
        } else {
          toast.error(
            result.message || 'Sign in failed. Please check your credentials.'
          );
        }
      } catch {
        toast.error('Sign in failed. Please try again.');
      }
    });
  };

  const onSignUp = async (data: SignUpFormValue) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            collection: 'users', // Use users collection with customer role
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Show warning if email exists in other collection
          if (result.warning) {
            toast.warning(result.warning);
          }

          toast.success('Account created successfully!');
          window.location.href = callbackUrl;
        } else {
          toast.error(result.message || 'Sign up failed. Please try again.');
        }
      } catch {
        toast.error('Sign up failed. Please try again.');
      }
    });
  };

  // Identity status component
  const IdentityStatus = () => {
    if (!emailIdentity) return null;

    const getStatusIcon = () => {
      switch (emailIdentity.identity) {
        case 'both':
          return <AlertTriangle className='h-4 w-4 text-amber-500' />;
        case 'admin':
        case 'user':
          return <CheckCircle className='h-4 w-4 text-green-500' />;
        case 'none':
          return <Info className='h-4 w-4 text-blue-500' />;
        default:
          return null;
      }
    };

    const getStatusColor = () => {
      switch (emailIdentity.identity) {
        case 'both':
          return 'bg-amber-50 border-amber-200 text-amber-800';
        case 'admin':
        case 'user':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'none':
          return 'bg-blue-50 border-blue-200 text-blue-800';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    return (
      <Alert className={getStatusColor()}>
        <div className='flex items-center gap-2'>
          {getStatusIcon()}
          <div className='flex-1'>
            <AlertDescription>
              {emailIdentity.message}
              {emailIdentity.collections.length > 0 && (
                <div className='mt-1 flex gap-1'>
                  {emailIdentity.collections.map(collection => (
                    <Badge
                      key={collection}
                      variant='outline'
                      className='text-xs'
                    >
                      {collection === 'admins' ? 'Admin' : 'User'}
                    </Badge>
                  ))}
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  };

  if (mode === 'sign-in') {
    return (
      <>
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(onSignIn)}
            className='w-full space-y-4'
          >
            <FormField
              control={signInForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='your_mail@example.com'
                      type='email'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signInForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='Enter your password'
                        type={showPassword ? 'text' : 'password'}
                        disabled={loading}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className='w-full' type='submit'>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>
        <GoogleSignInButton />
      </>
    );
  }

  return (
    <>
      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSignUp)}
          className='w-full space-y-4'
        >
          <FormField
            control={signUpForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your full name...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your email...'
                    type='email'
                    disabled={loading}
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      checkEmailIdentity(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {checkingIdentity && (
                  <p className='text-sm text-muted-foreground'>
                    Checking email status...
                  </p>
                )}
                <IdentityStatus />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter your password...'
                      type={showPassword ? 'text' : 'password'}
                      disabled={loading}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                <PasswordStrengthIndicator password={field.value} />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Confirm your password...'
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={loading}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className='w-full' type='submit'>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
