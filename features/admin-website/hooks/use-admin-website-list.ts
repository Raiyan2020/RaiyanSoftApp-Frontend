'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListApi } from '../services/website-lists-api';

export const adminWebsiteListKeys = {
  partners: ['admin-website', 'partners'] as const,
  teamMembers: ['admin-website', 'team-members'] as const,
  pricingPlans: ['admin-website', 'pricing-plans'] as const,
  jobOpenings: ['admin-website', 'job-openings'] as const,
};

/** Query + create/update/delete mutations for one admin website list, invalidating on success. */
export function useAdminWebsiteList<T, P>(queryKey: readonly string[], api: ListApi<T, P>) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey });

  const query = useQuery({ queryKey, queryFn: api.list });
  const create = useMutation({ mutationFn: api.create, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: P }) => api.update(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: api.remove, onSuccess: invalidate });

  return { query, create, update, remove, isSaving: create.isPending || update.isPending };
}
