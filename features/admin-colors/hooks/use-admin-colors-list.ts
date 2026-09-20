'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminColors } from '../services/admin-colors-api';
import { AdminColor } from '../types/admin-color.types';

export function useAdminColorsList() {
  const [colors, setColors] = useState<AdminColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminColors();
      setColors(data);
      return data;
    } catch (err: any) {
      const message = err.message || 'Failed to load colors.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Genuine external synchronization: fetches the list from the API on
    // mount; loading/data/error are set from the async lifecycle, not
    // derived from render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount; see comment above.
    reload().catch(() => undefined);
  }, [reload]);

  return { colors, loading, error, reload };
}
