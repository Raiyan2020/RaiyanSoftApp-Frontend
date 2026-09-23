import { apiService } from '@/lib/api-service';
import { assertApiOk } from '@/lib/admin-api-error';
import type { BilingualField } from '@/features/landing-page';
import type {
  AdminJobOpening,
  AdminJobOpeningPayload,
  AdminPartner,
  AdminPartnerPayload,
  AdminPricingPlan,
  AdminPricingPlanPayload,
  AdminTeamMember,
  AdminTeamMemberPayload,
} from '../types/website-lists';

function appendBilingual(fd: FormData, key: string, value: BilingualField) {
  fd.append(`${key}[ar]`, value.ar);
  fd.append(`${key}[en]`, value.en);
}

function baseFormData(payload: { sort_order: number; is_active: boolean }): FormData {
  const fd = new FormData();
  fd.append('sort_order', String(payload.sort_order));
  fd.append('is_active', payload.is_active ? '1' : '0');
  return fd;
}

/**
 * List/create/update/delete for one `admin/landing-page/{resource}` collection.
 * Create/update skip the global error toast so the form can place field errors;
 * list and delete let the shared client toast failures (and delete success).
 */
function createListApi<T, P>(resource: string, toFormData: (payload: P) => FormData) {
  const base = `admin/landing-page/${resource}`;
  return {
    async list(): Promise<T[]> {
      const response = await apiService.get<T[]>(base);
      assertApiOk(response);
      return Array.isArray(response.data) ? response.data : [];
    },
    async create(payload: P): Promise<void> {
      assertApiOk(await apiService.post<unknown>(base, toFormData(payload), { skipGlobalToast: true }));
    },
    async update(id: number, payload: P): Promise<void> {
      assertApiOk(await apiService.post<unknown>(`${base}/${id}`, toFormData(payload), { skipGlobalToast: true }));
    },
    async remove(id: number): Promise<void> {
      assertApiOk(await apiService.delete<unknown>(`${base}/${id}`));
    },
  };
}

export type ListApi<T, P> = ReturnType<typeof createListApi<T, P>>;

export const partnersApi = createListApi<AdminPartner, AdminPartnerPayload>('partners', (p) => {
  const fd = baseFormData(p);
  appendBilingual(fd, 'name', p.name);
  appendBilingual(fd, 'description', p.description);
  fd.append('url', p.url.trim());
  if (p.logo) fd.append('logo', p.logo);
  return fd;
});

export const teamMembersApi = createListApi<AdminTeamMember, AdminTeamMemberPayload>('team-members', (p) => {
  const fd = baseFormData(p);
  appendBilingual(fd, 'name', p.name);
  appendBilingual(fd, 'role', p.role);
  appendBilingual(fd, 'bio', p.bio);
  if (p.image) fd.append('image', p.image);
  return fd;
});

export const pricingPlansApi = createListApi<AdminPricingPlan, AdminPricingPlanPayload>('pricing-plans', (p) => {
  const fd = baseFormData(p);
  appendBilingual(fd, 'name', p.name);
  appendBilingual(fd, 'description', p.description);
  appendBilingual(fd, 'price_label', p.price_label);
  p.features.forEach((row, index) => {
    fd.append(`features[ar][${index}]`, row.ar);
    fd.append(`features[en][${index}]`, row.en);
  });
  fd.append('is_featured', p.is_featured ? '1' : '0');
  return fd;
});

export const jobOpeningsApi = createListApi<AdminJobOpening, AdminJobOpeningPayload>('job-openings', (p) => {
  const fd = baseFormData(p);
  appendBilingual(fd, 'title', p.title);
  appendBilingual(fd, 'department', p.department);
  appendBilingual(fd, 'location', p.location);
  appendBilingual(fd, 'description', p.description);
  fd.append('employment_type', p.employment_type);
  fd.append('apply_url', p.apply_url.trim());
  return fd;
});
