'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAboutUs } from '../services/pages-api';
import { AboutUsPage } from '../types/page.types';

export function useAboutUs(enabled = true) {
  const [data, setData] = useState<AboutUsPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const page = await fetchAboutUs();
      setData(page);
      return page;
    } catch (err: any) {
      const message = err.message || 'Failed to load about us page.';
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
