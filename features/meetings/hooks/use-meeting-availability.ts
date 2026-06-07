'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchMeetingAvailability } from '../api/user-meetings-api';
import { formatDateKey } from '../utils/meeting-helpers';

export function useMeetingAvailability(referenceDate: Date | null, enabled = true) {
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMeetingAvailability(formatDateKey(date));
      setAvailableDays(data.available_days || []);
      setAvailableSlots(data.available_slots || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load availability.');
      setAvailableDays([]);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !referenceDate) {
      setAvailableDays([]);
      setAvailableSlots([]);
      return;
    }
    load(referenceDate);
  }, [enabled, load, referenceDate]);

  const reloadForDate = useCallback(
    async (date: Date) => {
      await load(date);
    },
    [load]
  );

  return {
    availableDays,
    availableSlots,
    loading,
    error,
    reloadForDate,
  };
}
