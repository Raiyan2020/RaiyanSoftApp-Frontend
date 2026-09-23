'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchAdminEmployees } from '../services/admin-employees-api';
import { AdminEmployee } from '../types/admin-employee.types';
import type { PaginationMeta } from '@/lib/api-service';

export function useAdminEmployeesList(page: number = 1, search: string = '') {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestRef = useRef(0);

  const reload = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    setError(null);

    try {
      const { items, pagination: meta } = await fetchAdminEmployees({ page, search });
      // A newer page/reload superseded this one; drop the stale response.
      if (requestId !== latestRequestRef.current) return;
      setEmployees(items);
      setPagination(meta);
    } catch (err: any) {
      if (requestId !== latestRequestRef.current) return;
      setError(err.message || translateMessage('Failed to load employees.'));
      setEmployees([]);
      setPagination(null);
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // Genuine external synchronization: fetches the list from the API on
    // mount/page change; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload();
  }, [reload]);

  return {
    employees,
    pagination,
    loading,
    error,
    reload,
  };
}
