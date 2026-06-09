'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, Calendar, Loader2, Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import EmptyState from '@/components/ui/empty-state';
import AppointmentCard from '@/features/appointments/components/appointment-card';
import BookingWizard from '@/features/appointments/components/booking-wizard';
import { useAppointmentsList } from '@/features/appointments/hooks/use-appointments-list';

export default function ProfileBookingsPanel() {
  const {
    t,
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
    hasActiveBooking,
    handleOpenWizard,
    canCancelMeeting,
    reload,
  } = useAppointmentsList();

  const closeWizard = () => {
    setShowWizard(false);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">{t('appt.title')}</h2>
          <p className="text-sm text-[var(--text-muted)]">{t('appt.no_appts_sub')}</p>
        </div>
        <Button onClick={handleOpenWizard} disabled={hasActiveBooking} className="gap-2">
          {hasActiveBooking ? <AlertTriangle size={18} /> : <Plus size={18} />}
          {hasActiveBooking ? t('appt.complete_current') : t('appt.book_btn')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">{error}</div>
      ) : upcomingAppointments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingAppointments.map((meeting) => (
            <AppointmentCard
              key={meeting.id}
              meeting={meeting}
              t={t}
              formatDate={formatDate}
              formatTime={formatTime}
              onCancel={initiateCancel}
              canCancel={canCancelMeeting(meeting.status)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Calendar size={40} className="text-[var(--text-muted)]" />}
          title={t('appt.no_appts')}
          subtitle={t('appt.no_appts_sub')}
          action={
            <Button onClick={handleOpenWizard} className="mt-2 gap-2">
              <Calendar size={18} />
              {t('appt.book_btn')}
            </Button>
          }
        />
      )}

      <AnimatePresence>{showWizard ? <BookingWizard onClose={closeWizard} onBooked={reload} /> : null}</AnimatePresence>

      <ConfirmModal
        isOpen={showCancel}
        title={t('appt.cancel_btn')}
        message={t('appt.cancel_confirm')}
        confirmText="Yes, Cancel"
        isDestructive
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </div>
  );
}
