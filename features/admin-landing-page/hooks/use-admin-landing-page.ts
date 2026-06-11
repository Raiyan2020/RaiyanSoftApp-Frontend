'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminHero,
  updateAdminHero,
  fetchAdminServices,
  fetchAdminServicesHeader,
  updateAdminServicesHeader,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  fetchAdminCapabilities,
  fetchAdminCapabilitiesHeader,
  updateAdminCapabilitiesHeader,
  createAdminCapability,
  updateAdminCapability,
  deleteAdminCapability,
  fetchAdminOffers,
  fetchAdminOffersHeader,
  updateAdminOffersHeader,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
  fetchAdminTestimonials,
  fetchAdminTestimonialsHeader,
  updateAdminTestimonialsHeader,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  fetchAdminFaqs,
  fetchAdminFaqsHeader,
  updateAdminFaqsHeader,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
  fetchAdminAboutUsHeader,
  updateAdminAboutUsHeader,
  fetchAdminAboutUsCards,
  createAdminAboutUsCard,
  updateAdminAboutUsCard,
  deleteAdminAboutUsCard,
  fetchAdminAboutUsSubmissions,
  fetchAdminAboutUsSubmission,
  deleteAdminAboutUsSubmission,
  fetchAdminIdeaBanner,
  fetchAdminProjectBanner,
  fetchAdminFooterBanner,
  updateAdminIdeaBanner,
  updateAdminProjectBanner,
  updateAdminFooterBanner,
  fetchAdminSiteSettings,
  updateAdminSiteSettings,
  fetchAdminSocialMedia,
  createAdminSocialMedia,
  updateAdminSocialMedia,
  deleteAdminSocialMedia,
} from '@/features/landing-page';
import type {
  AdminHeroPayload,
  AdminSectionHeaderPayload,
  AdminServicePayload,
  AdminCapabilityPayload,
  AdminOfferPayload,
  AdminTestimonialPayload,
  AdminFaqPayload,
  AdminAboutUsCardPayload,
  AdminAboutUsSubmission,
  AdminAboutUsSubmissionListResult,
  AdminBannerPayload,
  AdminSiteSettingsPayload,
  AdminSocialMediaPayload,
} from '@/features/landing-page';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const adminLandingKeys = {
  hero: ['admin-landing', 'hero'] as const,
  services: ['admin-landing', 'services'] as const,
  servicesHeader: ['admin-landing', 'services-header'] as const,
  capabilities: ['admin-landing', 'capabilities'] as const,
  capabilitiesHeader: ['admin-landing', 'capabilities-header'] as const,
  offers: ['admin-landing', 'offers'] as const,
  offersHeader: ['admin-landing', 'offers-header'] as const,
  testimonials: ['admin-landing', 'testimonials'] as const,
  testimonialsHeader: ['admin-landing', 'testimonials-header'] as const,
  faqs: ['admin-landing', 'faqs'] as const,
  faqsHeader: ['admin-landing', 'faqs-header'] as const,
  aboutUsHeader: ['admin-landing', 'about-us-header'] as const,
  aboutUsCards: ['admin-landing', 'about-us-cards'] as const,
  aboutUsSubmissions: ['admin-landing', 'about-us-submissions'] as const,
  ideaBanner: ['admin-landing', 'banner-idea'] as const,
  projectBanner: ['admin-landing', 'banner-project'] as const,
  footerBanner: ['admin-landing', 'banner-footer'] as const,
  siteSettings: ['admin-landing', 'site-settings'] as const,
  socialMedia: ['admin-landing', 'social-media'] as const,
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export function useAdminHero() {
  return useQuery({ queryKey: adminLandingKeys.hero, queryFn: fetchAdminHero });
}

export function useUpdateAdminHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminHeroPayload) => updateAdminHero(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.hero }),
  });
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export function useAdminServices() {
  return useQuery({ queryKey: adminLandingKeys.services, queryFn: fetchAdminServices });
}
export function useAdminServicesHeader() {
  return useQuery({ queryKey: adminLandingKeys.servicesHeader, queryFn: fetchAdminServicesHeader });
}
export function useUpdateAdminServicesHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminServicesHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.servicesHeader }),
  });
}
export function useCreateAdminService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminServicePayload) => createAdminService(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.services }),
  });
}
export function useUpdateAdminService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminServicePayload }) =>
      updateAdminService(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.services }),
  });
}
export function useDeleteAdminService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.services }),
  });
}

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------
export function useAdminCapabilities() {
  return useQuery({ queryKey: adminLandingKeys.capabilities, queryFn: fetchAdminCapabilities });
}
export function useAdminCapabilitiesHeader() {
  return useQuery({ queryKey: adminLandingKeys.capabilitiesHeader, queryFn: fetchAdminCapabilitiesHeader });
}
export function useUpdateAdminCapabilitiesHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminCapabilitiesHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.capabilitiesHeader }),
  });
}
export function useCreateAdminCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminCapabilityPayload) => createAdminCapability(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.capabilities }),
  });
}
export function useUpdateAdminCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminCapabilityPayload }) =>
      updateAdminCapability(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.capabilities }),
  });
}
export function useDeleteAdminCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminCapability(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.capabilities }),
  });
}

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------
export function useAdminOffers() {
  return useQuery({ queryKey: adminLandingKeys.offers, queryFn: fetchAdminOffers });
}
export function useAdminOffersHeader() {
  return useQuery({ queryKey: adminLandingKeys.offersHeader, queryFn: fetchAdminOffersHeader });
}
export function useUpdateAdminOffersHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminOffersHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.offersHeader }),
  });
}
export function useCreateAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminOfferPayload) => createAdminOffer(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.offers }),
  });
}
export function useUpdateAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminOfferPayload }) =>
      updateAdminOffer(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.offers }),
  });
}
export function useDeleteAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminOffer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.offers }),
  });
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export function useAdminTestimonials() {
  return useQuery({ queryKey: adminLandingKeys.testimonials, queryFn: fetchAdminTestimonials });
}
export function useAdminTestimonialsHeader() {
  return useQuery({ queryKey: adminLandingKeys.testimonialsHeader, queryFn: fetchAdminTestimonialsHeader });
}
export function useUpdateAdminTestimonialsHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminTestimonialsHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.testimonialsHeader }),
  });
}
export function useCreateAdminTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminTestimonialPayload) => createAdminTestimonial(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.testimonials }),
  });
}
export function useUpdateAdminTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminTestimonialPayload }) =>
      updateAdminTestimonial(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.testimonials }),
  });
}
export function useDeleteAdminTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.testimonials }),
  });
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export function useAdminFaqs() {
  return useQuery({ queryKey: adminLandingKeys.faqs, queryFn: fetchAdminFaqs });
}
export function useAdminFaqsHeader() {
  return useQuery({ queryKey: adminLandingKeys.faqsHeader, queryFn: fetchAdminFaqsHeader });
}
export function useUpdateAdminFaqsHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminFaqsHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.faqsHeader }),
  });
}
export function useCreateAdminFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminFaqPayload) => createAdminFaq(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.faqs }),
  });
}
export function useUpdateAdminFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminFaqPayload }) => updateAdminFaq(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.faqs }),
  });
}
export function useDeleteAdminFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminFaq(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.faqs }),
  });
}

