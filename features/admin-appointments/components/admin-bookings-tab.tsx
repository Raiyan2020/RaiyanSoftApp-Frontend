import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, MessageCircle, Phone, Save, Search, X, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { Appointment } from '@/lib/appointmentStore';

interface AdminBookingsTabProps {
  bookings: Appointment[];
  statusFilter: string;
  searchQuery: string;
  onStatusFilterChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  selectedBooking: Appointment | null;
  rejectReason: string;
  adminNotes: string;
  onSetRejectReason: (value: string) => void;
  onSetAdminNotes: (value: string) => void;
  onOpenBooking: (booking: Appointment) => void;
  onCloseBooking: () => void;
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onSaveAdminNotes: (id: string) => void;
  onCompleteBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
}

const statusClasses: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const inputClasses =
  'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

const formatDateTime = (value: any) =>
  new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const buildWhatsappUrl = (booking: Appointment) => {
  const phone = (booking.guestPhone || '').replace(/[^\d]/g, '');
  const message = encodeURIComponent(`Hello ${booking.guestName || ''}, regarding your Raiyansoft appointment about ${booking.topic}.`);
  return phone ? `https://wa.me/${phone}?text=${message}` : '';
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-bold capitalize border ${
        statusClasses[status] || 'bg-slate-500/10 text-[var(--text)] border-slate-500/20'
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminBookingsTab({
  bookings,
  statusFilter,
  searchQuery,
  onStatusFilterChange,
  onSearchQueryChange,
  selectedBooking,
  rejectReason,
  adminNotes,
  onSetRejectReason,
  onSetAdminNotes,
  onOpenBooking,
  onCloseBooking,
  onAcceptBooking,
  onRejectBooking,
  onSaveAdminNotes,
  onCompleteBooking,
  onCancelBooking,
}: AdminBookingsTabProps) {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search name, phone, email, topic..."
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'accepted', 'confirmed', 'rejected', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize border ${
                statusFilter === status
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {bookings.map((appt) => (
          <div key={appt.id} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[var(--text)] font-bold break-words">{appt.guestName || 'User'}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{appt.guestEmail || appt.userEmail || 'No Email'}</p>
              </div>
              <StatusPill status={appt.status} />
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs text-[var(--text-muted)]">
              <span>
                {new Date(appt.startAt as any).toLocaleDateString()} at{' '}
                {new Date(appt.startAt as any).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {appt.guestPhone ? (
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {appt.guestPhone}
                </span>
              ) : null}
              <span className="break-words">{appt.topic}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(appt)}>
                Details
              </Button>
              {appt.status === 'pending' ? (
                <Button type="button" size="sm" onClick={() => onAcceptBooking(appt.id)}>
                  Accept
                </Button>
              ) : null}
              {appt.status === 'accepted' || appt.status === 'confirmed' || appt.status === 'pending' ? (
                <Button type="button" variant="outline" size="sm" onClick={() => onCompleteBooking(appt.id)}>
                  Complete
                </Button>
              ) : null}
              {appt.status === 'accepted' || appt.status === 'confirmed' || appt.status === 'pending' ? (
                <Button type="button" variant="destructive" size="sm" onClick={() => onCancelBooking(appt.id)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        {bookings.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-muted)]">No bookings found.</div>
        ) : null}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border)]">
              <th className="pb-3 pl-2">Date/Time</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Topic</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-sm">
            {bookings.map((appt) => (
              <tr key={appt.id} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 pl-2 text-[var(--text)]">
                  <div className="font-medium">{new Date(appt.startAt as any).toLocaleDateString()}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {new Date(appt.startAt as any).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(appt.endAt as any).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="py-4 text-[var(--text)]">
                  <div className="font-bold flex items-center gap-2">
                    {appt.guestName || 'User'}
                    {appt.source === 'guest' ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] border border-orange-500/30">
                        Guest
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{appt.guestEmail || appt.userEmail || 'No Email'}</div>
                  {appt.guestPhone ? (
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {appt.guestPhone}
                    </div>
                  ) : null}
                </td>
                <td className="py-4 text-[var(--text)]">
                  <button type="button" onClick={() => onOpenBooking(appt)} className="text-left hover:text-primary">
                    <div className="truncate max-w-[180px]">{appt.topic}</div>
                    <div className="text-xs text-[var(--text-muted)] capitalize">{appt.meetingType}</div>
                  </button>
                </td>
                <td className="py-4">
                  <StatusPill status={appt.status} />
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => onOpenBooking(appt)}>
                      Details
                    </Button>
                    {appt.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onAcceptBooking(appt.id)}
                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        title="Accept"
                      >
                        <CheckCircle size={16} />
                      </button>
                    ) : null}
                    {appt.status === 'accepted' || appt.status === 'confirmed' || appt.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onCompleteBooking(appt.id)}
                        className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                        title="Complete"
                      >
                        <CheckCircle size={16} />
                      </button>
                    ) : null}
                    {appt.status === 'accepted' || appt.status === 'confirmed' || appt.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onCancelBooking(appt.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[var(--text-muted)]">
                  No bookings found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedBooking ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseBooking}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-[var(--border)] flex items-start justify-between gap-4 sticky top-0 bg-[var(--surface)] z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-[var(--text)]">Appointment Details</h2>
                    <StatusPill status={selectedBooking.status} />
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{selectedBooking.topic}</p>
                </div>
                <button type="button" onClick={onCloseBooking} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Customer</p>
                    <p className="font-bold text-[var(--text)]">{selectedBooking.guestName || 'User'}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{selectedBooking.guestEmail || selectedBooking.userEmail}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{selectedBooking.guestPhone || 'No phone'}</p>
                  </div>
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Schedule</p>
                    <p className="font-bold text-[var(--text)] flex items-center gap-2">
                      <Calendar size={15} /> {formatDateTime(selectedBooking.startAt as any)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 capitalize">{selectedBooking.meetingType}</p>
                  </div>
                </div>

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2">Client Notes</p>
                  <p className="text-sm text-[var(--text)] whitespace-pre-wrap">
                    {selectedBooking.notes || 'No notes were added by the client.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-[var(--text-muted)] font-medium ms-1">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(event) => onSetAdminNotes(event.target.value)}
                    className={`${inputClasses} h-28 resize-none`}
                    placeholder="Internal notes for this booking."
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => onSaveAdminNotes(selectedBooking.id)} className="gap-2">
                    <Save size={15} />
                    Save Notes
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-[var(--text-muted)] font-medium ms-1">Reject Reason</label>
                  <textarea
                    value={rejectReason}
                    onChange={(event) => onSetRejectReason(event.target.value)}
                    className={`${inputClasses} h-24 resize-none`}
                    placeholder="Required before rejecting the appointment."
                  />
                </div>

                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
                  <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <Clock size={16} /> Status History
                  </h3>
                  {selectedBooking.statusHistory?.length ? (
                    <div className="space-y-3">
                      {selectedBooking.statusHistory.map((item, index) => (
                        <div key={`${item.status}-${item.createdAt}-${index}`} className="border-l border-primary/30 ps-3">
                          <p className="text-sm font-bold text-[var(--text)] capitalize">{item.status}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {formatDateTime(item.createdAt)} by {item.createdByName || 'Admin'}
                          </p>
                          {item.reason ? <p className="text-xs text-[var(--text-muted)] mt-1">{item.reason}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)]">No status history yet.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedBooking.guestPhone ? (
                    <a
                      href={buildWhatsappUrl(selectedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  ) : null}
                  {selectedBooking.status === 'pending' ? (
                    <Button type="button" onClick={() => onAcceptBooking(selectedBooking.id)} className="gap-2">
                      <CheckCircle size={16} />
                      Accept
                    </Button>
                  ) : null}
                  {selectedBooking.status === 'pending' ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onRejectBooking(selectedBooking.id)}
                      className="gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>
                  ) : null}
                  {selectedBooking.status === 'accepted' || selectedBooking.status === 'confirmed' ? (
                    <Button type="button" variant="outline" onClick={() => onCompleteBooking(selectedBooking.id)} className="gap-2">
                      <CheckCircle size={16} />
                      Complete
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
