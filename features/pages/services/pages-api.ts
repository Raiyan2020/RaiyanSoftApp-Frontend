import { apiService, ApiResponse, getApiBaseUrl } from '@/lib/api-service';
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

async function fetchPageJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}/${path.replace(/^\//, '')}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
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
  const response = await apiService.get<TermsConditionsPage>('user/pages/terms-conditions', {
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

export function fetchPrivacyPolicyServer() {
  return fetchPageJson<PrivacyPolicyPage>('user/pages/privacy-policy');
}

export function fetchTermsConditionsServer() {
  return fetchPageJson<TermsConditionsPage>('user/pages/terms-conditions');
}

export function fetchAboutUsServer() {
  return fetchPageJson<AboutUsPage>('user/pages/about-us');
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
  const response = await apiService.get<AdminPageResponse>(`admin/pages/${slug}`, {
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
    title: readLocalizedValue(page.title) || 'Terms and Conditions',
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
