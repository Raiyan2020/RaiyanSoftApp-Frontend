import React from 'react';
import { List, Calendar, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useAdminAppointments, DAYS } from '../hooks/use-admin-appointments';
import AdminBookingsTab from './admin-bookings-tab';
import AdminScheduleTab from './admin-schedule-tab';
import AdminSettingsTab from './admin-settings-tab';

export default function AdminAppointmentsPage() {
  const {
    activeTab,
    setActiveTab,
    filteredBookings,
    pagination,
    listLoading,
    listError,
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
    timeSlots,
    meetingSettings,
  } = useAdminAppointments();

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Appointments</h1>
        <p className="text-[var(--text-muted)] text-sm">Manage availability and view bookings.</p>
      </div>

      <div className="flex bg-[var(--surface-3)] p-1 rounded-xl w-fit border border-[var(--border)]">
        {[
          { id: 'bookings', label: 'Bookings', icon: List },
          { id: 'schedule', label: 'Availability', icon: Calendar },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'bookings' | 'schedule' | 'settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl min-h-[500px]">
        {activeTab === 'bookings' ? (
          <div className="p-6">
            <AdminBookingsTab
              bookings={filteredBookings}
              loading={listLoading}
              error={listError}
              pagination={pagination}
              statusFilter={bookingStatusFilter}
              searchQuery={bookingSearch}
              actionMessage={actionMessage}
              actionError={actionError}
              actionLoading={actionLoading}
              onStatusFilterChange={setBookingStatusFilter}
              onSearchQueryChange={setBookingSearch}
              selectedBooking={selectedBooking}
              onOpenBooking={openBooking}
              onCloseBooking={() => setSelectedBooking(null)}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onPageChange={goToPage}
            />
          </div>
        ) : null}

        {activeTab === 'schedule' ? (
          <div className="p-6">
            {timeSlots.loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-primary" size={28} />
              </div>
            ) : (
              <AdminScheduleTab
                weeklyAvailability={timeSlots.weeklyAvailability}
                saving={timeSlots.saving}
                error={timeSlots.error}
                onSave={timeSlots.save}
                onUpdateAvailability={timeSlots.updateDayEnabled}
                onAddRange={timeSlots.addRange}
                onRemoveRange={timeSlots.removeRange}
                onChangeRange={timeSlots.changeRange}
                days={DAYS}
              />
            )}
          </div>
        ) : null}

        {activeTab === 'settings' ? (
          <div className="p-6 max-w-2xl">
            <AdminSettingsTab
              settings={meetingSettings.settings}
              setSettings={meetingSettings.setSettings}
              loading={meetingSettings.loading}
              error={meetingSettings.error}
              message={meetingSettings.message}
              onSaveSettings={meetingSettings.save}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
