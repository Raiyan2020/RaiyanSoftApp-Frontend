'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminMeetings } from '../services/admin-meetings-api';
import { AdminMeeting, AdminMeetingsFilters, MeetingsPagination } from '@/features/meetings';

export function useAdminMeetingsList(filters: AdminMeetingsFilters) {
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [pagination, setPagination] = useState<MeetingsPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminMeetings(filters);
      setMeetings(result.meetings);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load meetings.');
      setMeetings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    meetings,
    pagination,
    loading,
    error,
    reload,
  };
}
