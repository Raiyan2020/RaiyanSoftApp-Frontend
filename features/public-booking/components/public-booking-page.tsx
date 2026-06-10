'use client';

import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePublicBooking } from '../hooks/use-public-booking';
import CalendarSlotPicker from './calendar-slot-picker';
import MeetingDetailsForm from './meeting-details-form';
import BookingSuccessStep from './booking-success-step';
import ErrorAlert from '@/components/ui/error-alert';

export default function PublicBookingPage() {
  const router = useRouter();
  const {
    t,
    dir,
    step,
    setStep,
    selectedDate,
    setSelectedDate,
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
    handlePrevMonth,
    handleNextMonth,
    canGoToPrevMonth,
    getCalendarRows,
    isDateAvailable,
    resetFlow,
  } = usePublicBooking();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] p-6 text-center text-[var(--text)]">
        <AlertTriangle className="mb-4 text-amber-400" size={36} />
        <h1 className="text-2xl font-bold">{t('auth.phone_dialog_title')}</h1>
        <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
          {dir === 'rtl' ? 'يجب تسجيل الدخول لحجز موعد.' : 'You need to sign in to book a meeting.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white"
        >
          {dir === 'rtl' ? 'تسجيل الدخول' : 'Sign in'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] relative overflow-y-auto no-scrollbar pb-28 text-[var(--text)]">
      <div className="sticky top-0 z-20 bg-[var(--surface)] backdrop-blur-md px-4 py-4 border-b border-[var(--border)] flex items-center shadow-lg">
        <h1 className="text-xl font-bold ms-2">{t('appt.book_btn')}</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto w-full">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-[var(--surface-3)]'}`} />
          ))}
        </div>

        {errorMsg ? <ErrorAlert message={errorMsg} /> : null}

        {step === 1 ? (
          <CalendarSlotPicker
            viewDate={viewDate}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableSlots={availableSlots}
            loadingSlots={loadingSlots}
            canGoToPrevMonth={canGoToPrevMonth}
            dir={dir}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            getCalendarRows={getCalendarRows}
            isDateAvailable={isDateAvailable}
          />
        ) : null}

        {step === 2 ? (
          <MeetingDetailsForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            topic={formData.topic}
            notes={formData.notes}
            meetingType={formData.meetingType}
            isSubmitting={isSubmitting}
            onTopicChange={(value) => setFormData({ ...formData, topic: value })}
            onNotesChange={(value) => setFormData({ ...formData, notes: value })}
            onMeetingTypeChange={(value) => setFormData({ ...formData, meetingType: value })}
            onBook={handleBook}
            onChangeStep={() => setStep(1)}
            topicLabel={t('appt.topic_label')}
            notesLabel={t('appt.notes_label')}
            onlineLabel={t('appt.type_online')}
            inPersonLabel={t('appt.type_inperson')}
            confirmLabel={t('appt.confirm_btn')}
          />
        ) : null}

        {step === 3 ? <BookingSuccessStep onBookAnother={resetFlow} /> : null}
      </div>

      {step === 1 ? (
        <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)] fixed bottom-0 left-0 right-0 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