// ---------------------------------------------------------------------------
// About Us
// ---------------------------------------------------------------------------
export function useAdminAboutUsHeader() {
  return useQuery({ queryKey: adminLandingKeys.aboutUsHeader, queryFn: fetchAdminAboutUsHeader });
}
export function useAdminAboutUsCards() {
  return useQuery({ queryKey: adminLandingKeys.aboutUsCards, queryFn: fetchAdminAboutUsCards });
}
export function useUpdateAdminAboutUsHeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSectionHeaderPayload) => updateAdminAboutUsHeader(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.aboutUsHeader }),
  });
}
export function useCreateAdminAboutUsCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminAboutUsCardPayload) => createAdminAboutUsCard(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.aboutUsCards }),
  });
}
export function useUpdateAdminAboutUsCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminAboutUsCardPayload }) =>
      updateAdminAboutUsCard(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.aboutUsCards }),
  });
}
export function useDeleteAdminAboutUsCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminAboutUsCard(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.aboutUsCards }),
  });
}

// ---------------------------------------------------------------------------
// About Us submissions
// ---------------------------------------------------------------------------
export function useAdminAboutUsSubmissions(page = 1, perPage = 15) {
  return useQuery<AdminAboutUsSubmissionListResult>({
    queryKey: [...adminLandingKeys.aboutUsSubmissions, page, perPage],
    queryFn: () => fetchAdminAboutUsSubmissions({ page, per_page: perPage }),
  });
}

export function useAdminAboutUsSubmission(id?: number | null) {
  return useQuery<AdminAboutUsSubmission | null>({
    queryKey: [...adminLandingKeys.aboutUsSubmissions, 'item', id ?? 'none'],
    queryFn: () => (id == null ? Promise.resolve(null) : fetchAdminAboutUsSubmission(id)),
    enabled: id != null,
  });
}

export function useDeleteAdminAboutUsSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminAboutUsSubmission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.aboutUsSubmissions }),
  });
}

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------
export function useAdminIdeaBanner() {
  return useQuery({ queryKey: adminLandingKeys.ideaBanner, queryFn: fetchAdminIdeaBanner });
}
export function useAdminProjectBanner() {
  return useQuery({ queryKey: adminLandingKeys.projectBanner, queryFn: fetchAdminProjectBanner });
}
export function useAdminFooterBanner() {
  return useQuery({ queryKey: adminLandingKeys.footerBanner, queryFn: fetchAdminFooterBanner });
}
export function useUpdateAdminIdeaBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminBannerPayload) => updateAdminIdeaBanner(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.ideaBanner }),
  });
}
export function useUpdateAdminProjectBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminBannerPayload) => updateAdminProjectBanner(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.projectBanner }),
  });
}
export function useUpdateAdminFooterBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminBannerPayload) => updateAdminFooterBanner(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.footerBanner }),
  });
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------
export function useAdminSiteSettings() {
  return useQuery({ queryKey: adminLandingKeys.siteSettings, queryFn: fetchAdminSiteSettings });
}
export function useUpdateAdminSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSiteSettingsPayload) => updateAdminSiteSettings(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.siteSettings }),
  });
}

// ---------------------------------------------------------------------------
// Social media
// ---------------------------------------------------------------------------
export function useAdminSocialMedia() {
  return useQuery({ queryKey: adminLandingKeys.socialMedia, queryFn: fetchAdminSocialMedia });
}
export function useCreateAdminSocialMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminSocialMediaPayload) => createAdminSocialMedia(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.socialMedia }),
  });
}
export function useUpdateAdminSocialMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminSocialMediaPayload }) =>
      updateAdminSocialMedia(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.socialMedia }),
  });
}
export function useDeleteAdminSocialMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminSocialMedia(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminLandingKeys.socialMedia }),
  });
}
