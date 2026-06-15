import { apiService, BASE_URL, type ApiResponse } from '@/lib/api-service';
import type {
  LandingAboutUsData,
  LandingAboutUsFormPayload,
  LandingBanner,
  LandingHero,
  LandingServicesData,
  LandingCapabilitiesData,
  LandingOffersData,
  LandingTestimonialsData,
  LandingFaqsData,
  LandingPageContent,
} from '../types/landing-page.types';

type Language = 'ar' | 'en';
type BannerSlug = 'idea' | 'project' | 'footer';

function unwrapApiData<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== 'object') return null;
  if (Array.isArray(payload)) return payload as T;

  if ('data' in payload) {
    const nested = (payload as { data?: unknown }).data;
    if (nested && typeof nested === 'object' && 'data' in (nested as Record<string, unknown>)) {
      return ((nested as { data?: unknown }).data ?? null) as T | null;
    }
    return (nested ?? null) as T | null;
  }

  return payload as T;
}

function getApiErrorMessage(response: ApiResponse<unknown>): string {
  if (response.errors && typeof response.errors === 'object') {
    const messages = Object.values(response.errors).flat();
    if (messages.length > 0) return messages.join(' ');
  }
  return response.message || 'Request failed.';
}

async function fetchUserJson<T>(path: string, language: Language = 'ar'): Promise<T | null> {
  try {
    const url = `${BASE_URL}/user/${path.replace(/^\/+/, '')}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': language,
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (!json?.status) return null;
    return unwrapApiData<T>(json.data);
  } catch {
    return null;
  }
}

async function fetchLandingJson<T>(path: string, language: Language = 'ar'): Promise<T | null> {
  return fetchUserJson<T>(`landing-page/${path}`, language);
}

export async function fetchLandingHome(language: Language = 'ar'): Promise<LandingPageContent | null> {
  return fetchLandingJson<LandingPageContent>('home', language);
}

/** Returns the first active hero or null. */
export async function fetchLandingHeroes(language: Language = 'ar'): Promise<LandingHero[]> {
  const data = await fetchLandingJson<{ data: LandingHero[] } | LandingHero[]>('heroes', language);
  if (!data) return [];
  // Handle both paginated { data: [] } and plain array shapes
  if (Array.isArray(data)) return data;
  if ('data' in data && Array.isArray((data as { data: LandingHero[] }).data)) {
    return (data as { data: LandingHero[] }).data;
  }
  return [];
}

export async function fetchLandingServices(language: Language = 'ar'): Promise<LandingServicesData> {
  const data = await fetchLandingJson<LandingServicesData>('services', language);
  return data ?? { header: null, services: [] };
}

export async function fetchLandingCapabilities(language: Language = 'ar'): Promise<LandingCapabilitiesData> {
  const data = await fetchLandingJson<LandingCapabilitiesData>('capabilities', language);
  return data ?? { header: null, capabilities: [] };
}

export async function fetchLandingOffers(language: Language = 'ar'): Promise<LandingOffersData> {
  const data = await fetchLandingJson<LandingOffersData>('offers', language);
  return data ?? { header: null, offers: [] };
}

export async function fetchLandingTestimonials(language: Language = 'ar'): Promise<LandingTestimonialsData> {
  const data = await fetchLandingJson<LandingTestimonialsData>('testimonials', language);
  return data ?? { header: null, testimonials: [] };
}

export async function fetchLandingFaqs(language: Language = 'ar'): Promise<LandingFaqsData> {
  const data = await fetchLandingJson<LandingFaqsData>('faqs', language);
  return data ?? { header: null, faqs: [] };
}

export async function fetchLandingAboutUs(language: Language = 'ar'): Promise<LandingAboutUsData> {
  const data = await fetchLandingJson<LandingAboutUsData>('about-us', language);
  return data ?? { header: null, cards: [] };
}

export async function fetchLandingBanner(slug: BannerSlug, language: Language = 'ar'): Promise<LandingBanner | null> {
  return fetchLandingJson<LandingBanner>(`banners/${slug}`, language);
}

export async function submitLandingAboutUsForm(payload: LandingAboutUsFormPayload): Promise<void> {
  const response = await apiService.post<[] | Record<string, unknown>>('user/landing-page/about-us/form', payload);
  if (!response.status) throw new Error(getApiErrorMessage(response));
}

export async function fetchLandingPageBySlug<T = { id: number; slug: string; title: string; description: string; image: string | null }>(
  slug: string,
  language: Language = 'ar'
): Promise<T | null> {
  return fetchUserJson<T>(`pages/${encodeURIComponent(slug)}`, language);
}
