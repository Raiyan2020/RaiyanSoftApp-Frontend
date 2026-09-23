import React from 'react';
import { MeetingSettingsForm } from '@/features/meetings';
import ErrorAlert from '@/components/ui/error-alert';
import Input from '@/components/ui/input';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';

interface AdminSettingsTabProps {
  settings: MeetingSettingsForm;
  setSettings: (val: MeetingSettingsForm) => void;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSaveSettings: () => void;
}

export default function AdminSettingsTab({
  settings,
  setSettings,
  loading,
  error,
  message,
  onSaveSettings,
}: AdminSettingsTabProps) {
  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        {error ? <ErrorAlert message={error} /> : null}
        <SuccessToast message={message} />

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Duration (Minutes)"
            type="number"
            min="5"
            value={settings.durationMin}
            onChange={(e) => setSettings({ ...settings, durationMin: parseInt(e.target.value) || 30 })}
          />
          <Input
            label="Buffer After Meeting (Minutes)"
            type="number"
            value={settings.bufferMin}
            onChange={(e) => setSettings({ ...settings, bufferMin: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Min Notice (Hours)"
            type="number"
            value={settings.minNoticeHours}
            onChange={(e) => setSettings({ ...settings, minNoticeHours: parseInt(e.target.value) || 2 })}
          />
          <Input
            label="Booking Window (Days)"
            type="number"
            value={settings.maxWindowDays}
            onChange={(e) => setSettings({ ...settings, maxWindowDays: parseInt(e.target.value) || 30 })}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Daily Meeting Limit"
            type="number"
            value={settings.dailyLimit}
            onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) || 10 })}
          />
          <p className="text-xs text-[var(--text-muted)]">{translateMessage('Max number of appointments allowed per day.')}</p>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={onSaveSettings}
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
          >
            {translateMessage(loading ? 'Saving...' : 'Save Settings')}
          </button>
        </div>
      </div>
    </div>
  );
}
