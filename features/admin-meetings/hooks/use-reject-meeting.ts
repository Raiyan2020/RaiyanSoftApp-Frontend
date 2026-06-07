'use client';

import { useCallback, useState } from 'react';
import { rejectAdminMeeting } from '../api/admin-meetings-api';

export function useRejectMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectMeeting = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      return await rejectAdminMeeting(id);
    } catch (err: any) {
      const message = err.message || 'Failed to reject meeting.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rejectMeeting, loading, error };
}
