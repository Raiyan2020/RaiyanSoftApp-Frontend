import { apiService, ApiResponse, getApiBaseUrl } from '@/lib/api-service';
import type { AppLanguage } from '@/lib/language';
import { translateMessage } from '@/lib/i18n-utils';
import {
  AboutUsPage,
  PrivacyPolicyPage,
  TermsConditionsPage,
  type AboutUsForm,
  type PageSlug,
  type SimplePageForm,
} from '../types/page.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export function getPageApiSlug(slug: PageSlug) {
  return slug === 'terms-conditions' ? 'terms-and-conditions' : slug;
}

async function fetchPageJson<T>(path: string, language: AppLanguage = 'ar'): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}/${path.replace(/^\//, '')}`, {
    headers: { Accept: 'application/json', 'Accept-Language': language },
    cache: 'no-store',
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!data.status || !data.data) {
    throw new Error(getApiErrorMessage(data));
  }

  return data.data;
}

export async function fetchPrivacyPolicy() {
  const response = await apiService.get<PrivacyPolicyPage>('user/pages/privacy-policy', {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchTermsConditions() {
  const response = await apiService.get<TermsConditionsPage>(`user/pages/${getPageApiSlug('terms-conditions')}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAboutUs() {
  const response = await apiService.get<AboutUsPage>('user/pages/about-us', {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export function fetchPrivacyPolicyServer(language: AppLanguage = 'ar') {
  return fetchPageJson<PrivacyPolicyPage>('user/pages/privacy-policy', language);
}

export function fetchTermsConditionsServer(language: AppLanguage = 'ar') {
  return fetchPageJson<TermsConditionsPage>(`user/pages/${getPageApiSlug('terms-conditions')}`, language);
}

export function fetchAboutUsServer(language: AppLanguage = 'ar') {
  return fetchPageJson<AboutUsPage>('user/pages/about-us', language);
}

type AdminPageResponse = {
  slug: PageSlug;
  title?: Record<string, string> | string;
  description?: Record<string, string> | string;
  image?: string | null;
};

function readLocalizedValue(value: Record<string, string> | string | undefined) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.ar || value.en || '';
}

export async function fetchAdminPage(slug: PageSlug): Promise<AdminPageResponse> {
  const response = await apiService.get<AdminPageResponse>(`admin/pages/${getPageApiSlug(slug)}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAdminPrivacyPolicy(): Promise<SimplePageForm> {
  const page = await fetchAdminPage('privacy-policy');
  return {
    title: readLocalizedValue(page.title),
    description: readLocalizedValue(page.description),
  };
}

export async function fetchAdminTermsConditions(): Promise<SimplePageForm> {
  const page = await fetchAdminPage('terms-conditions');
  return {
    title: readLocalizedValue(page.title) || translateMessage('Terms and Conditions'),
    description: readLocalizedValue(page.description),
  };
}

export async function fetchAdminAboutUs(): Promise<AboutUsForm> {
  const page = await fetchAdminPage('about-us');
  return {
    title: readLocalizedValue(page.title),
    description: readLocalizedValue(page.description),
    caption: '',
    email: '',
    url: '',
  };
}
