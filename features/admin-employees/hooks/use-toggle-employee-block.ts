'use client';

import { useCallback, useState } from 'react';
import { toggleAdminEmployeeBlock } from '../services/admin-employees-api';

export function useToggleEmployeeBlock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBlock = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      return await toggleAdminEmployeeBlock(id);
    } catch (err: any) {
      const message = err.message || 'Failed to update employee status.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggleBlock, loading, error };
}
