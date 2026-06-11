import { BASE_URL } from '@/lib/api-service';
import type {
  LandingHero,
  LandingServicesData,
  LandingCapabilitiesData,
  LandingOffersData,
  LandingTestimonialsData,
  LandingFaqsData,
} from '../types/landing-page.types';

type Language = 'ar' | 'en';

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

async function fetchLandingJson<T>(path: string, language: Language = 'ar'): Promise<T | null> {
  try {
    const url = `${BASE_URL}/user/landing-page/${path}`;
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
