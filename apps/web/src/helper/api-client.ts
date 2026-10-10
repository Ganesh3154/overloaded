export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// A 401 on a request that carried a token means the session itself is
// invalid (expired/revoked) rather than e.g. bad login credentials — those
// go through /auth/login with no token attached at all, so they never hit
// this path. Bounce the user back to login rather than leaving them staring
// at a page full of failed queries.
function handleExpiredSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('is_onboarded');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?error=session_expired';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const clientToken =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...(clientToken ? { Authorization: `Bearer ${clientToken}` } : {}),
      ...init?.headers, // explicit headers (e.g. server-side withAuth) take precedence
    },
  });

  if (!res.ok) {
    if (res.status === 401 && clientToken) {
      handleExpiredSession();
    }
    const err = (await res.json()) as ApiError;
    throw new ApiClientError(err.statusCode, err.message, err.error);
  }

  const body = (await res.json()) as ApiResponse<T>;
  return body.data;
}

function withAuth(token: string): RequestInit {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const apiClient = {
  get<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: 'GET' });
  },
  post<T>(path: string, body: unknown, init?: RequestInit) {
    return request<T>(path, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  patch<T>(path: string, body: unknown, init?: RequestInit) {
    return request<T>(path, {
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  delete<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: 'DELETE' });
  },
  withAuth,
};
