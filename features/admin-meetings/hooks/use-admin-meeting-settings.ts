'use client';

import { useCallback, useState } from 'react';
import { updateAdminMeetingSettings } from '../services/admin-meetings-api';
import { MeetingSettingsForm } from '@/features/meetings';
import { defaultMeetingSettingsForm } from '@/features/meetings';

export function useAdminMeetingSettings() {
  const [settings, setSettings] = useState<MeetingSettingsForm>(defaultMeetingSettingsForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const save = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await updateAdminMeetingSettings({
        duration_minutes: settings.durationMin,
        buffer_after_minutes: settings.bufferMin,
        min_notice_hours: settings.minNoticeHours,
        booking_window_days: settings.maxWindowDays,
        daily_meeting_limit: settings.dailyLimit,
      });
      setMessage('Settings saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  return {
    settings,
    setSettings,
    loading,
    error,
    message,
    save,
  };
}
