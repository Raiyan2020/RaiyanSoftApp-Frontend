import { apiService, type ApiResponse } from '@/lib/api-service';

export interface AdminNotificationPayload {
  audience: 'all_users' | 'all_admins' | 'users' | 'admins';
  userIds?: Array<number | string>;
  adminIds?: Array<number | string>;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function sendAdminNotification(payload: AdminNotificationPayload) {
  const formData = new FormData();
  formData.append('audience', payload.audience);
  payload.userIds?.forEach((id, index) => {
    formData.append(`user_ids[${index}]`, String(id));
  });
  payload.adminIds?.forEach((id, index) => {
    formData.append(`admin_ids[${index}]`, String(id));
  });
  formData.append('title[ar]', payload.titleAr);
  formData.append('title[en]', payload.titleEn);
  formData.append('description[ar]', payload.descriptionAr);
  formData.append('description[en]', payload.descriptionEn);

  const response = await apiService.post<Record<string, unknown>>('admin/notifications', formData, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
