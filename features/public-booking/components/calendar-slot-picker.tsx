import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface CalendarSlotPickerProps {
  viewDate: Date;
  selectedDate: Date | null;
  selectedTime: string | null;
  availableSlots: string[];
  loadingSlots: boolean;
  canGoToPrevMonth: boolean;
  dir: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  getCalendarRows: () => Date[][];
  isDateAvailable: (date: Date) => boolean;
}

export default function CalendarSlotPicker({
  viewDate,
  selectedDate,
  selectedTime,
  availableSlots,
  loadingSlots,
  canGoToPrevMonth,
  dir,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onSelectTime,
  getCalendarRows,
  isDateAvailable,
}: CalendarSlotPickerProps) {
  const calendarRows = getCalendarRows();
  const weekDays = dir === 'rtl' ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const monthLabel = viewDate.toLocaleDateString(dir === 'rtl' ? 'ar-KW' : 'en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onPrevMonth}
            disabled={!canGoToPrevMonth}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-[var(--text-muted)]"
            aria-label={dir === 'rtl' ? 'الشهر السابق' : 'Previous month'}
          >
            <ChevronLeft size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
          <h3 className="text-lg font-bold uppercase tracking-wide">{monthLabel}</h3>
          <button type="button" onClick={onNextMonth} className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]">
            <ChevronRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-2 text-center text-xs font-bold text-[var(--text-muted)] uppercase">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="space-y-2">
          {calendarRows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-5 gap-2">
              {row.map((date, cIdx) => {
                const isCurrent = date.getMonth() === viewDate.getMonth();
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isPast = date < today;
                const isClickable = isCurrent && !isPast && isDateAvailable(date);

                return (
                  <button
                    type="button"
                    key={cIdx}
                    onClick={() => isClickable && onSelectDate(date)}
                    disabled={!isClickable}
                    className={`h-10 rounded-xl flex flex-col items-center justify-center border transition-all ${
                      !isCurrent
                        ? 'opacity-0 pointer-events-none'
                        : isSelected
                        ? 'bg-primary border-primary text-white shadow-lg'
                        : isClickable
                        ? 'bg-[var(--surface-3)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-3)]'
                        : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-transparent cursor-not-allowed'
                    }`}
                  >
                    <span className="text-sm font-bold">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDate ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-[var(--border)]">
          <h3 className="text-[var(--text)] font-bold">{translateMessage('Select Time')}</h3>
          {loadingSlots ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-4 text-[var(--text-muted)] bg-[var(--surface-3)] rounded-xl">{translateMessage('No slots available')}</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableSlots.map((time) => (
                <button
                  type="button"
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'bg-[var(--surface-3)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-3)]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
