'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, ChevronLeft, Loader2, CheckCircle, X, Video, MapPin } from 'lucide-react';
import ErrorAlert from '@/components/ui/error-alert';
import { useBookingWizard } from '../hooks/use-booking-wizard';
import BookingAuthGate from './booking-auth-gate';
import { translateMessage } from '@/lib/i18n-utils';

interface BookingWizardProps {
  onClose: () => void;
  onBooked?: () => void;
}

export default function BookingWizard({ onClose, onBooked }: BookingWizardProps) {
  const {
    t,
    dir,
    step,
    setStep,
    detailsStep,
    authStep,
    successStep,
    selectedDate,
    setSelectedDate,
    selectDate,
    availableSlots,
    selectedTime,
    setSelectedTime,
    loadingSlots,
    isSubmitting,
    errorMsg,
    viewDate,
    formData,
    setFormData,
    isAuthenticated,
    handleBook,
    handlePrimaryAction,
    handlePrevMonth,
    handleNextMonth,
    canGoToPrevMonth,
    getCalendarRows,
    isDateAvailable,
  } = useBookingWizard(onClose, onBooked);

  const calendarRows = getCalendarRows();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabel = viewDate.toLocaleDateString(dir === 'rtl' ? 'ar-KW' : 'en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:h-[min(84dvh,44rem)] sm:max-w-4xl bg-[var(--surface)] text-[var(--text)] flex flex-col sm:rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-md shrink-0">
          <button type="button" onClick={onClose} className="p-2 -ms-2 text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={24} />
          </button>
          <h2 className="text-[var(--text)] font-bold text-lg">{t('appt.book_btn')}</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex justify-center gap-2 mb-6 shrink-0">
            {Array.from({ length: isAuthenticated ? 3 : 4 }, (_, index) => index + 1).map((i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-[var(--surface-2)]'}`}
              />
            ))}
          </div>

          {errorMsg ? <ErrorAlert message={errorMsg} /> : null}

          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={!canGoToPrevMonth}
                    className="p-2 bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border border-[var(--border)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-[var(--text-muted)]"
                    aria-label={dir === 'rtl' ? 'الشهر السابق' : 'Previous month'}
                  >
                    <ChevronLeft size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                  </button>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)] uppercase tracking-wide">{monthLabel}</h3>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border border-[var(--border)]"
                  >
                    <ChevronRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-1">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-[var(--text-muted)] uppercase py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {calendarRows.map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-7 gap-2">
                      {row.map((date, cIdx) => {
                        const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === today.toDateString();
                        const isPast = date < today;
                        const isClickable = isCurrentMonth && !isPast && isDateAvailable(date);

                        return (
                          <button
                            type="button"
                            key={cIdx}
                            onClick={() => isClickable && selectDate(date)}
                            disabled={!isClickable}
                            className={`h-9 rounded-xl flex flex-col items-center justify-center border transition-all relative overflow-hidden ${
                              !isCurrentMonth
                                ? 'border-transparent text-[var(--text-muted)] opacity-30 cursor-default'
                                : isSelected
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : isClickable
                                ? 'bg-[var(--surface-3)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-3)]'
                                : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-transparent cursor-not-allowed'
                            }`}
                          >
                            <span className={`text-sm font-bold ${isToday && !isSelected ? 'text-primary' : ''}`}>
                              {date.getDate()}
                            </span>
                            {isToday ? <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedDate ? (
                  <motion.div
                    key="time-selection"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="border-t border-[var(--border)] pt-6">
                      <h3 className="text-lg font-bold text-[var(--text)] mb-2">{t('appt.step_time')}</h3>
                      <p className="text-[var(--text-muted)] text-sm mb-3">
                        {selectedDate.toLocaleDateString(dir === 'rtl' ? 'ar-KW' : 'en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>

                      {loadingSlots ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-6 text-[var(--text-muted)] bg-[var(--surface-3)] rounded-xl border border-[var(--border)]">
                          <Clock size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">{translateMessage('No slots available on this date.')}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5">
                          {availableSlots.map((time) => (
                            <button
                              type="button"
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 rounded-xl border font-medium text-sm transition-all ${
                                selectedTime === time
                                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                  : 'bg-[var(--surface-3)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-3)]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--text)] mb-2">{t('appt.step_details')}</h3>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-primary font-bold text-sm">
                    {selectedDate?.toLocaleDateString(dir === 'rtl' ? 'ar-KW' : 'en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-[var(--text)] text-lg font-bold">{selectedTime}</p>
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-[var(--text-muted)] underline hover:text-[var(--text)]">
                  Change
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[var(--text-muted)]">{t('appt.topic_label')}</label>
                <input
                  type="text"
                  className="w-full bg-[var(--surface-3)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text)] focus:border-primary focus:outline-none"
                  placeholder={translateMessage('e.g. Project Consultation')}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[var(--text-muted)]">{translateMessage('Meeting Type')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all ${
                      formData.meetingType === 'online'
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Video size={20} />
                    <span className="text-xs font-bold">{t('appt.type_online')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'in_person' })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.meetingType === 'in_person'
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    <MapPin size={20} />
                    <span className="text-xs font-bold">{t('appt.type_inperson')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[var(--text-muted)]">{t('appt.notes_label')}</label>
                <textarea
                  className="w-full h-20 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text)] focus:border-primary focus:outline-none resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </motion.div>
          ) : null}

          {step === authStep && !isAuthenticated ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
              <BookingAuthGate onAuthenticated={async () => { await handleBook(); }} submitError={errorMsg} />
            </motion.div>
          ) : null}

          {step === successStep ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/30">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text)]">{t('appt.booking_success')}</h2>
              <button type="button" onClick={onClose} className="bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] px-8 py-3 rounded-xl font-bold transition-colors">
                Done
              </button>
            </motion.div>
          ) : null}
        </div>

        {step < successStep && !(step === authStep && !isAuthenticated) ? (
            <div className="p-3.5 sm:p-4 border-t border-[var(--border)] bg-[var(--surface)] flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-6 py-3 rounded-xl font-bold text-[var(--text-muted)] transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'hover:text-[var(--text)]'
              }`}
            >
              {t('auth.back')}
            </button>
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                (step === 1 && (!selectedDate || !selectedTime)) ||
                (step === 2 && !formData.topic.trim()) ||
                isSubmitting
              }
              className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(29,183,240,0.3)] hover:shadow-[0_0_25px_rgba(29,183,240,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? <Loader2 className="animate-spin" />
                : step === 2 && !isAuthenticated
                  ? (dir === 'rtl' ? 'متابعة' : 'Continue')
                  : step === 2
                    ? t('appt.confirm_btn')
                    : t('wizard.next')}
              {step === 1 && !isSubmitting ? dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} /> : null}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
