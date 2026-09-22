import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { UserMeeting } from '@/features/meetings';
import { getMeetingStatusTone } from '@/features/meetings';

interface AppointmentCardProps {
  meeting: UserMeeting;
  t: (key: string) => string;
  formatDate: (meeting: UserMeeting) => string;
  formatTime: (meeting: UserMeeting) => string;
  onCancel: (id: number) => void;
  canCancel: boolean;
}

export default function AppointmentCard({
  meeting,
  t,
  formatDate,
  formatTime,
  onCancel,
  canCancel,
}: AppointmentCardProps) {
  const isOnline = meeting.type === 1;

  return (
    <div className="app-card rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  isOnline ? 'bg-[color-mix(in_srgb,var(--info)_20%,transparent)] text-info' : 'bg-[color-mix(in_srgb,var(--success)_20%,transparent)] text-success'
                }`}
              >
                {isOnline ? t('appt.type_online') : t('appt.type_inperson')}
              </span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border ${getMeetingStatusTone(meeting.status)}`}>
                {meeting.status_label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] leading-tight">
              {meeting.subject || t('appt.title')}
            </h2>
          </div>
          <div className="w-12 h-12 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-primary border border-[var(--border)]">
            <Calendar size={24} />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-[var(--text)]">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">{formatDate(meeting)}</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--text)]">
            <Clock size={18} className="text-primary" />
            <span className="font-medium">{formatTime(meeting)}</span>
          </div>
          {meeting.notes ? (
            <div className="p-3 bg-[var(--surface-2)] rounded-xl text-sm text-[var(--text-muted)] italic">
              &quot;{meeting.notes}&quot;
            </div>
          ) : null}
        </div>

        {canCancel ? (
          <button
            type="button"
            onClick={() => onCancel(meeting.id)}
            className="w-full py-3 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--danger)_20%,transparent)] text-danger rounded-xl text-sm font-bold transition-colors border border-[color-mix(in_srgb,var(--danger)_20%,transparent)]"
          >
            {t('appt.cancel_btn')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
