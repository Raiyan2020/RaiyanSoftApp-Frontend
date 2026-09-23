'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import {
  fetchMyProject,
  getApiErrorMessage,
} from '../services/lead-project-api';
import { leadProjectKeys } from '../query-keys';
import { mapStoredProject } from '../utils/map-stored-project';

function hasUserToken() {
  return Boolean(authService.getUserToken());
}

export function useUserStoredProject(id?: string, enabled = true) {
  const { language } = useTranslation();

  const query = useQuery({
    queryKey: leadProjectKeys.myProject(id, language),
    queryFn: async () => {
      if (!id) return null;
      const response = await fetchMyProject(id, language);
      if (!response.status || !response.data) {
        throw new Error(getApiErrorMessage(response));
      }
      return response.data;
    },
    enabled: enabled && Boolean(id) && typeof window !== 'undefined' && hasUserToken(),
    meta: { skipGlobalErrorToast: true },
  });

  return {
    project: query.data ? mapStoredProject(query.data) : null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  };
}
