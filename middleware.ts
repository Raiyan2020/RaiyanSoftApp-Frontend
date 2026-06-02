import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get('admin_token')?.value;
  const userToken = request.cookies.get('user_token')?.value;

  // 1. Admin Portal Protection
  if (pathname.startsWith('/admin')) {
    // If trying to access admin login page while already authenticated
    if (pathname === '/admin/login') {
      if (adminToken) {
        return NextResponse.redirect(new URL('/admin/projects', request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. User Protected Routes (e.g. /home or other dashboard pages)
  // If you want to protect /home, uncomment the block below:
  /*
  const userProtectedPaths = ['/home'];
  const isUserProtected = userProtectedPaths.some(path => pathname.startsWith(path));
  
  if (isUserProtected && !userToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  */

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/admin/:path*',
    // Add other routes here if you wish to run middleware on them
  ],
};
