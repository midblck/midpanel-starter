import { getIdentityDetails } from '@/features/auth/services/identity';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function POST(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      collection?: string;
    };
    const name = requestBody.name || '';
    const email = requestBody.email || '';
    const password = requestBody.password || '';
    const collection = (requestBody.collection || 'users') as
      | 'admins'
      | 'users';

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate collection
    if (!['admins', 'users'].includes(collection)) {
      return NextResponse.json(
        { message: 'Invalid collection specified' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Check if user already exists in the specified collection
    const existingUser = await payload.find({
      collection,
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      return NextResponse.json(
        {
          message: `${collection === 'admins' ? 'Admin' : 'User'} with this email already exists`,
        },
        { status: 409 }
      );
    }

    // Get enhanced identity details
    const enhancedIdentity = await getIdentityDetails(email, payload);

    let warning: string | undefined;

    // Check if email exists in the OTHER collection
    const otherCollection = collection === 'admins' ? 'users' : 'admins';
    const existsInOtherCollection =
      otherCollection === 'admins'
        ? enhancedIdentity.identityDetails.existsInAdmins
        : enhancedIdentity.identityDetails.existsInUsers;

    if (existsInOtherCollection) {
      warning = `Email already exists as ${otherCollection === 'admins' ? 'admin' : 'user'} account`;
    }

    // Prepare data based on collection
    const userData =
      collection === 'admins'
        ? {
            name,
            email,
            password,
            role: 'staff' as const,
          }
        : {
            name,
            email,
            password,
            role: 'customer' as const,
          };

    // Use PayloadCMS built-in create function
    const user = await payload.create({
      collection,
      data: userData,
    });

    // Check if OAuth exists for this email and link it
    const existingOAuth = await payload.find({
      collection: 'oauth',
      where: {
        providerEmail: { equals: email },
      },
    });

    // If OAuth exists, link it to the new account
    if (existingOAuth.docs.length > 0) {
      for (const oauthRecord of existingOAuth.docs) {
        await payload.update({
          collection: 'oauth',
          id: oauthRecord.id,
          data: {
            userId: user.id,
            targetCollection: collection,
          },
        });
      }

      // Update user to remove hasOAuthOnly flag if it exists
      if (user.hasOAuthOnly) {
        await payload.update({
          collection: collection,
          id: user.id,
          data: {
            hasOAuthOnly: false,
          },
        });
      }

      const oauthProviders = existingOAuth.docs.map(o => o.provider).join(', ');
      warning = warning
        ? `${warning}. Also linked to existing ${oauthProviders} OAuth`
        : `Account linked to existing ${oauthProviders} OAuth`;
    }

    return NextResponse.json(
      {
        message: `${collection === 'admins' ? 'Admin' : 'User'} created successfully`,
        user,
        collection,
        identity: enhancedIdentity.identity,
        identityDetails: enhancedIdentity.identityDetails,
        hasOAuth: existingOAuth.docs.length > 0,
        oauthProviders: existingOAuth.docs.map(o => o.provider),
        ...(warning && { warning }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign up' },
      { status: 500 }
    );
  }
}
