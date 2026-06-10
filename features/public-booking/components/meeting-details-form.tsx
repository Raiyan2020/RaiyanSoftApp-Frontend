'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Video } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface MeetingDetailsFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  topic: string;
  notes: string;
  meetingType: 'online' | 'in_person';
  isSubmitting: boolean;
  onTopicChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onMeetingTypeChange: (value: 'online' | 'in_person') => void;
  onBook: () => void;
  onChangeStep: () => void;
  topicLabel: string;
  notesLabel: string;
  onlineLabel: string;
  inPersonLabel: string;
  confirmLabel: string;
}

export default function MeetingDetailsForm({
  selectedDate,
  selectedTime,
  topic,
  notes,
  meetingType,
  isSubmitting,
  onTopicChange,
  onNotesChange,
  onMeetingTypeChange,
  onBook,
  onChangeStep,
  topicLabel,
  notesLabel,
  onlineLabel,
  inPersonLabel,
  confirmLabel,
}: MeetingDetailsFormProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-primary font-bold text-sm">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="text-[var(--text)] text-lg font-bold">{selectedTime}</p>
        </div>
        <button type="button" onClick={onChangeStep} className="text-xs text-[var(--text-muted)] underline hover:text-[var(--text)]">
          {translateMessage('Change')}
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-[var(--text-muted)]">{topicLabel}</label>
        <input
          type="text"
          className="w-full bg-[var(--surface-3)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none"
          placeholder={translateMessage('e.g. Project Consultation')}
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-[var(--text-muted)]">{translateMessage('Meeting Type')}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onMeetingTypeChange('online')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              meetingType === 'online'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            <Video size={20} />
            <span className="text-xs font-bold">{onlineLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => onMeetingTypeChange('in_person')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              meetingType === 'in_person'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            <MapPin size={20} />
            <span className="text-xs font-bold">{inPersonLabel}</span>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-[var(--text-muted)]">{notesLabel}</label>
        <textarea
          className="w-full h-24 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none resize-none"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={onBook}
        disabled={!topic.trim() || isSubmitting}
        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
        {confirmLabel}
      </button>
    </motion.div>
  );
}
