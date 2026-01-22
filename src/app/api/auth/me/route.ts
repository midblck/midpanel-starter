import {
  getIdentityDetails,
  getIdentityDetailsForUser,
} from '@/features/auth/services/identity';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // Use PayloadCMS built-in auth function to get current user
    const result = await payload.auth({ headers: request.headers });

    if (!result.user) {
      return NextResponse.json(
        { message: 'No authenticated user' },
        { status: 401 }
      );
    }

    // Extract collection from JWT token or determine from user data
    // PayloadCMS JWT tokens contain collection information
    const collection = result.user.collection || 'admins';

    // Get enhanced identity details
    const enhancedIdentity = await getIdentityDetailsForUser(
      result.user.id,
      collection,
      payload
    );

    // Get OAuth connections for this user
    const oauthRecords = await payload.find({
      collection: 'oauth',
      where: {
        and: [
          { userId: { equals: result.user.id } },
          { targetCollection: { equals: collection } },
        ],
      },
    });

    // Return the user data with collection and enhanced identity information
    return NextResponse.json(
      {
        user: result.user,
        collection,
        identity: enhancedIdentity.identity,
        identityDetails: enhancedIdentity.identityDetails,
        hasOAuth: oauthRecords.docs.length > 0,
        oauthProviders: oauthRecords.docs.map(o => o.provider),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { message: 'Authentication verification failed' },
      { status: 401 }
    );
  }
}

// POST method for identity checking (combines check-identity functionality)
export async function POST(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as { email?: string };
    const email = requestBody.email || '';

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Get enhanced identity details
    const enhancedIdentity = await getIdentityDetails(email, payload);

    // Build collections array for backward compatibility
    const collections: ('admins' | 'users')[] = [];
    if (enhancedIdentity.identityDetails.existsInAdmins)
      collections.push('admins');
    if (enhancedIdentity.identityDetails.existsInUsers)
      collections.push('users');

    let message: string;
    if (enhancedIdentity.identity === 'both') {
      message = 'Email exists in multiple collections';
    } else if (enhancedIdentity.identity === 'admin') {
      message = 'Email exists as admin account';
    } else if (enhancedIdentity.identity === 'user') {
      message = 'Email exists as user account';
    } else {
      message = 'Email not found in any collection';
    }

    return NextResponse.json(
      {
        identity: enhancedIdentity.identity,
        identityDetails: enhancedIdentity.identityDetails,
        collections,
        message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Identity check error:', error);
    return NextResponse.json(
      { message: 'An error occurred during identity check' },
      { status: 500 }
    );
  }
}
