'use client';

import { useCallback, useState } from 'react';
import { changeAdminLeadStatus } from '../services/admin-leads-api';
import { AdminLeadDetail, LeadStatusAction } from '../types/admin-lead.types';

export function useChangeLeadStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = useCallback(async (id: number, action: LeadStatusAction) => {
    setLoading(true);
    setError(null);

    try {
      const data = await changeAdminLeadStatus(id, action);
      return data as AdminLeadDetail;
    } catch (err: any) {
      const message = err.message || 'Failed to update lead status.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    changeStatus,
    loading,
    error,
  };
}
