import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, createTokens, setAuthCookies } from '@/lib/auth-utils';
import { MOCK_USERS } from '@/lib/constants';

export const POST = async (): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
  }

  const payload = await verifyToken(refreshToken);
  if (!payload || !payload.sub) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }

  // Find user in mock
  const user = Object.values(MOCK_USERS).find(u => u.id === payload.sub);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  const tokens = await createTokens(user);
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);

  return NextResponse.json({ success: true });
}
