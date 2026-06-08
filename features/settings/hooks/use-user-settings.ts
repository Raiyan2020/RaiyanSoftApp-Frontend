'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserSettings, userSettingsKeys } from '../api/user-settings-api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useUserSettingsQuery() {
  return useQuery({
    queryKey: userSettingsKeys.all,
    queryFn: fetchUserSettings,
    staleTime: STALE_TIME_MS,
    gcTime: 30 * 60 * 1000,
    meta: { skipGlobalErrorToast: true },
  });
}
