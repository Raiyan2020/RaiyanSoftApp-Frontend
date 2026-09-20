'use client';

import { useCallback, useEffect, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchAdminLeads } from '../services/admin-leads-api';
import {
  AdminLeadListItem,
  AdminLeadsFilters,
  AdminLeadsPagination,
} from '../types/admin-lead.types';

export function useAdminLeadsList(filters: AdminLeadsFilters, language: string) {
  const [leads, setLeads] = useState<AdminLeadListItem[]>([]);
  const [pagination, setPagination] = useState<AdminLeadsPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminLeads(filters, language);
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || translateMessage('Failed to load leads.'));
      setLeads([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters, language]);

  useEffect(() => {
    // Genuine external synchronization: fetches the list from the API on
    // mount/filter change; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    reload();
  }, [reload]);

  return {
    leads,
    pagination,
    loading,
    error,
    reload,
  };
}
