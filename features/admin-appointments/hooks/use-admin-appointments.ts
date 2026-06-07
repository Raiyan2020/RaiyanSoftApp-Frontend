'use client';

import { useEffect, useMemo, useState } from 'react';
import { MEETING_STATUS, MeetingStatusCode } from '@/features/meetings/types/meeting.types';
import { useAdminMeetingsList } from '@/features/admin-meetings/hooks/use-admin-meetings-list';
import { useApproveMeeting } from '@/features/admin-meetings/hooks/use-approve-meeting';
import { useRejectMeeting } from '@/features/admin-meetings/hooks/use-reject-meeting';
import { useAdminTimeSlots } from '@/features/admin-meetings/hooks/use-admin-time-slots';
import { useAdminMeetingSettings } from '@/features/admin-meetings/hooks/use-admin-meeting-settings';
import { AdminMeeting } from '@/features/meetings/types/meeting.types';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type AdminMeetingStatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'canceled';

const STATUS_FILTER_MAP: Record<Exclude<AdminMeetingStatusFilter, 'all'>, MeetingStatusCode> = {
  pending: MEETING_STATUS.PENDING,
  approved: MEETING_STATUS.APPROVED,
  rejected: MEETING_STATUS.REJECTED,
  canceled: MEETING_STATUS.CANCELED,
};

export function useAdminAppointments() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings' | 'bookings'>('bookings');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<AdminMeetingStatusFilter>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminMeeting | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(bookingSearch.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [bookingSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, bookingStatusFilter]);

  const filters = useMemo(
    () => ({
      name: debouncedSearch || undefined,
      status: bookingStatusFilter === 'all' ? undefined : STATUS_FILTER_MAP[bookingStatusFilter],
      page,
    }),
    [bookingStatusFilter, debouncedSearch, page]
  );

  const {
    meetings,
    pagination,
    loading: listLoading,
    error: listError,
    reload: reloadMeetings,
  } = useAdminMeetingsList(filters);

  const { approveMeeting, loading: approveLoading, error: approveError } = useApproveMeeting();
  const { rejectMeeting, loading: rejectLoading, error: rejectError } = useRejectMeeting();

  const timeSlots = useAdminTimeSlots();
  const meetingSettings = useAdminMeetingSettings();

  const openBooking = (booking: AdminMeeting) => {
    setSelectedBooking(booking);
    setActionMessage(null);
  };

  const handleApproveBooking = async (id: number) => {
    try {
      await approveMeeting(id);
      setActionMessage('Meeting approved successfully.');
      await reloadMeetings();
      setSelectedBooking((current) => (current?.id === id ? { ...current, status: MEETING_STATUS.APPROVED } : current));
    } catch {
      // surfaced via approveError
    }
  };

  const handleRejectBooking = async (id: number) => {
    try {
      await rejectMeeting(id);
      setActionMessage('Meeting rejected successfully.');
      await reloadMeetings();
      setSelectedBooking((current) => (current?.id === id ? { ...current, status: MEETING_STATUS.REJECTED } : current));
    } catch {
      // surfaced via rejectError
    }
  };

  const goToPage = (nextPage: number) => {
    if (!pagination) return;
    setPage(Math.min(Math.max(1, nextPage), pagination.last_page));
  };

  const actionError = approveError || rejectError;
  const actionLoading = approveLoading || rejectLoading;

  return {
    activeTab,
    setActiveTab,
    meetings,
    pagination,
    listLoading,
    listError,
    filteredBookings: meetings,
    bookingStatusFilter,
    setBookingStatusFilter,
    bookingSearch,
    setBookingSearch,
    selectedBooking,
    setSelectedBooking,
    actionMessage,
    actionError,
    actionLoading,
    openBooking,
    handleApproveBooking,
    handleRejectBooking,
    goToPage,
    reloadMeetings,
    timeSlots,
    meetingSettings,
  };
}
