import { apiService, ApiResponse } from '@/lib/api-service';
import { translateMessage } from '@/lib/i18n-utils';
import type {
  AdminLandingHero,
  AdminSectionHeaderItem,
  AdminService,
  AdminCapability,
  AdminOffer,
  AdminTestimonial,
  AdminHeroPayload,
  AdminSectionHeaderPayload,
  AdminServicePayload,
  AdminCapabilityPayload,
  AdminOfferPayload,
  AdminTestimonialPayload,
  BilingualField,
  AdminTagPayload,
} from '../types/landing-page.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getApiError(response: ApiResponse<unknown>): string {
  if (response.errors && typeof response.errors === 'object') {
    const msgs = Object.values(response.errors).flat();
    if (msgs.length > 0) return msgs.join(' ');
  }
  return translateMessage(response.message || 'Request failed.');
}

/** Converts a BilingualField + key prefix to FormData entries */
function appendBilingual(fd: FormData, key: string, value: BilingualField) {
  fd.append(`${key}[ar]`, value.ar);
  fd.append(`${key}[en]`, value.en);
}

function buildTagsFormData(fd: FormData, tags: AdminTagPayload[]) {
  tags.forEach((tag, i) => {
    fd.append(`tags[${i}][name][ar]`, tag.name.ar);
    fd.append(`tags[${i}][name][en]`, tag.name.en);
    fd.append(`tags[${i}][url]`, tag.url || '');
  });
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export async function fetchAdminHero(): Promise<AdminLandingHero[]> {
  const response = await apiService.get<{ data: AdminLandingHero[] } | AdminLandingHero[]>(
    'admin/landing-page/heroes',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminLandingHero[] } | AdminLandingHero[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminLandingHero[] }).data ?? [];
  return [];
}

export async function updateAdminHero(payload: AdminHeroPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  fd.append('vedio_url', payload.vedio_url || '');
  appendBilingual(fd, 'f_button_text', payload.f_button_text);
  fd.append('f_button_url', payload.f_button_url || '');
  appendBilingual(fd, 'l_button_text', payload.l_button_text);
  fd.append('l_button_url', payload.l_button_url || '');
  fd.append('status', String(payload.status));
  buildTagsFormData(fd, payload.tags);

  const response = await apiService.post<unknown>('admin/landing-page/heroes/update', fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Section header helpers (services / capabilities / offers / testimonials)
// ---------------------------------------------------------------------------

async function fetchSectionHeader(section: string): Promise<AdminSectionHeaderItem | null> {
  const response = await apiService.get<AdminSectionHeaderItem>(
    `admin/landing-page/${section}/header`,
    { skipGlobalToast: true }
  );
  if (!response.status) return null;
  return response.data;
}

async function updateSectionHeader(section: string, payload: AdminSectionHeaderPayload): Promise<void> {
  const body = {
    'title[ar]': payload.title.ar,
    'title[en]': payload.title.en,
    'caption[ar]': payload.caption.ar,
    'caption[en]': payload.caption.en,
    'description[ar]': payload.description.ar,
    'description[en]': payload.description.en,
  };
  const response = await apiService.post<unknown>(
    `admin/landing-page/${section}/header`,
    body,
    { skipGlobalToast: true }
  );
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function fetchAdminServices(): Promise<AdminService[]> {
  const response = await apiService.get<{ data: AdminService[] } | AdminService[]>(
    'admin/landing-page/services',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminService[] } | AdminService[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminService[] }).data ?? [];
  return [];
}

export const fetchAdminServicesHeader = () => fetchSectionHeader('services');
export const updateAdminServicesHeader = (p: AdminSectionHeaderPayload) => updateSectionHeader('services', p);

export async function createAdminService(payload: AdminServicePayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  appendBilingual(fd, 'overview', payload.overview);
  if (payload.image) fd.append('image', payload.image);
  buildTagsFormData(fd, payload.tags);
  const response = await apiService.post<unknown>('admin/landing-page/services', fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminService(id: number, payload: AdminServicePayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  appendBilingual(fd, 'overview', payload.overview);
  if (payload.image) fd.append('image', payload.image);
  buildTagsFormData(fd, payload.tags);
  const response = await apiService.post<unknown>(`admin/landing-page/services/${id}`, fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminService(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/services/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------

export async function fetchAdminCapabilities(): Promise<AdminCapability[]> {
  const response = await apiService.get<{ data: AdminCapability[] } | AdminCapability[]>(
    'admin/landing-page/capabilities',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminCapability[] } | AdminCapability[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminCapability[] }).data ?? [];
  return [];
}

export const fetchAdminCapabilitiesHeader = () => fetchSectionHeader('capabilities');
export const updateAdminCapabilitiesHeader = (p: AdminSectionHeaderPayload) => updateSectionHeader('capabilities', p);

export async function createAdminCapability(payload: AdminCapabilityPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  if (payload.image) fd.append('image', payload.image);
  buildTagsFormData(fd, payload.tags);
  const response = await apiService.post<unknown>('admin/landing-page/capabilities', fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminCapability(id: number, payload: AdminCapabilityPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  if (payload.image) fd.append('image', payload.image);
  buildTagsFormData(fd, payload.tags);
  const response = await apiService.post<unknown>(`admin/landing-page/capabilities/${id}`, fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminCapability(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/capabilities/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------

export async function fetchAdminOffers(): Promise<AdminOffer[]> {
  const response = await apiService.get<{ data: AdminOffer[] } | AdminOffer[]>(
    'admin/landing-page/offers',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminOffer[] } | AdminOffer[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminOffer[] }).data ?? [];
  return [];
}

export const fetchAdminOffersHeader = () => fetchSectionHeader('offers');
export const updateAdminOffersHeader = (p: AdminSectionHeaderPayload) => updateSectionHeader('offers', p);

export async function createAdminOffer(payload: AdminOfferPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'button_text', payload.button_text);
  fd.append('button_url', payload.button_url || '');
  fd.append('most_requested', String(payload.most_requested));
  const response = await apiService.post<unknown>('admin/landing-page/offers', fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminOffer(id: number, payload: AdminOfferPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'button_text', payload.button_text);
  fd.append('button_url', payload.button_url || '');
  fd.append('most_requested', String(payload.most_requested));
  const response = await apiService.post<unknown>(`admin/landing-page/offers/${id}`, fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminOffer(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/offers/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function fetchAdminTestimonials(): Promise<AdminTestimonial[]> {
  const response = await apiService.get<{ data: AdminTestimonial[] } | AdminTestimonial[]>(
    'admin/landing-page/testimonials',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminTestimonial[] } | AdminTestimonial[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminTestimonial[] }).data ?? [];
  return [];
}

export const fetchAdminTestimonialsHeader = () => fetchSectionHeader('testimonials');
export const updateAdminTestimonialsHeader = (p: AdminSectionHeaderPayload) => updateSectionHeader('testimonials', p);

export async function createAdminTestimonial(payload: AdminTestimonialPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  if (payload.image) fd.append('image', payload.image);
  const response = await apiService.post<unknown>('admin/landing-page/testimonials', fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminTestimonial(id: number, payload: AdminTestimonialPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  if (payload.image) fd.append('image', payload.image);
  const response = await apiService.post<unknown>(`admin/landing-page/testimonials/${id}`, fd, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminTestimonial(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/testimonials/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}
