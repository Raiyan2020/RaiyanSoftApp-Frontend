'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchUserMeetings } from '../services/user-meetings-api';
import { MeetingsPagination, UserMeeting, UserMeetingsFilters } from '../types/meeting.types';

export function useUserMeetings(filters: UserMeetingsFilters = {}, enabled = true) {
  const [meetings, setMeetings] = useState<UserMeeting[]>([]);
  const [pagination, setPagination] = useState<MeetingsPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedFilters = useMemo(
    () => ({
      page: filters.page,
    }),
    [filters.page]
  );

  const reload = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchUserMeetings(normalizedFilters);
      setMeetings(result.meetings);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || translateMessage('Failed to load meetings.'));
      setMeetings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, normalizedFilters]);

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
