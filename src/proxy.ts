import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/app'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // For now, we'll allow access but in a real app you'd check:
    // 1. JWT token in cookies/headers
    // 2. PayloadCMS session
    // 3. Redirect to login if not authenticated
    // TODO: Implement proper PayloadCMS authentication check
    // const isAuthenticated = await checkPayloadAuth(request)
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  // Set header for admin routes
  const response = NextResponse.next();
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('x-admin-route', 'true');
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
