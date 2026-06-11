import React from 'react';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Loader2, Search, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';
import {
  AdminMeeting,
  MEETING_STATUS,
  MeetingsPagination,
} from '@/features/meetings';
import { getMeetingStatusTone, parseMeetingDateTime } from '@/features/meetings';
import { AdminMeetingStatusFilter } from '../hooks/use-admin-appointments';

interface AdminBookingsTabProps {
  bookings: AdminMeeting[];
  loading: boolean;
  error: string | null;
  pagination: MeetingsPagination | null;
  statusFilter: AdminMeetingStatusFilter;
  searchQuery: string;
  actionMessage: string | null;
  actionError: string | null;
  actionLoading: boolean;
  onStatusFilterChange: (value: AdminMeetingStatusFilter) => void;
  onSearchQueryChange: (value: string) => void;
  selectedBooking: AdminMeeting | null;
  onOpenBooking: (booking: AdminMeeting) => void;
  onCloseBooking: () => void;
  onApproveBooking: (id: number) => void;
  onRejectBooking: (id: number) => void;
  onPageChange: (page: number) => void;
}

const STATUS_OPTIONS: { value: AdminMeetingStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'canceled', label: 'Canceled' },
];

const inputClasses =
  'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

function StatusPill({ label, status }: { label: string; status: number }) {
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border ${getMeetingStatusTone(status)}`}>
      {label}
    </span>
  );
}

export default function AdminBookingsTab({
  bookings,
  loading,
  error,
  pagination,
  statusFilter,
  searchQuery,
  actionMessage,
  actionError,
  actionLoading,
  onStatusFilterChange,
  onSearchQueryChange,
  selectedBooking,
  onOpenBooking,
  onCloseBooking,
  onApproveBooking,
  onRejectBooking,
  onPageChange,
}: AdminBookingsTabProps) {
  const formatDateTime = (value: string) =>
    parseMeetingDateTime(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={translateMessage('Search by name...')}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => onStatusFilterChange(status.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize border ${
                statusFilter === status.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <ErrorAlert message={error} />
      ) : null}

      {loading && bookings.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <>
        <div className="md:hidden space-y-3 mb-4">
          {bookings.map((meeting) => (
            <div key={meeting.id} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-[var(--text)] break-words">{meeting.subject || '—'}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{formatDateTime(meeting.date_time)}</p>
                </div>
                <StatusPill label={meeting.status_label} status={meeting.status} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(meeting)}>
                  {translateMessage('Details')}
                </Button>
                {meeting.status === MEETING_STATUS.PENDING ? (
                  <>
                    <Button type="button" size="sm" onClick={() => onApproveBooking(meeting.id)} disabled={actionLoading}>
                      {translateMessage('Approve')}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => onRejectBooking(meeting.id)} disabled={actionLoading}>
                      {translateMessage('Reject')}
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-muted)]">{translateMessage('No bookings found.')}</div>
          ) : null}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border)]">
                <th className="pb-3 pl-2">{translateMessage('Date/Time')}</th>
                <th className="pb-3">{translateMessage('Subject')}</th>
                <th className="pb-3">{translateMessage('Type')}</th>
                <th className="pb-3">{translateMessage('Status')}</th>
                <th className="pb-3 text-right">{translateMessage('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {bookings.map((meeting) => (
                <tr key={meeting.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-2 text-[var(--text)]">
                    <div className="font-medium">{formatDateTime(meeting.date_time)}</div>
                    <div className="text-xs text-[var(--text-muted)]">{meeting.created_at}</div>
                  </td>
                  <td className="py-4 text-[var(--text)]">
                    <button type="button" onClick={() => onOpenBooking(meeting)} className="text-left hover:text-primary">
                      <div className="truncate max-w-[220px]">{meeting.subject || '—'}</div>
                      {meeting.notes ? <div className="text-xs text-[var(--text-muted)] truncate max-w-[220px]">{meeting.notes}</div> : null}
                    </button>
                  </td>
                  <td className="py-4 text-[var(--text-muted)]">{meeting.type_label || '—'}</td>
                  <td className="py-4">
                    <StatusPill label={meeting.status_label} status={meeting.status} />
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(meeting)}>
                        {translateMessage('Details')}
                      </Button>
                      {meeting.status === MEETING_STATUS.PENDING ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveBooking(meeting.id)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title={translateMessage('Approve')}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectBooking(meeting.id)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title={translateMessage('Reject')}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[var(--text-muted)]">
                    {translateMessage('No bookings found.')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        </>
      )}

      {pagination && pagination.last_page > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>
            {translateMessage('Page')} {pagination.current_page} {translateMessage('of')} {pagination.last_page} ({pagination.total} {translateMessage('total')})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1 || loading}
              onClick={() => onPageChange(pagination.current_page - 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.last_page || loading}
              onClick={() => onPageChange(pagination.current_page + 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <Sheet open={Boolean(selectedBooking)} onOpenChange={(open) => {
        if (!open) {
          onCloseBooking();
        }
      }}>
        {selectedBooking ? (
          <SheetContent side="right" dir="rtl" className="w-full max-w-2xl p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-[var(--border)] p-6 text-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl font-bold">{translateMessage('Meeting Details')}</SheetTitle>
                    <StatusPill label={selectedBooking.status_label} status={selectedBooking.status} />
                  </div>
                  <SheetDescription className="text-sm">
                    {selectedBooking.subject || translateMessage('No subject')}
                  </SheetDescription>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Schedule')}</p>
                    <p className="font-bold text-[var(--text)] flex items-center gap-2">
                      <Calendar size={15} /> {formatDateTime(selectedBooking.date_time)}
                    </p>
                  </div>
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Meeting Type')}</p>
                    <p className="font-bold text-[var(--text)]">{selectedBooking.type_label || '—'}</p>
                  </div>
                </div>

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2">{translateMessage('Notes')}</p>
                  <p className="text-sm text-[var(--text)] whitespace-pre-wrap">
                    {selectedBooking.notes || translateMessage('No notes were added.')}
                  </p>
                </div>

                {actionError ? <ErrorAlert message={actionError} /> : null}
                <SuccessToast message={actionMessage} />

                {selectedBooking.status === MEETING_STATUS.PENDING ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => onApproveBooking(selectedBooking.id)}
                      disabled={actionLoading}
                      className="gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                      {translateMessage('Approve')}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onRejectBooking(selectedBooking.id)}
                      disabled={actionLoading}
                      className="gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                      {translateMessage('Reject')}
                    </Button>
                  </div>
                ) : null}

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                  <h3 className="font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                    <Clock size={16} /> {translateMessage('Created')}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">{selectedBooking.created_at}</p>
                  {selectedBooking.cancel_by_name ? (
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                      {translateMessage('Canceled by')}: {selectedBooking.cancel_by_name}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  );
}
