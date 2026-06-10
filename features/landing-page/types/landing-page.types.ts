// ---------------------------------------------------------------------------
// Public API response types (strings already translated by backend)
// ---------------------------------------------------------------------------

export interface LandingTag {
  id: number;
  name: string;
  url: string | null;
}

/** Returned by hero section (`user/landing-page/heroes`) */
export interface LandingHero {
  id: number;
  title: string;
  caption: string;
  description: string;
  vedio_url: string | null;
  f_button_text: string | null;
  f_button_url: string | null;
  l_button_text: string | null;
  l_button_url: string | null;
  tags: LandingTag[];
}

/** Section header returned inside services / capabilities / offers / testimonials */
export interface LandingSectionHeader {
  id: number;
  title: string;
  caption: string;
  description: string;
}

export interface LandingService {
  id: number;
  title: string;
  caption: string;
  description: string;
  overview: string | null;
  image: string | null;
  tags: LandingTag[];
}

export interface LandingCapability {
  id: number;
  title: string;
  caption: string;
  description: string;
  image: string | null;
  tags: LandingTag[];
}

export interface LandingOffer {
  id: number;
  title: string;
  caption: string;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  most_requested: boolean;
}

export interface LandingTestimonial {
  id: number;
  /** Client name */
  title: string;
  /** Company / role */
  caption: string;
  /** Review text */
  description: string;
  /** Client avatar URL */
  image: string | null;
}

/** Composed public response shapes */
export interface LandingServicesData {
  header: LandingSectionHeader | null;
  services: LandingService[];
}

export interface LandingCapabilitiesData {
  header: LandingSectionHeader | null;
  capabilities: LandingCapability[];
}

export interface LandingOffersData {
  header: LandingSectionHeader | null;
  offers: LandingOffer[];
}

export interface LandingTestimonialsData {
  header: LandingSectionHeader | null;
  testimonials: LandingTestimonial[];
}

// ---------------------------------------------------------------------------
// Admin form payload types (bilingual: title[ar], title[en], …)
// ---------------------------------------------------------------------------

export interface BilingualField {
  ar: string;
  en: string;
}

export interface AdminTagPayload {
  name: BilingualField;
  url: string;
}

export interface AdminHeroPayload {
  title: BilingualField;
  caption: BilingualField;
  description: BilingualField;
  vedio_url: string;
  f_button_text: BilingualField;
  f_button_url: string;
  l_button_text: BilingualField;
  l_button_url: string;
  status: 1 | 0;
  tags: AdminTagPayload[];
}

export interface AdminSectionHeaderPayload {
  title: BilingualField;
  caption: BilingualField;
  description: BilingualField;
}

export interface AdminServicePayload {
  title: BilingualField;
  caption: BilingualField;
  description: BilingualField;
  overview: BilingualField;
  image?: File | null;
  tags: AdminTagPayload[];
}

export interface AdminCapabilityPayload {
  title: BilingualField;
  caption: BilingualField;
  description: BilingualField;
  image?: File | null;
  tags: AdminTagPayload[];
}

export interface AdminOfferPayload {
  title: BilingualField;
  caption: BilingualField;
  button_text: BilingualField;
  button_url: string;
  most_requested: 0 | 1;
}

export interface AdminTestimonialPayload {
  title: BilingualField;
  caption: BilingualField;
  description: BilingualField;
  image?: File | null;
}

// ---------------------------------------------------------------------------
// Admin list item types (returned by admin endpoints, strings still bilingual
// objects because Accept-Language is not necessarily set for admin calls)
// ---------------------------------------------------------------------------

export interface AdminLandingHero {
  id: number;
  title: string;
  caption: string;
  description: string;
  vedio_url: string | null;
  f_button_text: string | null;
  f_button_url: string | null;
  l_button_text: string | null;
  l_button_url: string | null;
  status: boolean;
  tags: LandingTag[];
}

export interface AdminService {
  id: number;
  title: string;
  caption: string;
  description: string;
  overview: string | null;
  image: string | null;
  tags: LandingTag[];
}

export interface AdminCapability {
  id: number;
  title: string;
  caption: string;
  description: string;
  image: string | null;
  tags: LandingTag[];
}

export interface AdminOffer {
  id: number;
  title: string;
  caption: string;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  most_requested: boolean;
}

export interface AdminTestimonial {
  id: number;
  title: string;
  caption: string;
  description: string;
  image: string | null;
}

export interface AdminSectionHeaderItem {
  id: number;
  title: string;
  caption: string;
  description: string;
}
