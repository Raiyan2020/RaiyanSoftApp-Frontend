'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirm-modal';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/ui/button';
import { useAppointmentsList } from '../hooks/use-appointments-list';
import AppointmentCard from './appointment-card';
import BookingWizard from './booking-wizard';

export default function AppointmentsPage() {
  const {
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
    hasActiveBooking,
    handleOpenWizard,
    canCancelMeeting,
    reload,
  } = useAppointmentsList();

  return (
    <motion.div
      initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
      className="app-page app-page-wide"
    >
      <header className="app-header">
        <div>
          <h1 className="app-title">{t('appt.title')}</h1>
          <p className="app-subtitle">
            {upcomingAppointments.length > 0 ? t('appt.active_title') : t('appt.no_appts_sub')}
          </p>
        </div>
        <Button onClick={handleOpenWizard} disabled={hasActiveBooking} className="gap-2">
          {hasActiveBooking ? <AlertTriangle size={18} /> : <Calendar size={18} />}
          {hasActiveBooking ? t('appt.complete_current') : t('appt.book_btn')}
        </Button>
      </header>

      <div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">{error}</div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{t('appt.active_title')}</h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

            <button
              type="button"
              onClick={handleOpenWizard}
              className={`w-full py-4 border rounded-2xl transition-colors flex items-center justify-center gap-2 ${
                hasActiveBooking
                  ? 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed opacity-70'
                  : 'bg-[var(--surface)] hover:bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {hasActiveBooking ? <AlertTriangle size={20} /> : <Plus size={20} />}
              <span>{hasActiveBooking ? t('appt.complete_current') : t('appt.book_another')}</span>
            </button>
          </div>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
            <EmptyState
              icon={<Calendar size={40} className="text-[var(--text-muted)] animate-pulse" />}
              title={t('appt.no_appts')}
              subtitle={t('appt.no_appts_sub')}
              action={
                <Button onClick={handleOpenWizard} className="mt-4 flex items-center gap-2">
                  <Calendar size={20} />
                  {t('appt.book_btn')}
                </Button>
              }
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showWizard ? (
          <BookingWizard
            onClose={() => {
              setShowWizard(false);
              reload();
            }}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showCancel}
        title={t('appt.cancel_btn')}
        message={t('appt.cancel_confirm')}
        confirmText="Yes, Cancel"
        isDestructive={true}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </motion.div>
  );
}
