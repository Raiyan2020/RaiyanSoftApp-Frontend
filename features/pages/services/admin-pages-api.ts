import { apiService, ApiResponse } from '@/lib/api-service';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function updateAdminPage(slug: PageSlug, payload: SimplePageForm | AboutUsForm) {
  const response = await apiService.post<Record<string, unknown>>(`admin/pages/${slug}`, payload, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
