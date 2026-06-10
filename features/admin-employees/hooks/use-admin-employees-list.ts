'use client';

import { useCallback, useEffect, useState } from 'react';
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
      setError(err.message || 'Failed to load employees.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    employees,
    loading,
    error,
    reload,
  };
}
