import React from 'react';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Loader2, MessageCircle, Search, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import SuccessToast from '@/components/ui/success-toast';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { translateMessage } from '@/lib/i18n-utils';
import {
  AdminMeeting,
  MEETING_STATUS,
  MEETING_TYPE,
  MeetingsPagination,
} from '@/features/meetings';
import { getMeetingStatusTone, parseMeetingDateTime } from '@/features/meetings';
import { AdminMeetingStatusFilter, AdminMeetingTypeFilter } from '../hooks/use-admin-appointments';

interface AdminBookingsTabProps {
  bookings: AdminMeeting[];
  loading: boolean;
  error: string | null;
  pagination: MeetingsPagination | null;
  statusFilter: AdminMeetingStatusFilter;
  typeFilter: AdminMeetingTypeFilter;
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
  actionMessage: string | null;
  actionError: string | null;
  actionLoading: boolean;
  onStatusFilterChange: (value: AdminMeetingStatusFilter) => void;
  onTypeFilterChange: (value: AdminMeetingTypeFilter) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  selectedBooking: AdminMeeting | null;
  onOpenBooking: (booking: AdminMeeting) => void;
  onCloseBooking: () => void;
  onApproveBooking: (id: number) => void;
  onRejectBooking: (id: number, reason: string) => void;
  onPageChange: (page: number) => void;
}

const STATUS_OPTIONS: { value: AdminMeetingStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'canceled', label: 'Canceled' },
];

