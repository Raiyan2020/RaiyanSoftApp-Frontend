'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { authService } from '@/lib/auth-service';
import { globalToast } from '@/lib/toast-context';
import { useUserMeetings } from '@/features/meetings';
import { useCancelMeeting } from '@/features/meetings';
import {
  canCancelMeeting,
  isActiveMeetingStatus,
  parseMeetingDateTime,
} from '@/features/meetings';
import { UserMeeting } from '@/features/meetings';

export function useAppointmentsList() {
  const { t, dir } = useTranslation();
  const isAuthenticated = Boolean(authService.getUserToken());
  const [showWizard, setShowWizard] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [meetingToCancel, setMeetingToCancel] = useState<number | null>(null);

  const meetingFilters = useMemo(() => ({}), []);
  const { meetings, loading, error, reload } = useUserMeetings(meetingFilters, isAuthenticated);
  const { cancelMeeting, loading: cancelLoading } = useCancelMeeting();

  const formatDate = (meeting: UserMeeting) => {
    const date = parseMeetingDateTime(meeting.date_time);
    return date.toLocaleDateString(dir === 'rtl' ? 'ar-KW' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (meeting: UserMeeting) => {
    const date = parseMeetingDateTime(meeting.date_time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const upcomingAppointments = useMemo(
    () =>
      meetings.filter((meeting) => {
        const date = parseMeetingDateTime(meeting.date_time);
        return date.getTime() >= Date.now() - 60 * 60 * 1000 && meeting.status !== 4;
      }),
    [meetings]
  );

  const hasActiveBooking = upcomingAppointments.some((meeting) => isActiveMeetingStatus(meeting.status));

  const initiateCancel = (id: number) => {
    setMeetingToCancel(id);
    setShowCancel(true);
  };

  const handleCancel = async () => {
    if (!meetingToCancel) return;

    try {
      await cancelMeeting(meetingToCancel);
      await reload();
      setShowCancel(false);
      setMeetingToCancel(null);
    } catch {
      // error handled in hook
    }
  };

  const handleOpenWizard = () => {
    if (!isAuthenticated) {
      globalToast.error(t('auth.phone_dialog_title'));
      return;
    }
    if (hasActiveBooking) {
      globalToast.error(t('appt.limit_error'));
      return;
    }
    setShowWizard(true);
  };

  return {
    t,
    dir,
    upcomingAppointments,
    loading,
    error,
    showWizard,
    setShowWizard,
    showCancel,
    setShowCancel,
    formatDate,
    formatTime,
    initiateCancel,
    handleCancel,
    cancelLoading,
    hasActiveBooking,
    handleOpenWizard,
    isAuthenticated,
    reload,
    canCancelMeeting,
  };
}
