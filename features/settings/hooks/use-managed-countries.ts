'use client';

import { useQuery } from '@tanstack/react-query';
import { countriesKeys, fetchManagedCountries } from '../api/countries-api';

const STALE_TIME_MS = 10 * 60 * 1000;

export function useManagedCountriesQuery() {
  return useQuery({
    queryKey: countriesKeys.all,
    queryFn: fetchManagedCountries,
    staleTime: STALE_TIME_MS,
    gcTime: 60 * 60 * 1000,
    meta: { skipGlobalErrorToast: true },
  });
}
