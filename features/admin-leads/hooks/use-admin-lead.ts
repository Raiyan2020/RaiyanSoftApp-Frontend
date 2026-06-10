'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminLead } from '../services/admin-leads-api';
import { AdminLeadDetail } from '../types/admin-lead.types';

export function useAdminLead(id: number | null, language: string, enabled = true) {
  const [lead, setLead] = useState<AdminLeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id || !enabled) {
      setLead(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminLead(id, language);
      setLead(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lead details.');
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, id, language]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    lead,
    loading,
    error,
    reload,
  };
}
