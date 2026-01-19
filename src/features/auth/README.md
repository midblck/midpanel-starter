# Authentication System

This authentication system is built with PayloadCMS, Next.js, and shadcn/ui components, following the design patterns from the admin-panel reference.

## Features

- **Sign In** - Email/password authentication with PayloadCMS built-in functions
- **Sign Up** - User registration with form validation
- **Sign Out** - Secure logout using PayloadCMS built-in logout
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Auth Context** - Global authentication state management
- **Form Validation** - Zod schema validation with error handling
- **Responsive Design** - Mobile-first design matching admin-panel style

## Components

### Pages

- `src/app/auth/sign-in/page.tsx` - Sign in page
- `src/app/auth/sign-up/page.tsx` - Sign up page
- `src/app/auth/sign-out/page.tsx` - Sign out page

### Components

- `SignInViewPage` - Sign in page layout and form
- `SignUpViewPage` - Sign up page layout and form
- `SignOutViewPage` - Sign out page with automatic logout
- `UserAuthForm` - Reusable form component for sign in/up
- `GithubSignInButton` - GitHub OAuth button (placeholder)
- `ProtectedRoute` - Route protection wrapper

### Context

- `AuthProvider` - Global authentication state provider
- `useAuth` - Hook for accessing auth state and methods

## API Routes

- `POST /api/auth/sign-in` - Sign in endpoint using PayloadCMS login
- `POST /api/auth/sign-up` - Sign up endpoint using PayloadCMS create
- `POST /api/auth/sign-out` - Sign out endpoint using PayloadCMS built-in logout
- `GET /api/auth/me` - Get current user endpoint using PayloadCMS built-in auth

## Usage

### Using the Auth Context

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <a href='/auth/sign-in'>Sign In</a>
      )}
    </div>
  );
}
```

### Protecting Routes

```tsx
import ProtectedRoute from '@/features/auth/components/protected-route';

function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className='dashboard'>{children}</div>
    </ProtectedRoute>
  );
}
```

## Design Features

- **Split Layout** - Left side with branding, right side with forms
- **Consistent Styling** - Matches admin-panel design system
- **Form Validation** - Real-time validation with error messages
- **Loading States** - Proper loading indicators during auth operations
- **Error Handling** - Toast notifications for success/error states
- **Responsive** - Mobile-first design with proper breakpoints

## Integration with PayloadCMS

The authentication system uses PayloadCMS built-in functions:

- `payload.login()` - For user authentication
- `payload.create()` - For user registration
- `/api/admins/logout` - For secure logout using PayloadCMS built-in REST API
- `payload.auth()` - For current user verification (equivalent to `/api/admins/me`)

All authentication operations use PayloadCMS built-in functions and REST API endpoints as recommended in the official documentation, providing optimal performance and security.

## Security Features

- JWT token-based authentication
- HTTP-only cookies for token storage
- CSRF protection through PayloadCMS
- Password validation and hashing
- Secure password reset flow

## Customization

The system is designed to be easily customizable:

- Update branding in the view components
- Modify form fields in the form components
- Customize styling through Tailwind classes
- Add additional OAuth providers
- Extend user fields in PayloadCMS collections
