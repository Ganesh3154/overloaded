import { apiClient } from '../helper/api-client';

interface RegisterCredentialDto {
  fullName: string;
  email: string;
  password: string;
}

interface LoginCredentialDto {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  isOnboarded: boolean;
}

interface GoogleAuthUrlResponse {
  url: string;
}

function persistAuthResponse(response: AuthResponse) {
  localStorage.setItem('access_token', response.accessToken);
  localStorage.setItem('is_onboarded', String(response.isOnboarded));
  return response;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('is_onboarded');
}

export async function register(credential: RegisterCredentialDto) {
  const response = await apiClient.post<AuthResponse>(
    '/auth/register',
    credential,
  );
  return persistAuthResponse(response);
}

export async function login(credential: LoginCredentialDto) {
  const response = await apiClient.post<AuthResponse>(
    '/auth/login',
    credential,
  );
  return persistAuthResponse(response);
}

export async function redirectToGoogleLogin() {
  const { url } = await apiClient.get<GoogleAuthUrlResponse>(
    '/auth/google/url',
    { credentials: 'include' },
  );
  window.location.href = url;
}

export function completeGoogleLogin(hash: string): AuthResponse | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const accessToken = params.get('accessToken');
  const isOnboarded = params.get('isOnboarded');

  if (!accessToken || isOnboarded === null) return null;

  return persistAuthResponse({
    accessToken,
    isOnboarded: isOnboarded === 'true',
  });
}
