'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAdminMeetings } from '../services/admin-meetings-api';
import { AdminMeeting, AdminMeetingsFilters, MeetingsPagination } from '@/features/meetings';
import { translateMessage } from '@/lib/i18n-utils';

export function useAdminMeetingsList(filters: AdminMeetingsFilters) {
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [pagination, setPagination] = useState<MeetingsPagination | null>(null);
  // true on mount so the empty state never shows before the first fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequestRef = useRef(0);

  const reload = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminMeetings(filters);
      // Ignore responses superseded by a newer filter/search request.
      if (requestId !== latestRequestRef.current) return;
      setMeetings(result.meetings);
      setPagination(result.pagination);
    } catch (err: any) {
      if (requestId !== latestRequestRef.current) return;
      setError(translateMessage(err.message || 'Failed to load meetings.'));
      setMeetings([]);
      setPagination(null);
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Genuine external synchronization: fetches the list from the API on
    // mount/filter change; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
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
