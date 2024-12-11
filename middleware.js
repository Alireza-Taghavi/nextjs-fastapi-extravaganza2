import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';

  // Check for authentication cookie
  const authToken = request.cookies.get('auth_token')?.value || '';

  // If trying to access public path and already authenticated, redirect
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes
  const protectedAdminPaths = ['/admin', '/admin/users', '/admin/settings'];
  const protectedUserPaths = ['/dashboard', '/profile'];

  // Check admin routes
  if (protectedAdminPaths.includes(path)) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Additional admin role check could be implemented here
  }

  // Check user routes
  if (protectedUserPaths.includes(path)) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile'
  ]
}