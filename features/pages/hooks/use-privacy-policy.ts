'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchPrivacyPolicy } from '../services/pages-api';
import { PrivacyPolicyPage } from '../types/page.types';

export function usePrivacyPolicy(enabled = true) {
  const [data, setData] = useState<PrivacyPolicyPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const page = await fetchPrivacyPolicy();
      setData(page);
      return page;
    } catch (err: any) {
      const message = err.message || 'Failed to load privacy policy.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reload().catch(() => undefined);
  }, [enabled, reload]);

  return { data, loading, error, reload };
}
