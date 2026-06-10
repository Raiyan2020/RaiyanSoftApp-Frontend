'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserColors } from '../services/user-colors-api';
import { userColorsKeys } from '../query-keys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useUserColorsQuery() {
  return useQuery({
    queryKey: userColorsKeys.all,
    queryFn: fetchUserColors,
    staleTime: STALE_TIME_MS,
    gcTime: 30 * 60 * 1000,
    meta: { skipGlobalErrorToast: true },
  });
}
