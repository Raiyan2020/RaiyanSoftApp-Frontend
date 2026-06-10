'use client';

import { useCallback, useState } from 'react';
import { deleteAdminEmployee } from '../services/admin-employees-api';

export function useDeleteEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEmployee = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteAdminEmployee(id);
    } catch (err: any) {
      const message = err.message || 'Failed to delete employee.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteEmployee, loading, error };
}
