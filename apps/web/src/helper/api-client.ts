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
