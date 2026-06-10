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
} from '@/features/landing-page';
import type {
  AdminHeroPayload,
  AdminSectionHeaderPayload,
  AdminServicePayload,
  AdminCapabilityPayload,
  AdminOfferPayload,
  AdminTestimonialPayload,
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
