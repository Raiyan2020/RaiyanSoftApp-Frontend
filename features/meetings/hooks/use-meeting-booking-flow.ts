'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { authService } from '@/lib/auth-service';
import { useMeetingAvailability } from './use-meeting-availability';
import { useBookMeeting } from './use-book-meeting';
import {
  buildDateTimeValue,
  formatDateKey,
  meetingTypeFromUi,
} from '../utils/meeting-helpers';

export function useMeetingBookingFlow() {
  const { t, dir } = useTranslation();
  const isAuthenticated = Boolean(authService.getUserToken());
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: '',
    meetingType: 'online' as 'online' | 'in_person',
    notes: '',
  });

  const availabilityDate = useMemo(() => selectedDate || viewDate, [selectedDate, viewDate]);

  const {
    availableDays,
    availableSlots,
    loading: loadingSlots,
    error: availabilityError,
    reloadForDate,
  } = useMeetingAvailability(availabilityDate, isAuthenticated);

  const { submitBooking, loading: isSubmitting, error: bookingError } = useBookMeeting();

  useEffect(() => {
    if (!selectedDate || !isAuthenticated) return;
    reloadForDate(selectedDate);
  }, [isAuthenticated, reloadForDate, selectedDate]);

  useEffect(() => {
    setErrorMsg(availabilityError || bookingError);
  }, [availabilityError, bookingError]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !isAuthenticated) return;

    setErrorMsg(null);

    try {
      await submitBooking({
        date_time: buildDateTimeValue(selectedDate, selectedTime),
        subject: formData.topic.trim(),
        notes: formData.notes.trim() || undefined,
        type: meetingTypeFromUi(formData.meetingType),
      });
      setStep(3);
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking failed. Please try again.');
      return false;
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setViewDate(new Date());
    setErrorMsg(null);
    setFormData({ topic: '', meetingType: 'online', notes: '' });
  };

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getCalendarRows = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startGridDate = new Date(firstDayOfMonth);
    startGridDate.setDate(1 - firstDayOfMonth.getDay());

    const rows: Date[][] = [];
    let current = new Date(startGridDate);

    for (let i = 0; i < 6; i++) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      const workDays = week.slice(0, 5);
      if (workDays[0].getMonth() !== month && workDays[0] > firstDayOfMonth) break;
      rows.push(workDays);
    }

    return rows;
  };

  const availableDaySet = useMemo(() => new Set(availableDays), [availableDays]);
  const isDateAvailable = (date: Date) => availableDaySet.has(formatDateKey(date));

  return {
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
    getCalendarRows,
    isDateAvailable,
    resetFlow,
  };
}
