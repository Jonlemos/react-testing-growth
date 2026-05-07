import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth-utils';

export const POST = async (): Promise<NextResponse> => {
  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
