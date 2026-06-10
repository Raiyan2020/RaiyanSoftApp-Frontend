import { apiService } from '@/lib/api-service';
import { translateMessage } from '@/lib/i18n-utils';

export interface AdminProfileData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  admin_code: string;
  is_block: boolean;
  created_at: string | null;
}

export interface UpdateAdminProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
}

export async function fetchAdminProfile(): Promise<AdminProfileData | null> {
  const response = await apiService.get<AdminProfileData>('admin/profile', {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return response.data;
}

export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload
): Promise<AdminProfileData> {
  const response = await apiService.post<AdminProfileData>('admin/profile', payload, {
    skipGlobalToast: true,
  });
  if (!response.status) {
    const errors = response.errors;
    if (errors && typeof errors === 'object') {
      const msgs = Object.values(errors).flat();
      if (msgs.length > 0) throw new Error(msgs.join(' '));
    }
    throw new Error(translateMessage(response.message || 'Failed to update profile'));
  }
  return response.data;
}
