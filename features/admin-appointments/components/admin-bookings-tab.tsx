import React from 'react';
import { Calendar, CheckCircle, Clock, Loader2, MessageCircle, Search, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import Input from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SuccessToast from '@/components/ui/success-toast';
import ReasonDialog from '@/components/ui/reason-dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import TablePagination from '@/components/ui/table-pagination';
import { translateMessage } from '@/lib/i18n-utils';
import { toWhatsAppUrl } from '@/lib/utils';
import {
  AdminMeeting,
  MEETING_STATUS,
  MEETING_TYPE,
  MeetingsPagination,
} from '@/features/meetings';
import { getMeetingStatusTone, parseMeetingDateTime } from '@/features/meetings';
import { AdminMeetingStatusFilter, AdminMeetingTypeFilter } from '../hooks/use-admin-appointments';
import { formatLocalizedDate, readStoredLanguage } from '@/lib/language';

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
  onRejectBooking: (id: number, reason: string) => Promise<void>;
  onPageChange: (page: number) => void;
}

const TYPE_FILTER_ALL = '__all__';

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

function MeetingWhatsAppButton({ phone }: { phone?: string | null }) {
  const waUrl = toWhatsAppUrl(phone);

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
    formatLocalizedDate(parseMeetingDateTime(value), readStoredLanguage(), { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  // Backend requires a rejection reason (RejectMeetingRequest: reason|required).
  const [rejectingId, setRejectingId] = React.useState<number | null>(null);
  const promptAndReject = (id: number) => setRejectingId(id);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={translateMessage('Search by name, subject, email, or phone...')}
            icon={<Search size={17} />}
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
          lang={readStoredLanguage()}
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label={translateMessage('From date')}
          className="app-input rounded-xl min-h-11 px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="date"
          lang={readStoredLanguage()}
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label={translateMessage('To date')}
          className="app-input rounded-xl min-h-11 px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <Select
          value={typeFilter ? String(typeFilter) : TYPE_FILTER_ALL}
          onValueChange={(value) =>
            onTypeFilterChange(value === TYPE_FILTER_ALL ? '' : (Number(value) as typeof MEETING_TYPE.ONLINE | typeof MEETING_TYPE.OFFLINE))
          }
        >
          <SelectTrigger className="min-h-11" aria-label={translateMessage('Meeting Type')}>
            <SelectValue placeholder={translateMessage('All Types')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TYPE_FILTER_ALL}>{translateMessage('All Types')}</SelectItem>
            <SelectItem value={String(MEETING_TYPE.ONLINE)}>{translateMessage('Online')}</SelectItem>
            <SelectItem value={String(MEETING_TYPE.OFFLINE)}>{translateMessage('In Person')}</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead className="pb-3 text-start">{translateMessage('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[var(--border)] text-sm">
              {bookings.map((meeting) => (
                <TableRow key={meeting.id} className="group hover:bg-white/5">
                  <TableCell className="py-4 ps-2 text-start text-[var(--text)]">
                    <div className="font-medium">{formatDateTime(meeting.date_time)}</div>
                    <div className="text-xs text-[var(--text-muted)]">{formatDateTime(meeting.created_at)}</div>
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
                  <TableCell className="py-4 text-start">
                    <div className="flex items-center justify-start gap-2">
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

      <TablePagination pagination={pagination} onPageChange={onPageChange} loading={loading} className="mt-4" />

      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => {
        if (!open) {
          onCloseBooking();
        }
      }}>
        {selectedBooking ? (
          <DialogContent className="max-h-[90dvh] max-w-2xl overflow-hidden p-0">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-[var(--border)] p-6 pe-12 text-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl font-bold">{translateMessage('Meeting Details')}</DialogTitle>
                    <StatusPill label={selectedBooking.status_label} status={selectedBooking.status} />
                  </div>
                  <DialogDescription className="text-sm">
                    {selectedBooking.subject || translateMessage('No subject')}
                  </DialogDescription>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
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

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 flex items-start gap-2">
                  <Clock size={16} className="mt-1 shrink-0 text-[var(--text)]" />
                  <div className="min-w-0 text-start">
                    <h3 className="font-bold text-[var(--text)] mb-2">{translateMessage('Created')}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{formatDateTime(selectedBooking.created_at)}</p>
                    {selectedBooking.cancel_by_name ? (
                      <p className="text-sm text-[var(--text-muted)] mt-2">
                        {translateMessage('Canceled by')}: {selectedBooking.cancel_by_name}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <ReasonDialog
        open={rejectingId !== null}
        title={translateMessage('Reject')}
        onClose={() => setRejectingId(null)}
        onSubmit={async (reason) => {
          if (rejectingId === null) return;
          await onRejectBooking(rejectingId, reason);
          setRejectingId(null);
        }}
      />
    </>
  );
}
