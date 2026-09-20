'use client';

import { useCallback, useEffect, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchAdminEmployee } from '../services/admin-employees-api';
import { AdminEmployee } from '../types/admin-employee.types';

export function useAdminEmployee(id: number | null, enabled = true) {
  const [employee, setEmployee] = useState<AdminEmployee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id || !enabled) {
      setEmployee(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminEmployee(id);
      setEmployee(data);
    } catch (err: any) {
      setError(err.message || translateMessage('Failed to load employee.'));
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, id]);

  useEffect(() => {
    // Genuine external synchronization: fetches the record from the API on
    // mount/id change; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload();
  }, [reload]);

  return {
    employee,
    loading,
    error,
    reload,
  };
}
