import { apiService, type ApiResponse } from '@/lib/api-service';

export interface ManagedCountry {
  id: number;
  name: string;
  country_code: string;
  phone_code: string;
}

export const countriesKeys = {
  all: ['managed-countries'] as const,
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchManagedCountries() {
  const response = await apiService.get<ManagedCountry[]>('user/countries', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
