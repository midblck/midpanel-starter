import type { AccountIdentity } from '@/types/auth';
import type { Payload } from 'payload';

export interface IdentityDetails {
  existsInAdmins: boolean;
  existsInUsers: boolean;
  hasOAuthInAdmins: boolean;
  hasOAuthInUsers: boolean;
}

export interface EnhancedIdentity {
  identity: AccountIdentity;
  identityDetails: IdentityDetails;
}

/**
 * Get enhanced identity information for a user email
 * Checks both collections and OAuth connections
 */
export async function getIdentityDetails(
  email: string,
  payload: Payload
): Promise<EnhancedIdentity> {
  // Check which collections have this email
  const [adminResult, userResult] = await Promise.all([
    payload.find({
      collection: 'admins',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    }),
    payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    }),
  ]);

  const existsInAdmins = adminResult.docs.length > 0;
  const existsInUsers = userResult.docs.length > 0;

  // Check OAuth connections for each collection
  const [adminOAuth, userOAuth] = await Promise.all([
    existsInAdmins
      ? payload.find({
          collection: 'oauth',
          where: {
            and: [
              { userId: { equals: adminResult.docs[0].id } },
              { targetCollection: { equals: 'admins' } },
            ],
          },
        })
      : { docs: [] },
    existsInUsers
      ? payload.find({
          collection: 'oauth',
          where: {
            and: [
              { userId: { equals: userResult.docs[0].id } },
              { targetCollection: { equals: 'users' } },
            ],
          },
        })
      : { docs: [] },
  ]);

  const hasOAuthInAdmins = adminOAuth.docs.length > 0;
  const hasOAuthInUsers = userOAuth.docs.length > 0;

  // Determine simple identity
  let identity: AccountIdentity;
  if (existsInAdmins && existsInUsers) {
    identity = 'both';
  } else if (existsInAdmins) {
    identity = 'admin';
  } else if (existsInUsers) {
    identity = 'user';
  } else {
    identity = 'none';
  }

  return {
    identity,
    identityDetails: {
      existsInAdmins,
      existsInUsers,
      hasOAuthInAdmins,
      hasOAuthInUsers,
    },
  };
}

/**
 * Get enhanced identity for a specific user (by ID and collection)
 * Used when we already know the user and want their full identity details
 */
export async function getIdentityDetailsForUser(
  userId: string,
  collection: 'admins' | 'users',
  payload: Payload
): Promise<EnhancedIdentity> {
  // Get the user first
  const user = await payload.findByID({
    collection,
    id: userId,
  });

  // Get identity details using their email
  return getIdentityDetails(user.email, payload);
}
