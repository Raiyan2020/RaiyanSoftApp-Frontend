import { apiService, type ApiResponse } from '@/lib/api-service';
import type { User } from '@/lib/auth-service';

export interface UpdateUserProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code?: string;
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function unwrapUser(data: User | { user?: User } | null): User | null {
  if (!data) return null;
  if ('user' in data && data.user) return data.user;
  return data as User;
}

export async function fetchUserProfile() {
  const response = await apiService.get<User | { user?: User }>('user/profile', {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  const user = unwrapUser(response.data);
  if (!user) throw new Error('Profile data is missing.');

  return user;
}

export async function updateUserProfile(payload: UpdateUserProfilePayload) {
  const formData = new FormData();
  formData.append('first_name', payload.first_name);
  formData.append('last_name', payload.last_name);
  formData.append('email', payload.email);
  formData.append('phone', payload.phone);

  if (payload.country_code) {
    formData.append('country_code', payload.country_code);
  }

  const response = await apiService.post<User | { user?: User }>('user/profile', formData);

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  const user = unwrapUser(response.data);
  if (!user) throw new Error('Updated profile data is missing.');

  return user;
}
