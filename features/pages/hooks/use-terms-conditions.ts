'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminTermsConditions } from '../services/pages-api';
import { TermsConditionsPage } from '../types/page.types';

export function useTermsConditions(enabled = true) {
  const [data, setData] = useState<TermsConditionsPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const page = await fetchAdminTermsConditions();
      setData(page);
      return page;
    } catch (err: any) {
      const message = err.message || 'Failed to load terms and conditions.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Genuine external synchronization: fetches the page from the API on
    // mount; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload().catch(() => undefined);
  }, [enabled, reload]);

  return { data, loading, error, reload };
}
