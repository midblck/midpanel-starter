# Multi-Collection Authentication with Identity Detection

## Overview

This document describes the enhanced multi-collection authentication system that supports both `admins` and `users` collections with intelligent identity detection and duplicate email handling.

## Features

✅ **Multi-Collection Support**: Separate authentication for admins and users  
✅ **Auto-Detection**: Automatically detects which collection to use for login  
✅ **Identity Tracking**: Shows whether an email exists as admin, user, or both  
✅ **Priority-Based Login**: Admins take precedence when email exists in both collections  
✅ **Cross-Collection Warnings**: Alerts when email exists in multiple collections  
✅ **PayloadCMS Native**: Uses built-in PayloadCMS authentication functions  
✅ **Type-Safe**: Full TypeScript support with proper interfaces

---

## API Endpoints

### 1. Sign In - `POST /api/auth/sign-in`

Login endpoint with auto-detection and identity reporting.

**Request Body:**

```typescript
{
  email: string;
  password: string;
  collection?: 'admins' | 'users';  // Optional
}
```

**Response:**

```typescript
{
  message: string;
  user: object;
  collection: 'admins' | 'users';  // Where user logged in
  identity: 'admin' | 'user' | 'both' | 'none';  // Where email exists
  warning?: string;  // Present if email exists in both collections
  token: string;
  exp: number;
}
```

**Examples:**

```bash
# Auto-detect collection (email exists only in admins)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Response:
{
  "message": "Login successful",
  "collection": "admins",
  "identity": "admin",
  "token": "...",
  "exp": 1234567890
}

# Email exists in both collections (auto-logs into admin)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "password123"
  }'

# Response:
{
  "message": "Login successful",
  "collection": "admins",
  "identity": "both",
  "warning": "Email exists in both collections. Logged into admin account.",
  "token": "...",
  "exp": 1234567890
}

# Explicitly specify collection
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "collection": "users"
  }'
```

**Behavior:**

- If `collection` not specified: Auto-detects by checking both collections
- If email exists in both: Prioritizes `admins` and includes warning
- If email not found: Defaults to `admins` collection
- Returns identity info showing where email exists

---

### 2. Sign Up - `POST /api/auth/sign-up`

Create new admin or user account with cross-collection duplicate detection.

**Request Body:**

```typescript
{
  name: string;
  email: string;
  password: string;
  collection?: 'admins' | 'users';  // Defaults to 'admins'
}
```

**Response:**

```typescript
{
  message: string;
  user: object;
  collection: 'admins' | 'users';
  identity: 'admin' | 'user' | 'both';
  warning?: string;  // Present if email exists in other collection
}
```

**Examples:**

```bash
# Sign up as admin (default)
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123"
  }'

# Response:
{
  "message": "Admin created successfully",
  "user": { "id": "...", "name": "Admin User", "email": "admin@example.com", "role": "staff" },
  "collection": "admins",
  "identity": "admin"
}

# Sign up as user
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer User",
    "email": "customer@example.com",
    "password": "password123",
    "collection": "users"
  }'

# Response:
{
  "message": "User created successfully",
  "user": { "id": "...", "name": "Customer User", "email": "customer@example.com", "role": "customer" },
  "collection": "users",
  "identity": "user"
}

# Sign up when email already exists in other collection
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate User",
    "email": "existing@example.com",
    "password": "password123",
    "collection": "users"
  }'

# Response (if email exists as admin):
{
  "message": "User created successfully",
  "user": { "id": "...", "name": "Duplicate User", "email": "existing@example.com", "role": "customer" },
  "collection": "users",
  "identity": "both",
  "warning": "Email already exists as admin account"
}
```

**Behavior:**

- Defaults to `admins` if collection not specified
- Checks for duplicates within the specified collection (returns 409 if found)
- Checks if email exists in OTHER collection and includes warning
- Auto-assigns roles: `staff` for admins, `customer` for users
- Allows same email in both collections (duplicate emails across collections)

---

### 3. Check Identity - `POST /api/auth/me`

Check where an email exists before attempting login or signup. This endpoint combines both current user info (GET) and identity checking (POST) functionality.

**Request Body:**

