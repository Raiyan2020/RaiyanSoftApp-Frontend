'use client';

import { useCallback, useState } from 'react';
import { bookMeeting } from '../services/user-meetings-api';
import { BookMeetingPayload } from '../types/meeting.types';

export function useBookMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = useCallback(async (payload: BookMeetingPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await bookMeeting(payload);
      return response;
    } catch (err: any) {
      const message = err.message || 'Booking failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitBooking,
    loading,
    error,
  };
}
