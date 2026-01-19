import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { isValidPassword } from '@/lib/validations';

export async function POST(request: NextRequest) {
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

    const requestBody = await request.json() as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };
    const currentPassword = requestBody.currentPassword;
    const newPassword = requestBody.newPassword || '';
    const confirmPassword = requestBody.confirmPassword || '';

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: 'New password and confirmation do not match' },
        { status: 400 }
      );
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        {
          message:
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        },
        { status: 400 }
      );
    }

    // Extract collection from JWT token
    const collection = result.user.collection || 'admins';

    // Check if user has OAuth (can skip current password verification)
    const oauthRecords = await payload.find({
      collection: 'oauth',
      where: {
        and: [
          { userId: { equals: result.user.id } },
          { targetCollection: { equals: collection } },
        ],
      },
    });

    const hasOAuth = oauthRecords.docs.length > 0;

    // For non-OAuth users, verify current password
    if (!hasOAuth && currentPassword) {
      try {
        await payload.login({
          collection,
          data: {
            email: result.user.email,
            password: currentPassword,
          },
        });
      } catch {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    }

    // Update password
    await payload.update({
      collection,
      id: result.user.id,
      data: {
        password: newPassword,
      },
    });

    return NextResponse.json(
      {
        message: 'Password updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
