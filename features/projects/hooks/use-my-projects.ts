'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { mapStoredProject } from '@/features/lead-project/utils/map-stored-project';
import { fetchMyProjectsPaginated } from '../services/my-projects-api';

/**
 * Paginated `user/my-projects` list for the profile Projects tab and home grid.
 */
export function useMyProjects(enabled = true) {
  const { language } = useTranslation();
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['projects', 'my-projects', page, language],
    queryFn: () => fetchMyProjectsPaginated({ page, language }),
    enabled: enabled && typeof window !== 'undefined' && Boolean(authService.getUserToken()),
    meta: { skipGlobalErrorToast: true },
  });

  const projects = useMemo(() => (query.data?.data ?? []).map(mapStoredProject), [query.data?.data]);

  return {
    projects,
    pagination: query.data?.pagination ?? null,
    page,
    setPage,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  };
}
