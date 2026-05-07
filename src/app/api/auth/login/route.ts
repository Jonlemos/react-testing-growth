import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/constants';
import { createTokens, setAuthCookies } from '@/lib/auth-utils';

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const { email, password } = await request.json();

    // Find user by email (key of our mock)
    const userKey = Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].email === email);
    const user = userKey ? MOCK_USERS[userKey] : null;

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { accessToken, refreshToken } = await createTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      segment: user.segment,
    });

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        segment: user.segment
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
