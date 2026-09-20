'use client';

import { useCallback, useEffect, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchAdminEmployees } from '../services/admin-employees-api';
import { AdminEmployee } from '../types/admin-employee.types';

export function useAdminEmployeesList() {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminEmployees();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || translateMessage('Failed to load employees.'));
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Genuine external synchronization: fetches the list from the API on
    // mount; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload();
  }, [reload]);

  return {
    employees,
    loading,
    error,
    reload,
  };
}
