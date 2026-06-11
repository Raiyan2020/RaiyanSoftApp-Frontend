import { apiService } from '@/lib/api-service';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';

export function getAdminPageSaveUnavailableMessage() {
  return 'About Us editing is not fully supported yet because the backend only stores title and description for these pages.';
}

export async function updateAdminPage(slug: PageSlug, payload: SimplePageForm | AboutUsForm) {
  const formData = new FormData();
  formData.append('title[ar]', payload.title || '');
  formData.append('title[en]', payload.title || '');
  formData.append('description[ar]', payload.description || '');
  formData.append('description[en]', payload.description || '');

  const response = await apiService.post<unknown>(`admin/pages/${slug}`, formData, {
    skipGlobalToast: true,
    skipSuccessToast: true,
  });

  if (!response.status) {
    throw new Error(response.message || getAdminPageSaveUnavailableMessage());
  }
}
