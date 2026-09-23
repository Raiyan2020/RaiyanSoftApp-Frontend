'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchAdminEmployee } from '../services/admin-employees-api';
import { AdminEmployee } from '../types/admin-employee.types';

export function useAdminEmployee(id: number | null, enabled = true) {
  const [employee, setEmployee] = useState<AdminEmployee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bumped on every reload so a slow response for a closed/previous id can't
  // write back and reopen the details modal.
  const requestRef = useRef(0);

  const reload = useCallback(async () => {
    const request = ++requestRef.current;
    if (!id || !enabled) {
      setEmployee(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminEmployee(id);
      if (request !== requestRef.current) return;
      setEmployee(data);
    } catch (err: any) {
      if (request !== requestRef.current) return;
      setError(err.message || translateMessage('Failed to load employee.'));
      setEmployee(null);
    } finally {
      if (request === requestRef.current) setLoading(false);
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
