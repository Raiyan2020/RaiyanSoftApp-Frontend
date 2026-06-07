import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { WeeklyAvailability } from '@/features/meetings/types/meeting.types';

interface AdminScheduleTabProps {
  weeklyAvailability: WeeklyAvailability;
  saving: boolean;
  error: string | null;
  onSave: () => void;
  onUpdateAvailability: (dayIndex: number, enabled: boolean) => void;
  onAddRange: (dayIndex: number) => void;
  onRemoveRange: (dayIndex: number, rangeIndex: number) => void;
  onChangeRange: (dayIndex: number, rangeIndex: number, field: 'start_time' | 'end_time', value: string) => void;
  days: string[];
}

export default function AdminScheduleTab({
  weeklyAvailability,
  saving,
  error,
  onSave,
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
          onClick={onSave}
          disabled={saving}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-sky-400 transition-colors disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      ) : null}

      <div className="space-y-4">
        {days.map((dayName, idx) => {
          const dayConfig = weeklyAvailability[idx] || { enabled: false, ranges: [] };
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
                  onClick={() => onUpdateAvailability(idx, !isEnabled)}
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

                <span className={`font-bold ${isEnabled ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{dayName}</span>
              </div>

              <div className="flex-1 space-y-2">
                {isEnabled ? (
                  <>
                    {dayConfig.ranges?.map((range, rangeIdx) => (
                      <div key={rangeIdx} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={range.start_time}
                          onChange={(e) => onChangeRange(idx, rangeIdx, 'start_time', e.target.value)}
                          className="bg-[var(--surface-3)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] text-sm"
                        />
                        <span className="text-[var(--text-muted)]">to</span>
                        <input
                          type="time"
                          value={range.end_time}
                          onChange={(e) => onChangeRange(idx, rangeIdx, 'end_time', e.target.value)}
                          className="bg-[var(--surface-3)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveRange(idx, rangeIdx)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => onAddRange(idx)}
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Time Range
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">Unavailable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
