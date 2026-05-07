import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { JWT_SECRET, MOCK_USERS, ACCESS_TOKEN_EXPIRES } from './lib/constants';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth/') || !pathname.startsWith('/api/portal')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      const response = NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers),
            'x-user-id': payload.sub as string,
            'x-user-segment': payload.segment as string,
          }),
        },
      });
      return response;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload: refreshPayload } = await jwtVerify(refreshToken, JWT_SECRET);

    const user = Object.values(MOCK_USERS).find(u => u.id === refreshPayload.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    const newAccessToken = await new SignJWT({
      sub: user.id,
      name: user.name,
      segment: user.segment,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRES)
      .sign(JWT_SECRET);
    const response = NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-user-id': user.id,
          'x-user-segment': user.segment,
        }),
      },
    });

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutos
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Session expired', code: 'AUTH_EXPIRED' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/portal/:path*'],
};
