import { apiService, type ApiResponse } from '@/lib/api-service';
import type { User } from '@/lib/auth-service';

export interface UpdateUserProfilePayload {
  full_name: string;
  email: string;
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
  formData.append('full_name', payload.full_name);
  formData.append('email', payload.email);

  const response = await apiService.post<User | { user?: User }>('user/profile', formData);

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  const user = unwrapUser(response.data);
  if (!user) throw new Error('Updated profile data is missing.');

  return user;
}
