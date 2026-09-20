'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAboutUs, fetchAdminAboutUs } from '../services/pages-api';
import { AboutUsForm, AboutUsPage } from '../types/page.types';

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
    // Genuine external synchronization: fetches the page from the API on
    // mount; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload().catch(() => undefined);
  }, [enabled, reload]);

  return { data, loading, error, reload };
}

export function useAdminAboutUs(enabled = true) {
  const [data, setData] = useState<AboutUsForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const page = await fetchAdminAboutUs();
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
    // Genuine external synchronization: fetches the page from the API on
    // mount; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload().catch(() => undefined);
  }, [enabled, reload]);

  return { data, loading, error, reload };
}
