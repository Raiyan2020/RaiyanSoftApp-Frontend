'use client';

import { useCallback, useState } from 'react';
import { rejectAdminMeeting } from '../services/admin-meetings-api';
import { translateMessage } from '@/lib/i18n-utils';

export function useRejectMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectMeeting = useCallback(async (id: number | string, reason: string) => {
    setLoading(true);
    setError(null);

    try {
      return await rejectAdminMeeting(id, reason);
    } catch (err: any) {
      const message = err.message || 'Failed to reject meeting.';
      setError(translateMessage(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rejectMeeting, loading, error };
}
