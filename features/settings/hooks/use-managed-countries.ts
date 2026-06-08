'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchManagedCountries } from '../api/countries-api';
import { countriesKeys } from '../query-keys';

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
