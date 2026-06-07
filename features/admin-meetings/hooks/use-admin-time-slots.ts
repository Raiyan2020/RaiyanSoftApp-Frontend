'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminTimeSlots, saveAdminTimeSlots } from '../api/admin-meetings-api';
import { WeeklyAvailability } from '@/features/meetings/types/meeting.types';
import {
  defaultWeeklyAvailability,
  timeSlotsToWeeklyAvailability,
  weeklyAvailabilityToTimeSlots,
} from '@/features/meetings/utils/meeting-helpers';

export function useAdminTimeSlots() {
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability>(
    defaultWeeklyAvailability()
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminTimeSlots();
      if (data?.days) {
        setWeeklyAvailability(timeSlotsToWeeklyAvailability(data.days));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load time slots.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = weeklyAvailabilityToTimeSlots(weeklyAvailability);
      await saveAdminTimeSlots(payload);
    } catch (err: any) {
      setError(err.message || 'Failed to save time slots.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [weeklyAvailability]);

  const updateDayEnabled = (dayIndex: number, enabled: boolean) => {
    setWeeklyAvailability((current) => {
      const next = { ...current };
      const day = next[dayIndex] || { enabled: false, ranges: [] };
      next[dayIndex] = {
        enabled,
        ranges: enabled && day.ranges.length === 0 ? [{ start_time: '09:00', end_time: '17:00' }] : day.ranges,
      };
      return next;
    });
  };

  const addRange = (dayIndex: number) => {
    setWeeklyAvailability((current) => {
      const next = { ...current };
      const day = next[dayIndex] || { enabled: true, ranges: [] };
      next[dayIndex] = {
        ...day,
        ranges: [...day.ranges, { start_time: '09:00', end_time: '17:00' }],
      };
      return next;
    });
  };

  const removeRange = (dayIndex: number, rangeIndex: number) => {
    setWeeklyAvailability((current) => {
      const next = { ...current };
      const day = next[dayIndex];
      if (!day) return current;
      next[dayIndex] = {
        ...day,
        ranges: day.ranges.filter((_, index) => index !== rangeIndex),
      };
      return next;
    });
  };

  const changeRange = (dayIndex: number, rangeIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setWeeklyAvailability((current) => {
      const next = { ...current };
      const day = next[dayIndex];
      if (!day) return current;
      const ranges = [...day.ranges];
      ranges[rangeIndex] = { ...ranges[rangeIndex], [field]: value };
      next[dayIndex] = { ...day, ranges };
      return next;
    });
  };

  return {
    weeklyAvailability,
    setWeeklyAvailability,
    loading,
    saving,
    error,
    reload,
    save,
    updateDayEnabled,
    addRange,
    removeRange,
    changeRange,
  };
}
