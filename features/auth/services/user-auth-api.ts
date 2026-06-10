import { apiService, type ApiResponse } from '@/lib/api-service';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function logoutUser() {
  const response = await apiService.post<[] | Record<string, unknown>>('user/auth/logout', undefined, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function deleteUserAccount() {
  const response = await apiService.delete<[] | Record<string, unknown>>('user/auth/delete-account', {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
