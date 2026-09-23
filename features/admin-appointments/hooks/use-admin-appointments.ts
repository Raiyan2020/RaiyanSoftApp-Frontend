'use client';

import { useEffect, useMemo, useState } from 'react';
import { MEETING_STATUS, MeetingStatusCode, MeetingTypeCode } from '@/features/meetings';
import { translateMessage } from '@/lib/i18n-utils';
import { useAdminMeetingsList } from '@/features/admin-meetings';
import { useApproveMeeting } from '@/features/admin-meetings';
import { useRejectMeeting } from '@/features/admin-meetings';
import { useAdminTimeSlots } from '@/features/admin-meetings';
import { useAdminMeetingSettings } from '@/features/admin-meetings';
import { AdminMeeting } from '@/features/meetings';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type AdminMeetingStatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'canceled';
export type AdminMeetingTypeFilter = '' | MeetingTypeCode;

const STATUS_FILTER_MAP: Record<Exclude<AdminMeetingStatusFilter, 'all'>, MeetingStatusCode> = {
  pending: MEETING_STATUS.PENDING,
  approved: MEETING_STATUS.APPROVED,
  rejected: MEETING_STATUS.REJECTED,
  canceled: MEETING_STATUS.CANCELED,
};

export function useAdminAppointments() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings' | 'bookings'>('bookings');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<AdminMeetingStatusFilter>('all');
  const [bookingTypeFilter, setBookingTypeFilter] = useState<AdminMeetingTypeFilter>('');
  const [bookingDateFrom, setBookingDateFrom] = useState('');
  const [bookingDateTo, setBookingDateTo] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminMeeting | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(bookingSearch.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [bookingSearch]);

  // Reset to page 1 whenever the effective filters change. Adjusted during
  // render (comparing against the previous filter values) instead of in an
  // effect, so the filter change and the page reset land in the same
  // render pass.
  const [prevFilterKey, setPrevFilterKey] = useState(
    `${debouncedSearch}|${bookingStatusFilter}|${bookingTypeFilter}|${bookingDateFrom}|${bookingDateTo}`
  );
  const filterKey = `${debouncedSearch}|${bookingStatusFilter}|${bookingTypeFilter}|${bookingDateFrom}|${bookingDateTo}`;
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const filters = useMemo(
    () => ({
      name: debouncedSearch || undefined,
      status: bookingStatusFilter === 'all' ? undefined : STATUS_FILTER_MAP[bookingStatusFilter],
      type: bookingTypeFilter || undefined,
      dateFrom: bookingDateFrom || undefined,
      dateTo: bookingDateTo || undefined,
      page,
    }),
    [bookingStatusFilter, bookingTypeFilter, bookingDateFrom, bookingDateTo, debouncedSearch, page]
  );

  const {
    meetings,
    pagination,
    loading: listLoading,
    error: listError,
    reload: reloadMeetings,
  } = useAdminMeetingsList(filters);

  // A status action can empty the last page (e.g. approving the only pending
  // row on it); step back to the new last page instead of showing nothing.
  if (pagination && page > Math.max(1, pagination.last_page)) {
    setPage(Math.max(1, pagination.last_page));
  }

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
      setActionMessage(translateMessage('Meeting approved successfully.'));
      await reloadMeetings();
      setSelectedBooking((current) => (current?.id === id ? { ...current, status: MEETING_STATUS.APPROVED } : current));
    } catch {
      // surfaced via approveError
    }
  };

  // Throws on failure (toasted via rejectError) so the reason dialog stays open.
  const handleRejectBooking = async (id: number, reason: string) => {
    await rejectMeeting(id, reason);
    setActionMessage(translateMessage('Meeting rejected successfully.'));
    await reloadMeetings();
    setSelectedBooking((current) => (current?.id === id ? { ...current, status: MEETING_STATUS.REJECTED } : current));
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
    // Typed-but-not-yet-debounced search counts as loading, so the previous
    // query's (possibly empty) results never read as "no bookings".
    listLoading: listLoading || bookingSearch.trim() !== debouncedSearch,
    listError,
    filteredBookings: meetings,
    bookingStatusFilter,
    setBookingStatusFilter,
    bookingTypeFilter,
    setBookingTypeFilter,
    bookingDateFrom,
    setBookingDateFrom,
    bookingDateTo,
    setBookingDateTo,
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
