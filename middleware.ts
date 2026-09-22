import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require a signed-in user. `/profile` used to be absent here, so
// an anonymous visitor rendered the whole signed-in profile UI (it fell back to
// a hardcoded placeholder user), which is how the navbar could show "Login"
// while the page body showed "Logout".
const USER_PROTECTED = ['/profile'];

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

/**
 * Asks the backend whether a token is still good.
 *
 * Presence of a cookie proves nothing: tokens expire, get revoked server-side,
 * or survive a database reset. The old middleware only checked that the cookie
 * existed, so a stale token sailed past the guard and every subsequent API call
 * 401'd instead — leaving the user on a shell of a page they were not entitled
 * to see, still holding the dead credential.
 *
 * Returns 'valid' | 'invalid' | 'unknown'. 'unknown' means we could not reach
 * the backend, and the caller must NOT delete the token on that basis — a
 * flaky network or a backend restart would otherwise sign everybody out.
 */
async function verifyToken(token: string, scope: 'user' | 'admin'): Promise<'valid' | 'invalid' | 'unknown'> {
  if (!API_BASE) return 'unknown';

  try {
    const response = await fetch(`${API_BASE}/${scope}/profile`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      // Never serve a cached verdict: that is the difference between "signed
      // out five minutes ago" and "still holding a revoked token".
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });

    if (response.status === 401 || response.status === 403) return 'invalid';
    if (response.ok) return 'valid';
    // 5xx and anything else is the backend's problem, not the token's.
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Redirect to `destination` and drop the dead cookie on the way out. */
function signOut(request: NextRequest, destination: string, cookieName: string) {
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.delete(cookieName);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get('admin_token')?.value;
  const userToken = request.cookies.get('user_token')?.value;

  // 1. Admin portal
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // Only bounce an already-authenticated admin away from the login page if
      // the token actually works; otherwise they could never reach the form to
      // fix a stale session.
      if (adminToken && (await verifyToken(adminToken, 'admin')) === 'valid') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if ((await verifyToken(adminToken, 'admin')) === 'invalid') {
      return signOut(request, '/admin/login', 'admin_token');
    }
  }

  // 2. User-protected routes
  if (USER_PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if ((await verifyToken(userToken, 'user')) === 'invalid') {
      return signOut(request, '/login', 'user_token');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/profile'],
};
