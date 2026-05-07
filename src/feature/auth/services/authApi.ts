import type { LoginCredentials, LoginResponse } from "../types";

// O refresh token é gerenciado de forma transparente pelo proxy.ts (Next.js 16).
// Quando o accessToken expira, o proxy valida o refreshToken e emite um novo
// accessToken automaticamente, sem nenhuma lógica extra no cliente.
// O cliente só precisa tratar o erro { code: 'AUTH_EXPIRED' } quando o
// refreshToken também estiver expirado — o que significa fim de sessão.

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include', // garante envio dos cookies httpOnly
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Lança um erro tipado para que o useAuth possa tratar o fim de sessão
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