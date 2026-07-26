'use client';

import { useCallback, useState } from 'react';
import { approveAdminMeeting } from '../services/admin-meetings-api';
import { translateMessage } from '@/lib/i18n-utils';

export function useApproveMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveMeeting = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      return await approveAdminMeeting(id);
    } catch (err: any) {
      const message = err.message || 'Failed to approve meeting.';
      setError(translateMessage(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approveMeeting, loading, error };
}
