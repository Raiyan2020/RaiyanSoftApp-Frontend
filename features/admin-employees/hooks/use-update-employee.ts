'use client';

import { useCallback, useState } from 'react';
import { updateAdminEmployee } from '../api/admin-employees-api';
import { UpdateEmployeePayload } from '../types/admin-employee.types';

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEmployee = useCallback(async (id: number, payload: UpdateEmployeePayload) => {
    setLoading(true);
    setError(null);

    try {
      return await updateAdminEmployee(id, payload);
    } catch (err: any) {
      const message = err.message || 'Failed to update employee.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateEmployee, loading, error };
}
