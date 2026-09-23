import type { BilingualField } from '@/features/landing-page';

/** Admin endpoints return translatable fields as { ar, en } maps; empty locales may be missing. */
export type AdminBilingual = Partial<BilingualField>;

interface AdminListRow {
  id: number;
  sort_order: number;
  is_active: boolean;
}

interface ListPayloadBase {
  sort_order: number;
  is_active: boolean;
}

export interface AdminPartner extends AdminListRow {
  name: AdminBilingual;
  description: AdminBilingual;
  logo: string | null;
  url: string | null;
}

export interface AdminPartnerPayload extends ListPayloadBase {
  name: BilingualField;
  description: BilingualField;
  url: string;
  logo: File | null;
}

export interface AdminTeamMember extends AdminListRow {
  name: AdminBilingual;
  role: AdminBilingual;
  bio: AdminBilingual;
  image: string | null;
}

export interface AdminTeamMemberPayload extends ListPayloadBase {
  name: BilingualField;
  role: BilingualField;
  bio: BilingualField;
  image: File | null;
}

export interface AdminPricingPlan extends AdminListRow {
  name: AdminBilingual;
  description: AdminBilingual;
  price_label: AdminBilingual;
  features: { ar?: string[]; en?: string[] };
  is_featured: boolean;
}

export interface AdminPricingPlanPayload extends ListPayloadBase {
  name: BilingualField;
  description: BilingualField;
  price_label: BilingualField;
  /** One row per feature, both languages side by side; sent as features[ar][] / features[en][]. */
  features: BilingualField[];
  is_featured: boolean;
}

export const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract', 'remote'] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface AdminJobOpening extends AdminListRow {
  title: AdminBilingual;
  department: AdminBilingual;
  location: AdminBilingual;
  description: AdminBilingual;
  employment_type: EmploymentType;
  apply_url: string | null;
}

export interface AdminJobOpeningPayload extends ListPayloadBase {
  title: BilingualField;
  department: BilingualField;
  location: BilingualField;
  description: BilingualField;
  employment_type: EmploymentType;
  apply_url: string;
}
