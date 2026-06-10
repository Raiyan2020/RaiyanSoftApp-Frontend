'use client';

import { useCallback, useState } from 'react';
import { createAdminEmployee } from '../services/admin-employees-api';
import { CreateEmployeePayload } from '../types/admin-employee.types';

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = useCallback(async (payload: CreateEmployeePayload) => {
    setLoading(true);
    setError(null);

    try {
      return await createAdminEmployee(payload);
    } catch (err: any) {
      const message = err.message || 'Failed to create employee.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createEmployee, loading, error };
}
