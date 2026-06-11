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
  AdminFaq,
  AdminFaqHeaderItem,
  AdminFaqPayload,
  AdminAboutUsCard,
  AdminAboutUsCardPayload,
  AdminAboutUsSubmission,
  AdminAboutUsSubmissionListResult,
  AdminBanner,
  AdminBannerPayload,
  AdminSiteSettings,
  AdminSiteSettingsPayload,
  AdminSocialMediaItem,
  AdminSocialMediaPayload,
  BilingualField,
  AdminTagPayload,
} from '../types/landing-page.types';
import { normalizeLandingButtonUrlForApi } from './landing-button-url';

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
    fd.append(`tags[${i}][url]`, normalizeLandingButtonUrlForApi(tag.url || ''));
  });
}

function appendIfPresent(fd: FormData, key: string, value?: string | null) {
  if (value !== undefined && value !== null) fd.append(key, value);
}

function normalizeWrappedData<T>(data: T | { data?: T } | { data: T[] } | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && 'data' in data) {
    const next = (data as { data?: T | T[] }).data;
    if (Array.isArray(next)) return next;
    if (next) return [next as T];
  }
  return [data as T];
}

function normalizeWrappedItem<T>(data: T | { data?: T } | null | undefined): T | null {
  if (!data) return null;
  if (typeof data === 'object' && 'data' in data) {
    return (data as { data?: T }).data ?? null;
  }
  return data as T;
}

function extractPagination(response: ApiResponse<unknown>) {
  const pagination = (response as ApiResponse<unknown> & {
    pagination?: { current_page: number; last_page: number; per_page: number; total: number };
  }).pagination;
  return pagination ?? null;
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
  if (data && typeof data === 'object') return [data as AdminLandingHero];
  return [];
}