```typescript
{
  email: string;
}
```

**Response:**

```typescript
{
  identity: 'admin' | 'user' | 'both' | 'none';
  collections: ('admins' | 'users')[];
  message: string;
}
```

**Examples:**

```bash
# Check identity for email
curl -X POST http://localhost:3000/api/auth/me \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Response (exists in both):
{
  "identity": "both",
  "collections": ["admins", "users"],
  "message": "Email exists in multiple collections"
}

# Response (exists only as admin):
{
  "identity": "admin",
  "collections": ["admins"],
  "message": "Email exists as admin account"
}

# Response (exists only as user):
{
  "identity": "user",
  "collections": ["users"],
  "message": "Email exists as user account"
}

# Response (doesn't exist):
{
  "identity": "none",
  "collections": [],
  "message": "Email not found in any collection"
}
```

**Use Cases:**

- Pre-login identity check to show appropriate UI
- Frontend form validation before signup
- Account migration/merge workflows
- Admin tools to check account status

---

### 4. Get Current User - `GET /api/auth/me`

Get authenticated user information with identity status.

**Request:**

- Requires authentication cookie (`payload-token`)

**Response:**

```typescript
{
  user: object;
  collection: 'admins' | 'users';
  identity: 'admin' | 'user' | 'both';
}
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: payload-token=..."

# Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  },
  "collection": "admins",
  "identity": "both"  // Email exists in both collections
}
```

**Note:** This endpoint also supports POST method for identity checking (see section 3 above).

---

### 5. Sign Out - `POST /api/auth/sign-out`

Logout from current session.

**Request Body:**

```typescript
{
  collection?: 'admins' | 'users';  // Defaults to 'admins'
}
```

**Response:**

```typescript
{
  message: string;
  collection: 'admins' | 'users';
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -H "Content-Type: application/json" \
  -H "Cookie: payload-token=..." \
  -d '{
    "collection": "admins"
  }'

# Response:
{
  "message": "Signed out successfully",
  "collection": "admins"
}
```

---

## TypeScript Types

All authentication types are defined in `src/types/auth.ts`:

```typescript
// Collection and identity types
export type AuthCollection = 'admins' | 'users';
export type AccountIdentity = 'admin' | 'user' | 'both' | 'none';

// Request types
export interface SignInRequest {
  email: string;
  password: string;
  collection?: AuthCollection;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  collection?: AuthCollection;
}

export interface IdentityCheckRequest {
  email: string;
}

// Response types
export interface AuthResponse {
  message: string;
  user?: any;
  collection?: AuthCollection;
  identity?: AccountIdentity;
  warning?: string;
  token?: string;
  exp?: number;
}

export interface MeResponse {
  user: any;
  collection: AuthCollection;
  identity?: AccountIdentity;
}

export interface IdentityCheckResponse {
  identity: AccountIdentity;
  collections: AuthCollection[];
  message?: string;
}
```

---

## Collection Configuration

### Admins Collection (`src/collections/Admins.ts`)

```typescript
export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: true, // PayloadCMS authentication enabled
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Master', value: 'master' },
        { label: 'Staff', value: 'staff' },
      ],
      defaultValue: 'staff',
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};
```

### Users Collection (`src/collections/Users.ts`)

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // PayloadCMS authentication enabled
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Premium', value: 'premium' },
      ],
      defaultValue: 'customer',
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};
```

---

## Frontend Implementation Examples

### React/Next.js Sign In Form

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

export function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setResult(data);

    if (response.ok) {
      // Show identity info
      if (data.identity === 'both') {
        console.log('User has both admin and user accounts');
      }
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {result?.warning && <Alert variant='warning'>{result.warning}</Alert>}

      <Input
        type='email'
        placeholder='Email'
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        type='password'
        placeholder='Password'
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <Button type='submit'>Sign In</Button>
    </form>
  );
}
```

### Pre-Login Identity Check

