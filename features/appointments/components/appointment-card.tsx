import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface AppointmentCardProps {
  id: string;
  topic: string;
  meetingType: string;
  startAt: any;
  endAt: any;
  notes?: string;
  status: string;
  t: (key: string) => string;
  formatDate: (val: any) => string;
  formatTime: (val: any) => string;
  onCancel: (id: string) => void;
}

export default function AppointmentCard({
  id,
  topic,
  meetingType,
  startAt,
  endAt,
  notes,
  status,
  t,
  formatDate,
  formatTime,
  onCancel,
}: AppointmentCardProps) {
  return (
    <div className="app-card rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                meetingType === 'online' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {t(`appt.type_${meetingType === 'online' ? 'online' : 'inperson'}`)}
            </span>
            <h3 className="text-2xl font-bold text-[var(--text)] leading-tight">{topic}</h3>
          </div>
          <div className="w-12 h-12 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-primary border border-[var(--border)]">
            <Calendar size={24} />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-[var(--text)]">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">{formatDate(startAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--text)]">
            <Clock size={18} className="text-primary" />
            <span className="font-medium">
              {formatTime(startAt)} - {formatTime(endAt)}
            </span>
          </div>
          {notes ? <div className="p-3 bg-[var(--surface-2)] rounded-xl text-sm text-[var(--text-muted)] italic">"{notes}"</div> : null}
        </div>

        {status !== 'cancelled' ? (
          <button
            type="button"
            onClick={() => onCancel(id)}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-colors border border-red-500/20"
          >
            {t('appt.cancel_btn')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