export async function updateAdminHero(payload: AdminHeroPayload): Promise<void> {
  const fd = new FormData();
  appendBilingual(fd, 'title', payload.title);
  appendBilingual(fd, 'caption', payload.caption);
  appendBilingual(fd, 'description', payload.description);
  fd.append('vedio_url', payload.vedio_url || '');
  appendBilingual(fd, 'f_button_text', payload.f_button_text);
  fd.append('f_button_url', normalizeLandingButtonUrlForApi(payload.f_button_url || ''));
  appendBilingual(fd, 'l_button_text', payload.l_button_text);
  fd.append('l_button_url', normalizeLandingButtonUrlForApi(payload.l_button_url || ''));
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
  const body = new FormData();
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('caption[ar]', payload.caption.ar);
  body.append('caption[en]', payload.caption.en);
  body.append('description[ar]', payload.description.ar);
  body.append('description[en]', payload.description.en);
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
  fd.append('button_url', normalizeLandingButtonUrlForApi(payload.button_url || ''));
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
  fd.append('button_url', normalizeLandingButtonUrlForApi(payload.button_url || ''));
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

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export async function fetchAdminFaqs(): Promise<AdminFaq[]> {
  const response = await apiService.get<{ data: AdminFaq[] } | AdminFaq[]>(
    'admin/landing-page/faqs',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  const data = response.data as { data: AdminFaq[] } | AdminFaq[];
  if (Array.isArray(data)) return data;
  if (data && 'data' in data) return (data as { data: AdminFaq[] }).data ?? [];
  return [];
}

export async function fetchAdminFaqsHeader(): Promise<AdminFaqHeaderItem | null> {
  const response = await apiService.get<AdminFaqHeaderItem>('admin/landing-page/faqs/header', {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return response.data;
}

export async function updateAdminFaqsHeader(payload: AdminSectionHeaderPayload): Promise<void> {
  const body = new FormData();
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('caption[ar]', payload.caption.ar);
  body.append('caption[en]', payload.caption.en);
  body.append('description[ar]', payload.description.ar);
  body.append('description[en]', payload.description.en);
  const response = await apiService.post<unknown>('admin/landing-page/faqs/header', body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function createAdminFaq(payload: AdminFaqPayload): Promise<void> {
  const body = new FormData();
  body.append('question[ar]', payload.question.ar);
  body.append('question[en]', payload.question.en);
  body.append('answer[ar]', payload.answer.ar);
  body.append('answer[en]', payload.answer.en);
  const response = await apiService.post<unknown>('admin/landing-page/faqs', body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminFaq(id: number, payload: AdminFaqPayload): Promise<void> {
  const body = new FormData();
  body.append('question[ar]', payload.question.ar);
  body.append('question[en]', payload.question.en);
  body.append('answer[ar]', payload.answer.ar);
  body.append('answer[en]', payload.answer.en);
  const response = await apiService.post<unknown>(`admin/landing-page/faqs/${id}`, body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminFaq(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/faqs/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// About Us
// ---------------------------------------------------------------------------

export async function fetchAdminAboutUsHeader(): Promise<AdminSectionHeaderItem | null> {
  const response = await apiService.get<AdminSectionHeaderItem>('admin/landing-page/about-us/header', {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return normalizeWrappedItem(response.data);
}

export async function updateAdminAboutUsHeader(payload: AdminSectionHeaderPayload): Promise<void> {
  const body = new FormData();
  appendBilingual(body, 'title', payload.title);
  appendBilingual(body, 'caption', payload.caption);
  appendBilingual(body, 'description', payload.description);
  const response = await apiService.post<unknown>('admin/landing-page/about-us/header', body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function fetchAdminAboutUsCards(): Promise<AdminAboutUsCard[]> {
  const response = await apiService.get<AdminAboutUsCard[] | { data: AdminAboutUsCard[] }>(
    'admin/landing-page/about-us',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  return normalizeWrappedData(response.data as any);
}

export async function createAdminAboutUsCard(payload: AdminAboutUsCardPayload): Promise<void> {
  const body = new FormData();
  appendBilingual(body, 'title', payload.title);
  appendBilingual(body, 'description', payload.description);
  if (payload.image) body.append('image', payload.image);
  const response = await apiService.post<unknown>('admin/landing-page/about-us', body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminAboutUsCard(id: number, payload: AdminAboutUsCardPayload): Promise<void> {
  const body = new FormData();
  appendBilingual(body, 'title', payload.title);
  appendBilingual(body, 'description', payload.description);
  if (payload.image) body.append('image', payload.image);
  const response = await apiService.post<unknown>(`admin/landing-page/about-us/${id}`, body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminAboutUsCard(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/about-us/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export async function fetchAdminAboutUsSubmissions(params?: {
  page?: number;
  per_page?: number;
}): Promise<AdminAboutUsSubmissionListResult> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));

  const response = await apiService.get<AdminAboutUsSubmission[] | { data: AdminAboutUsSubmission[] }>(
    `admin/landing-page/about-us/submissions${query.toString() ? `?${query.toString()}` : ''}`,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    return { submissions: [], pagination: null };
  }

  const data = normalizeWrappedData(response.data as any);
  return {
    submissions: data,
    pagination: extractPagination(response),
  };
}

export async function fetchAdminAboutUsSubmission(id: number): Promise<AdminAboutUsSubmission | null> {
  const response = await apiService.get<AdminAboutUsSubmission>(`admin/landing-page/about-us/submissions/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return normalizeWrappedItem(response.data);
}

export async function deleteAdminAboutUsSubmission(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/landing-page/about-us/submissions/${id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

async function fetchAdminBanner(slug: string): Promise<AdminBanner | null> {
  const response = await apiService.get<AdminBanner>(`admin/landing-page/banners/${slug}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return normalizeWrappedItem(response.data);
}

async function updateAdminBanner(slug: string, payload: AdminBannerPayload): Promise<void> {
  const body = new FormData();
  appendBilingual(body, 'caption', payload.caption);
  appendBilingual(body, 'title', payload.title);
  appendBilingual(body, 'description', payload.description);
  appendBilingual(body, 'button_text', payload.button_text);
  appendIfPresent(body, 'button_url', normalizeLandingButtonUrlForApi(payload.button_url || ''));
  const response = await apiService.post<unknown>(`admin/landing-page/banners/${slug}`, body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

export const fetchAdminIdeaBanner = () => fetchAdminBanner('idea');
export const fetchAdminProjectBanner = () => fetchAdminBanner('project');
export const fetchAdminFooterBanner = () => fetchAdminBanner('footer');
export const updateAdminIdeaBanner = (payload: AdminBannerPayload) => updateAdminBanner('idea', payload);
export const updateAdminProjectBanner = (payload: AdminBannerPayload) => updateAdminBanner('project', payload);
export const updateAdminFooterBanner = (payload: AdminBannerPayload) => updateAdminBanner('footer', payload);

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function fetchAdminSiteSettings(): Promise<AdminSiteSettings | null> {
  const response = await apiService.get<AdminSiteSettings>('admin/site-settings', {
    skipGlobalToast: true,
  });
  if (!response.status) return null;
  return normalizeWrappedItem(response.data);
}

export async function updateAdminSiteSettings(payload: AdminSiteSettingsPayload): Promise<void> {
  const body = new FormData();
  appendBilingual(body, 'site_name', payload.site_name);
  appendBilingual(body, 'site_description', payload.site_description);
  appendBilingual(body, 'first_footer_text', payload.first_footer_text);
  appendBilingual(body, 'second_footer_text', payload.second_footer_text);
  appendIfPresent(body, 'site_email', payload.site_email);
  appendIfPresent(body, 'site_phone', payload.site_phone);
  if (payload.site_logo) body.append('site_logo', payload.site_logo);
  if (payload.site_favicon) body.append('site_favicon', payload.site_favicon);
  const response = await apiService.post<unknown>('admin/site-settings', body, {
    skipGlobalToast: true,
  });
  if (!response.status) throw new Error(getApiError(response));
}

// ---------------------------------------------------------------------------
// Social media
// ---------------------------------------------------------------------------

export async function fetchAdminSocialMedia(): Promise<AdminSocialMediaItem[]> {
  const response = await apiService.get<AdminSocialMediaItem[] | { data: AdminSocialMediaItem[] }>(
    'admin/social-media',
    { skipGlobalToast: true }
  );
  if (!response.status) return [];
  return normalizeWrappedData(response.data as any);
}

export async function createAdminSocialMedia(payload: AdminSocialMediaPayload): Promise<void> {
  const body = new FormData();
  body.append('platform', payload.platform);
  body.append('link', payload.link);
  if (payload.image) body.append('image', payload.image);
  const response = await apiService.post<unknown>('admin/social-media', body, { skipGlobalToast: true });
  if (!response.status) throw new Error(getApiError(response));
}

export async function updateAdminSocialMedia(id: number, payload: AdminSocialMediaPayload): Promise<void> {
  const body = new FormData();
  body.append('platform', payload.platform);
  body.append('link', payload.link);
  if (payload.image) body.append('image', payload.image);
  const response = await apiService.post<unknown>(`admin/social-media/${id}`, body, { skipGlobalToast: true });
  if (!response.status) throw new Error(getApiError(response));
}

export async function deleteAdminSocialMedia(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/social-media/${id}`, { skipGlobalToast: true });
  if (!response.status) throw new Error(getApiError(response));
}
