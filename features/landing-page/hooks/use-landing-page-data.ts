'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18nContext';
import {
  fetchLandingAboutUs,
  fetchLandingBanner,
  fetchLandingHome,
  fetchLandingHeroes,
  fetchLandingServices,
  fetchLandingCapabilities,
  fetchLandingOffers,
  fetchLandingTestimonials,
  fetchLandingFaqs,
  fetchLandingPageBySlug,
  submitLandingAboutUsForm,
} from '../services/public-landing-api';
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

type Lang = 'ar' | 'en';
type BannerSlug = 'idea' | 'project' | 'footer';

export const landingPageKeys = {
  home: (lang: Lang) => ['landing', 'home', lang] as const,
  heroes: (lang: Lang) => ['landing', 'heroes', lang] as const,
  services: (lang: Lang) => ['landing', 'services', lang] as const,
  capabilities: (lang: Lang) => ['landing', 'capabilities', lang] as const,
  offers: (lang: Lang) => ['landing', 'offers', lang] as const,
  testimonials: (lang: Lang) => ['landing', 'testimonials', lang] as const,
  faqs: (lang: Lang) => ['landing', 'faqs', lang] as const,
  aboutUs: (lang: Lang) => ['landing', 'about-us', lang] as const,
  banner: (lang: Lang, slug: BannerSlug) => ['landing', 'banner', lang, slug] as const,
  page: (lang: Lang, slug: string) => ['landing', 'page', lang, slug] as const,
};

export function useLandingHome() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingPageContent | null>({
    queryKey: landingPageKeys.home(lang),
    queryFn: () => fetchLandingHome(lang),
    staleTime: 60_000,
  });
}

export function useLandingHeroes() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingHero[]>({
    queryKey: landingPageKeys.heroes(lang),
    queryFn: () => fetchLandingHeroes(lang),
    staleTime: 60_000,
  });
}

export function useLandingServices() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingServicesData>({
    queryKey: landingPageKeys.services(lang),
    queryFn: () => fetchLandingServices(lang),
    staleTime: 60_000,
  });
}

export function useLandingCapabilities() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingCapabilitiesData>({
    queryKey: landingPageKeys.capabilities(lang),
    queryFn: () => fetchLandingCapabilities(lang),
    staleTime: 60_000,
  });
}

export function useLandingOffers() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingOffersData>({
    queryKey: landingPageKeys.offers(lang),
    queryFn: () => fetchLandingOffers(lang),
    staleTime: 60_000,
  });
}

export function useLandingTestimonials() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingTestimonialsData>({
    queryKey: landingPageKeys.testimonials(lang),
    queryFn: () => fetchLandingTestimonials(lang),
    staleTime: 60_000,
  });
}

export function useLandingFaqs() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingFaqsData>({
    queryKey: landingPageKeys.faqs(lang),
    queryFn: () => fetchLandingFaqs(lang),
    staleTime: 60_000,
  });
}

export function useLandingAboutUs() {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingAboutUsData>({
    queryKey: landingPageKeys.aboutUs(lang),
    queryFn: () => fetchLandingAboutUs(lang),
    staleTime: 60_000,
  });
}

export function useLandingBanner(slug: BannerSlug) {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery<LandingBanner | null>({
    queryKey: landingPageKeys.banner(lang, slug),
    queryFn: () => fetchLandingBanner(slug, lang),
    staleTime: 60_000,
  });
}

export function useLandingPage(slug: string, enabled = true) {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'ar';
  return useQuery({
    queryKey: landingPageKeys.page(lang, slug),
    queryFn: () => fetchLandingPageBySlug(slug, lang),
    enabled: enabled && Boolean(slug),
    staleTime: 60_000,
  });
}

export function useSubmitLandingAboutUsForm() {
  return useMutation({
    mutationFn: (payload: LandingAboutUsFormPayload) => submitLandingAboutUsForm(payload),
  });
}
