'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchMeetingAvailability } from '../services/user-meetings-api';
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
      const primaryKey = formatDateKey(date);
      const data = await fetchMeetingAvailability(primaryKey);
      const availableDays = data.available_days || [];
      const availableSlots = data.available_slots || [];

      if (availableDays.length > 0 && !availableDays.includes(primaryKey)) {
        const fallbackDate = new Date(availableDays[0]);
        const fallbackData = await fetchMeetingAvailability(formatDateKey(fallbackDate));
        setAvailableDays(fallbackData.available_days || []);
        setAvailableSlots(fallbackData.available_slots || []);
        return;
      }

      setAvailableDays(availableDays);
      setAvailableSlots(availableSlots);
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
