import type { LoginCredentials, LoginResponse } from "../types";

// The refresh token is managed transparently by proxy.ts (Next.js 16).
// When the accessToken expires, the proxy validates the refreshToken and issues a new
// accessToken automatically, with no additional logic in the client.
// The client only needs to handle the error { code: 'AUTH_EXPIRED' } when the
// refreshToken is also expired — which means end of session.

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body?.error ?? `HTTP error ${res.status}`);
    (err as any).code = body?.code;
    throw err;
  }

  return res.json() as Promise<T>;
}

export const AuthApi = {
  login: (credentials: LoginCredentials) =>
    http<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    http<void>('/api/auth/logout', { method: 'POST' }),
};