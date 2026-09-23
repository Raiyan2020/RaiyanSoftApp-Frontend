'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  // true on mount so the empty state never shows before the first fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequestRef = useRef(0);

  const reload = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminLeads(filters, language);
      // Ignore responses superseded by a newer filter/search request.
      if (requestId !== latestRequestRef.current) return;
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (err: any) {
      if (requestId !== latestRequestRef.current) return;
      setError(err.message || translateMessage('Failed to load leads.'));
      setLeads([]);
      setPagination(null);
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
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
