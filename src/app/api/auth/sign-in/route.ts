import { getIdentityDetails } from '@/features/auth/services/identity';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function POST(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as {
      email?: string;
      password?: string;
      collection?: string;
    };
    const email = requestBody.email || '';
    const password = requestBody.password || '';
    const collection = requestBody.collection;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Get enhanced identity details
    const enhancedIdentity = await getIdentityDetails(email, payload);

    let targetCollection = collection;
    let warning: string | undefined;

    // Auto-detect collection if not specified
    if (!targetCollection) {
      // Use enhanced identity to determine target collection
      if (
        enhancedIdentity.identityDetails.existsInAdmins &&
        enhancedIdentity.identityDetails.existsInUsers
      ) {
        targetCollection = 'users'; // Priority: users over admins
        warning =
          'Email exists in both collections. Logged into user account.';
      } else if (enhancedIdentity.identityDetails.existsInUsers) {
        targetCollection = 'users';
      } else if (enhancedIdentity.identityDetails.existsInAdmins) {
        targetCollection = 'users'; // Force users collection even for admin accounts
        warning = 'Admin account found but using user collection.';
      } else {
        // Default to users collection
        targetCollection = 'users';
      }
    }

    // Validate collection
    if (!['admins', 'users'].includes(targetCollection)) {
      return NextResponse.json(
        { message: 'Invalid collection specified' },
        { status: 400 }
      );
    }

    // Use PayloadCMS built-in login function
    const result = await payload.login({
      collection: targetCollection as 'admins' | 'users',
      data: {
        email,
        password,
      },
      req: request,
    });

    if (result.token) {
      // Check if account has OAuth linked (after successful login)
      const oauthRecords = await payload.find({
        collection: 'oauth',
        where: {
          and: [
            { userId: { equals: result.user.id } },
            { targetCollection: { equals: targetCollection } },
          ],
        },
      });

      // Update lastLoginAt for user record
      await payload.update({
        collection: targetCollection as 'admins' | 'users',
        id: result.user.id,
        data: {
          lastLoginAt: new Date().toISOString(),
        },
      });

      // Update lastLoginAt for all OAuth records
      if (oauthRecords.docs.length > 0) {
        for (const oauthRecord of oauthRecords.docs) {
          await payload.update({
            collection: 'oauth',
            id: oauthRecord.id,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          });
        }
      }

      // Set the JWT token in a cookie
      const response = NextResponse.json(
        {
          message: 'Login successful',
          user: result.user,
          collection: targetCollection,
          identity: enhancedIdentity.identity,
          identityDetails: enhancedIdentity.identityDetails,
          hasOAuth: oauthRecords.docs.length > 0,
          oauthProviders: oauthRecords.docs.map(o => o.provider),
          ...(warning && { warning }),
          token: result.token,
          exp: result.exp,
        },
        { status: 200 }
      );

      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}
