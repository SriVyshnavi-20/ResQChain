// Thin fetch wrapper for the ResQChain API. In development Vite proxies /api to the Express server;
// in production Express serves both the SPA and the API from one origin.
const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
const TOKEN_KEY = 'resqchain_token';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string, remember: boolean) {
    try {
      this.clear();
      (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode) - session lasts until reload */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

async function send(method: string, path: string, body?: unknown): Promise<Response> {
  const token = tokenStore.get();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0, 'NETWORK');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    let code: string | undefined;
    try {
      const data = await res.json();
      if (data?.error?.message) message = data.error.message;
      code = data?.error?.code;
    } catch {
      /* non-JSON error body */
    }
    // An expired/invalid session: let the app sign the user out. (Wrong login credentials are not a session error.)
    if (res.status === 401 && path !== '/auth/login' && onUnauthorized) onUnauthorized();
    throw new ApiError(message, res.status, code);
  }
  return res;
}

async function json<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await send(method, path, body);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => json<T>('GET', path),
  post: <T>(path: string, body?: unknown) => json<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => json<T>('PUT', path, body ?? {}),
  patch: <T>(path: string, body?: unknown) => json<T>('PATCH', path, body ?? {}),
  /** Authenticated file download (the Authorization header can't be sent by a plain <a href>). */
  async download(path: string, fallbackName: string): Promise<void> {
    const res = await send('GET', path);
    const blob = await res.blob();
    const match = /filename="?([^";]+)"?/.exec(res.headers.get('Content-Disposition') ?? '');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = match?.[1] ?? fallbackName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
