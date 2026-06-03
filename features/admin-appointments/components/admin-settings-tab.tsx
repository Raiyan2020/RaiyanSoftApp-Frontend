import React from 'react';
import { AppointmentSettings } from '@/lib/appointmentStore';

interface AdminSettingsTabProps {
  settings: AppointmentSettings;
  setSettings: (val: AppointmentSettings) => void;
  loading: boolean;
  onSaveSettings: () => void;
}

export default function AdminSettingsTab({
  settings,
  setSettings,
  loading,
  onSaveSettings,
}: AdminSettingsTabProps) {
  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">Duration (Minutes)</label>
            <input
              type="number"
              min="5"
              value={settings.durationMin}
              onChange={(e) => setSettings({ ...settings, durationMin: parseInt(e.target.value) || 30 })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">Buffer After Meeting (Minutes)</label>
            <input
              type="number"
              value={settings.bufferMin}
              onChange={(e) => setSettings({ ...settings, bufferMin: parseInt(e.target.value) || 0 })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">Min Notice (Hours)</label>
            <input
              type="number"
              value={settings.minNoticeHours}
              onChange={(e) => setSettings({ ...settings, minNoticeHours: parseInt(e.target.value) || 2 })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">Booking Window (Days)</label>
            <input
              type="number"
              value={settings.maxWindowDays}
              onChange={(e) => setSettings({ ...settings, maxWindowDays: parseInt(e.target.value) || 30 })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text-muted)]">Daily Meeting Limit</label>
          <input
            type="number"
            value={settings.dailyLimit}
            onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) || 10 })}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary outline-none"
          />
          <p className="text-xs text-[var(--text-muted)]">Max number of appointments allowed per day.</p>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={onSaveSettings}
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
