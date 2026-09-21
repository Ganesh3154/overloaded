import { apiClient } from '../helper/api-client';

export async function getCompanies(): Promise<{ id: number; name: string }[]> {
  return await apiClient.get('/company');
}