```tsx
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function EmailIdentityChecker() {
  const [email, setEmail] = useState('');
  const [identity, setIdentity] = useState<any>(null);

  const checkIdentity = async () => {
    const response = await fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setIdentity(data);
  };

  return (
    <div className='space-y-4'>
      <Input
        type='email'
        placeholder='Check email status'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button onClick={checkIdentity}>Check Identity</Button>

      {identity && (
        <div>
          <Badge
            variant={
              identity.identity === 'both'
                ? 'warning'
                : identity.identity === 'none'
                  ? 'secondary'
                  : 'default'
            }
          >
            {identity.message}
          </Badge>
          {identity.collections.length > 0 && (
            <p>Exists in: {identity.collections.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Key Behaviors & Rules

### 1. Duplicate Email Handling

- ✅ **Allowed**: Same email can exist in both `admins` and `users` collections
- ⚠️ **Priority**: Auto-detection always prioritizes `admins` over `users`
- 📢 **Transparency**: System always reports where email exists via `identity` field

### 2. Auto-Detection Logic

When `collection` parameter is NOT provided in sign-in:

1. Check if email exists in `admins` collection
2. Check if email exists in `users` collection
3. If both: Login to `admins` + show warning
4. If admin only: Login to `admins`
5. If user only: Login to `users`
6. If neither: Default to `admins` (will fail authentication)

### 3. Identity Values

- `'admin'`: Email exists only in admins collection
- `'user'`: Email exists only in users collection
- `'both'`: Email exists in both collections
- `'none'`: Email doesn't exist in either collection (only in check-identity)

### 4. Role Assignment

**Admins:**

- Default role: `'staff'`
- Available roles: `'master'`, `'staff'`

**Users:**

- Default role: `'customer'`
- Available roles: `'customer'`, `'premium'`

---

## Security Considerations

1. **JWT Tokens**: PayloadCMS handles token generation and validation
2. **HTTP-Only Cookies**: Tokens stored in secure HTTP-only cookies
3. **Collection Isolation**: Each collection has separate authentication context
4. **Password Hashing**: PayloadCMS handles password hashing automatically
5. **CORS**: Configure CORS in `payload.config.ts` for production

---

## Migration Notes

If you have existing users and want to migrate them:

1. Both collections support PayloadCMS `auth: true`
2. Use PayloadCMS admin panel to manage users in both collections
3. Export/import users between collections using PayloadCMS API
4. Identity system automatically detects duplicates

---

## Testing

### Test Scenarios

1. **Single Admin Account**: Login should work, identity = 'admin'
2. **Single User Account**: Login should work, identity = 'user'
3. **Duplicate Email**: Login should prioritize admin, identity = 'both', warning present
4. **Explicit Collection**: Should respect collection parameter
5. **Check Identity**: Should correctly report where email exists

### Example Test Commands

```bash
# Create admin
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"test@test.com","password":"pass123"}'

# Create user with same email
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"test@test.com","password":"pass123","collection":"users"}'

# Check identity
curl -X POST http://localhost:3000/api/auth/check-identity \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# Login (should prioritize admin)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

---

## Troubleshooting

### Issue: "Invalid collection specified"

- Ensure `collection` parameter is either `'admins'` or `'users'`

### Issue: Login always goes to admin account

- This is expected behavior when email exists in both collections
- Use explicit `collection` parameter to force login to user account

### Issue: Identity shows 'none' but login succeeds

- Identity 'none' means email wasn't found during pre-check
- Login might succeed if account was created after check

### Issue: Warning not showing for duplicate emails

- Check that both collections have the email
- Verify identity field is 'both' in response

---

## Future Enhancements

Potential improvements for future versions:

- [ ] User preference for default collection in duplicates
- [ ] Admin dashboard to view/manage duplicate accounts
- [ ] Account merging/migration tools
- [ ] Email verification for both collections
- [ ] Two-factor authentication support
- [ ] Social auth with collection selection
- [ ] Audit log for collection switches

---

## Summary

This multi-collection authentication system provides:

✅ Flexible authentication for separate admin and user bases  
✅ Intelligent auto-detection with admin priority  
✅ Full transparency through identity reporting  
✅ Warning system for duplicate emails  
✅ PayloadCMS native implementation  
✅ Type-safe TypeScript interfaces  
✅ Easy frontend integration

The system is production-ready and follows PayloadCMS best practices while providing enhanced functionality for complex authentication scenarios.
