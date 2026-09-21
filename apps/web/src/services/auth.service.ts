import { apiClient } from "../helper/api-client";

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

export async function register(credential: RegisterCredentialDto) {
  const response = await apiClient.post<AuthResponse>("/auth/register", credential);
  localStorage.setItem("access_token", response.accessToken);
  localStorage.setItem("is_onboarded", String(response.isOnboarded));
  return response;
}

export async function login(credential: LoginCredentialDto) {
  const response = await apiClient.post<AuthResponse>("/auth/login", credential);
  localStorage.setItem("access_token", response.accessToken);
  localStorage.setItem("is_onboarded", String(response.isOnboarded));
  return response;
}
