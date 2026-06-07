'use client';

import { useCallback, useState } from 'react';
import { cancelUserMeeting } from '../api/user-meetings-api';

export function useCancelMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelMeeting = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      await cancelUserMeeting(id);
    } catch (err: any) {
      const message = err.message || 'Failed to cancel meeting.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cancelMeeting,
    loading,
    error,
  };
}
