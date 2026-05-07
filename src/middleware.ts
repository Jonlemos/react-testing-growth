import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from './lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith('/api/auth/login') || !pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    // Check for refresh token to give feedback to the client
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (refreshToken && pathname.startsWith('/api')) {
       // Real implementation would try to validate the refresh token and continue
       return NextResponse.json({ error: 'Token expired', code: 'AUTH_EXPIRED' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);
    
    // Injecting flags in the header to facilitate frontend consumption
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub as string);
    response.headers.set('x-user-segment', payload.segment as string);
    
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/offers/:path*', '/api/auth/refresh'],
};
