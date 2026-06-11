import { BASE_URL, apiService, type ApiResponse } from '@/lib/api-service';
import { AdminCountry, CountryPayload } from '../types/admin-country.types';

type CountryFieldErrors = Record<string, string[]>;

export class CountryApiError extends Error {
  fieldErrors?: CountryFieldErrors;

  constructor(message: string, fieldErrors?: CountryFieldErrors) {
    super(message);
    this.name = 'CountryApiError';
    Object.setPrototypeOf(this, CountryApiError.prototype);
    this.fieldErrors = fieldErrors;
  }
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function getFieldErrors(response: ApiResponse<unknown>): CountryFieldErrors | undefined {
  if (!response.errors || typeof response.errors !== 'object') return undefined;
  const entries = Object.entries(response.errors).filter(([, value]) => Array.isArray(value) && value.length > 0);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries.map(([key, value]) => [key, value.map(String)]));
}

function throwCountryError(response: ApiResponse<unknown>) {
  throw new CountryApiError(getApiErrorMessage(response), getFieldErrors(response));
}

export function getAdminCountryImageUrl(image: string | null | undefined) {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }

  const siteBase = BASE_URL.replace(/\/api\/?$/, '');
  return `${siteBase}/storage/${image.replace(/^\/+/, '')}`;
}

function buildCountryFormData(payload: CountryPayload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('country_code', payload.country_code);
  formData.append('phone_code', payload.phone_code);
  formData.append('is_active', payload.is_active ? '1' : '0');

  if (payload.image) {
    formData.append('image', payload.image);
  }

  return formData;
}

export async function fetchAdminCountries() {
  const response = await apiService.get<AdminCountry[]>('admin/countries', {
    skipGlobalToast: true,
  });

  const rawData = response.data as any;
  const countries = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];

  if (!response.status || !Array.isArray(countries)) {
    throwCountryError(response);
  }

  return countries as AdminCountry[];
}

export async function fetchAdminCountry(id: number | string) {
  const response = await apiService.get<AdminCountry>(`admin/countries/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throwCountryError(response);
  }

  return response.data;
}

export async function createAdminCountry(payload: CountryPayload) {
  const response = await apiService.post<AdminCountry>('admin/countries', buildCountryFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throwCountryError(response);
  }

  return response.data;
}

export async function updateAdminCountry(id: number | string, payload: CountryPayload) {
  const response = await apiService.post<AdminCountry>(`admin/countries/${id}`, buildCountryFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throwCountryError(response);
  }

  return response.data;
}

export async function deleteAdminCountry(id: number | string) {
  const response = await apiService.delete<unknown>(`admin/countries/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throwCountryError(response);
  }

  return response;
}