function StatusPill({ label, status }: { label: string; status: number }) {
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border ${getMeetingStatusTone(status)}`}>
      {label}
    </span>
  );
}

function canApprove(status: number) {
  return status === MEETING_STATUS.PENDING || status === MEETING_STATUS.REJECTED;
}

// Same digit-normalization rule as admin-leads' toWhatsAppDigits (Kuwait 8-digit numbers get the 965 prefix).
function toWhatsAppDigits(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 8) return `965${digits}`;
  if (digits.length < 8) return null;
  return digits;
}

function MeetingWhatsAppButton({ phone }: { phone?: string | null }) {
  const waDigits = phone ? toWhatsAppDigits(phone) : null;
  const waUrl = waDigits
    ? `https://web.whatsapp.com/send/?phone=${waDigits}&type=phone_number&app_absent=0`
    : null;

  return (
    <a
      href={waUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (!waUrl) event.preventDefault();
      }}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        waUrl
          ? 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success hover:bg-[color-mix(in_srgb,var(--success)_20%,transparent)]'
          : 'bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
      }`}
      title={waUrl ? translateMessage('WhatsApp') : translateMessage('No phone number')}
    >
      <MessageCircle size={16} />
    </a>
  );
}

export default function AdminBookingsTab({
  bookings,
  loading,
  error,
  pagination,
  statusFilter,
  typeFilter,
  dateFrom,
  dateTo,
  searchQuery,
  actionMessage,
  actionError,
  actionLoading,
  onStatusFilterChange,
  onTypeFilterChange,
  onDateFromChange,
  onDateToChange,
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

  // Backend requires a rejection reason (RejectMeetingRequest: reason|required).
  // ponytail: native window.prompt keeps this a one-line fix with no new
  // component; swap for an in-sheet textarea if the UX needs to improve.
  const promptAndReject = (id: number) => {
    const reason = window.prompt(translateMessage('Enter a rejection reason:'));
    if (!reason || !reason.trim()) return;
    onRejectBooking(id, reason.trim());
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={translateMessage('Search by name, subject, email, or phone...')}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 ps-10 pe-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary"
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
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {translateMessage(status.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label={translateMessage('From date')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label={translateMessage('To date')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value ? (Number(event.target.value) as typeof MEETING_TYPE.ONLINE | typeof MEETING_TYPE.OFFLINE) : '')}
          aria-label={translateMessage('Meeting Type')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">{translateMessage('All Types')}</option>
          <option value={MEETING_TYPE.ONLINE}>{translateMessage('Online')}</option>
          <option value={MEETING_TYPE.OFFLINE}>{translateMessage('In Person')}</option>
        </select>
      </div>

      {error ? (
        <ErrorAlert message={error} />
      ) : null}
      {actionError ? (
        <ErrorAlert message={actionError} />
      ) : null}
      <SuccessToast message={actionMessage} />

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
                  <p className="font-bold text-[var(--text)] break-words">{meeting.subject || '-'}</p>
                  {meeting.user ? (
                    <p className="text-xs text-[var(--text-muted)] mt-1 break-words">
                      {meeting.user.full_name} · {meeting.user.full_phone}
                    </p>
                  ) : null}
                  <p className="text-xs text-[var(--text-muted)] mt-1">{formatDateTime(meeting.date_time)}</p>
                </div>
                <StatusPill label={meeting.status_label} status={meeting.status} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(meeting)}>
                  {translateMessage('Details')}
                </Button>
                <MeetingWhatsAppButton phone={meeting.user?.full_phone} />
                {canApprove(meeting.status) ? (
                  <>
                    <Button type="button" size="sm" onClick={() => onApproveBooking(meeting.id)} disabled={actionLoading}>
                      {translateMessage('Approve')}
                    </Button>
                    {meeting.status === MEETING_STATUS.PENDING ? <Button type="button" variant="destructive" size="sm" onClick={() => promptAndReject(meeting.id)} disabled={actionLoading}>{translateMessage('Reject')}</Button> : null}
                  </>
                ) : null}
              </div>
            </div>
          ))}
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-muted)]">{translateMessage('No bookings found.')}</div>
          ) : null}
        </div>

        <div className="hidden md:block">
          <Table className="text-start">
            <TableHeader>
              <TableRow className="text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="pb-3 ps-2 text-start">{translateMessage('Date/Time')}</TableHead>
                <TableHead className="pb-3 text-start">{translateMessage('Client')}</TableHead>
                <TableHead className="pb-3 text-start">{translateMessage('Subject')}</TableHead>
                <TableHead className="pb-3 text-start">{translateMessage('Type')}</TableHead>
                <TableHead className="pb-3 text-start">{translateMessage('Status')}</TableHead>
                <TableHead className="pb-3 text-end">{translateMessage('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[var(--border)] text-sm">
              {bookings.map((meeting) => (
                <TableRow key={meeting.id} className="group hover:bg-white/5">
                  <TableCell className="py-4 ps-2 text-start text-[var(--text)]">
                    <div className="font-medium">{formatDateTime(meeting.date_time)}</div>
                    <div className="text-xs text-[var(--text-muted)]">{meeting.created_at}</div>
                  </TableCell>
                  <TableCell className="py-4 text-start text-[var(--text)]">
                    <div className="font-medium truncate max-w-[180px]">{meeting.user?.full_name || '-'}</div>
                    <div className="text-xs text-[var(--text-muted)]">{meeting.user?.full_phone || '-'}</div>
                  </TableCell>
                  <TableCell className="py-4 text-start text-[var(--text)]">
                    <button type="button" onClick={() => onOpenBooking(meeting)} className="text-start hover:text-primary">
                      <div className="truncate max-w-[220px]">{meeting.subject || '-'}</div>
                      {meeting.notes ? <div className="text-xs text-[var(--text-muted)] truncate max-w-[220px]">{meeting.notes}</div> : null}
                    </button>
                  </TableCell>
                  <TableCell className="py-4 text-start text-[var(--text-muted)]">{meeting.type_label || '-'}</TableCell>
                  <TableCell className="py-4 text-start">
                    <StatusPill label={meeting.status_label} status={meeting.status} />
                  </TableCell>
                  <TableCell className="py-4 text-end">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(meeting)}>
                        {translateMessage('Details')}
                      </Button>
                      <MeetingWhatsAppButton phone={meeting.user?.full_phone} />
                      {canApprove(meeting.status) ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveBooking(meeting.id)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-[color-mix(in_srgb,var(--info)_20%,transparent)] text-info rounded-lg transition-colors"
                            title={translateMessage('Approve')}
                          >
                            <CheckCircle size={16} />
                          </button>
                          {meeting.status === MEETING_STATUS.PENDING ? <button type="button" onClick={() => promptAndReject(meeting.id)} disabled={actionLoading} className="p-2 hover:bg-[color-mix(in_srgb,var(--danger)_20%,transparent)] text-danger rounded-lg transition-colors" title={translateMessage('Reject')}><XCircle size={16} /></button> : null}
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-10 text-[var(--text-muted)]">
                    {translateMessage('No bookings found.')}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
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
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Client')}</p>
                    <p className="font-bold text-[var(--text)] truncate">{selectedBooking.user?.full_name || '-'}</p>
                    <p className="text-sm text-[var(--text-muted)]">{selectedBooking.user?.full_phone || '-'}</p>
                  </div>
                  <MeetingWhatsAppButton phone={selectedBooking.user?.full_phone} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Schedule')}</p>
                    <p className="font-bold text-[var(--text)] flex items-center gap-2">
                      <Calendar size={15} /> {formatDateTime(selectedBooking.date_time)}
                    </p>
                  </div>
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Meeting Type')}</p>
                    <p className="font-bold text-[var(--text)]">{selectedBooking.type_label || '-'}</p>
                  </div>
                </div>

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2">{translateMessage('Notes')}</p>
                  <p className="text-sm text-[var(--text)] whitespace-pre-wrap">
                    {selectedBooking.notes || translateMessage('No notes were added.')}
                  </p>
                </div>

                {canApprove(selectedBooking.status) ? (
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
                    {selectedBooking.status === MEETING_STATUS.PENDING ? <Button type="button" variant="destructive" onClick={() => promptAndReject(selectedBooking.id)} disabled={actionLoading} className="gap-2">{actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}{translateMessage('Reject')}</Button> : null}
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
