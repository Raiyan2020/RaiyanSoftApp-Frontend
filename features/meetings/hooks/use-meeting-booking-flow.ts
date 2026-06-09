'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { authService } from '@/lib/auth-service';
import { globalToast } from '@/lib/toast-context';
import { useMeetingAvailability } from './use-meeting-availability';
import { useBookMeeting } from './use-book-meeting';
import {
  buildDateTimeValue,
  formatDateKey,
  meetingTypeFromUi,
} from '../utils/meeting-helpers';

export function useMeetingBookingFlow(options?: { onBooked?: () => void | Promise<void>; onClose?: () => void }) {
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

  const detailsStep = 2;
  const authStep = isAuthenticated ? null : 3;
  const successStep = isAuthenticated ? 3 : 4;

  const availabilityDate = useMemo(() => viewDate, [viewDate]);
  const currentMonth = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, []);
  const viewMonth = useMemo(
    () => new Date(viewDate.getFullYear(), viewDate.getMonth(), 1),
    [viewDate]
  );
  const canGoToPrevMonth = viewMonth > currentMonth;

  const {
    availableDays,
    availableSlots,
    loading: loadingSlots,
    error: availabilityError,
    reloadForDate,
  } = useMeetingAvailability(availabilityDate, true);

  const { submitBooking, loading: isSubmitting, error: bookingError } = useBookMeeting();

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
  }, [selectedDate]);

  useEffect(() => {
    setErrorMsg(availabilityError || bookingError);
  }, [availabilityError, bookingError]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return false;

    setErrorMsg(null);

    try {
      const response = await submitBooking({
        date_time: buildDateTimeValue(selectedDate, selectedTime),
        subject: formData.topic.trim(),
        notes: formData.notes.trim() || undefined,
        type: meetingTypeFromUi(formData.meetingType),
      });
      globalToast.success(response.message || (dir === 'rtl' ? 'تم إنشاء الحجز بنجاح.' : 'Booking created successfully.'));
      await options?.onBooked?.();
      options?.onClose?.();
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking failed. Please try again.');
      return false;
    }
  };

  const handlePrimaryAction = async () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime) return;
      setStep(detailsStep);
      return;
    }

    if (step === detailsStep) {
      if (!formData.topic.trim()) return;

      if (!isAuthenticated && authStep) {
        setStep(authStep);
        return;
      }

      await handleBook();
    }
  };

  const selectDate = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    await reloadForDate(date);
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
    if (!canGoToPrevMonth) return;

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

      if (week[0].getMonth() !== month && week[0] > firstDayOfMonth) break;
      rows.push(week);
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
    resetFlow,
  };
}
