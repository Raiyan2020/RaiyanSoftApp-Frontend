import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { AppointmentSettings } from '@/lib/appointmentStore';

interface AdminScheduleTabProps {
  settings: AppointmentSettings;
  savingId: number | null;
  onSaveSettings: () => void;
  onUpdateAvailability: (dayIndex: number, enabled: boolean) => void;
  onAddRange: (dayIndex: number) => void;
  onRemoveRange: (dayIndex: number, rangeIndex: number) => void;
  onChangeRange: (dayIndex: number, rangeIndex: number, field: 'start' | 'end', value: string) => void;
  days: string[];
}

export default function AdminScheduleTab({
  settings,
  savingId,
  onSaveSettings,
  onUpdateAvailability,
  onAddRange,
  onRemoveRange,
  onChangeRange,
  days,
}: AdminScheduleTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[var(--text)]">Weekly Availability</h3>
        <button
          type="button"
          onClick={onSaveSettings}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-sky-400 transition-colors"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="space-y-4">
        {days.map((dayName, idx) => {
          const dayConfig = settings.weeklyAvailability[idx] ||
            settings.weeklyAvailability[String(idx)] || { enabled: false, ranges: [] };
          const isEnabled = dayConfig.enabled;

          return (
            <div
              key={dayName}
              className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border transition-all ${
                isEnabled ? 'bg-[var(--surface-2)] border-[var(--border)]' : 'bg-[var(--surface-2)] border-[var(--border)] opacity-70'
              }`}
            >
              <div className="w-32 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onUpdateAvailability(idx, !isEnabled);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    isEnabled ? 'bg-primary' : 'bg-[var(--surface-3)]'
                  }`}
                  aria-pressed={isEnabled}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>

                <div className="flex flex-col">
                  <span className={`font-bold ${isEnabled ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{dayName}</span>
                  {savingId === idx ? <span className="text-[10px] text-primary animate-pulse">Saving...</span> : null}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {isEnabled ? (
                  <>
                    {dayConfig.ranges &&
                      dayConfig.ranges.map((range, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2 flex-wrap">
                          <input
                            type="time"
                            value={(range as any).start}
                            onChange={(e) => onChangeRange(idx, rIdx, 'start', e.target.value)}
                            className="bg-[var(--surface-3)] text-[var(--text)] px-3 py-2 rounded-lg border border-[var(--border)] focus:border-primary outline-none text-sm"
                          />
                          <span className="text-[var(--text-muted)]">-</span>
                          <input
                            type="time"
                            value={(range as any).end}
                            onChange={(e) => onChangeRange(idx, rIdx, 'end', e.target.value)}
                            className="bg-[var(--surface-3)] text-[var(--text)] px-3 py-2 rounded-lg border border-[var(--border)] focus:border-primary outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveRange(idx, rIdx)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => onAddRange(idx)}
                      className="text-xs text-primary font-bold flex items-center gap-1 mt-2 hover:underline"
                    >
                      <Plus size={14} /> Add Range
                    </button>
                  </>
                ) : (
                  <span className="text-[var(--text-muted)] text-sm italic flex items-center h-full">Unavailable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
