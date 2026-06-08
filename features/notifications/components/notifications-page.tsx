'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, RefreshCw, Trash2 } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import { useNotifications, NotificationFilterType } from '../hooks/use-notifications';
import NotificationListItem from './notification-list-item';
import NotificationSheet from './notification-sheet';
import Loader from '@/components/ui/loader';
import ErrorAlert from '@/components/ui/error-alert';

export default function NotificationsPage() {
  const {
    t,
    filteredNotifications,
    activeFilter,
    setActiveFilter,
    selectedNotification,
    setSelectedNotification,
    handleOpen,
    handleDismiss,
    handleMarkAllRead,
    handleDeleteAll,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    refetch,
    isMutating,
  } = useNotifications();

  const filters: NotificationFilterType[] = ['all', 'unread', 'system'];

  return (
    <>
      <div className="app-page app-page-wide">
        <header className="app-header">
          <div>
            <h1 className="app-title">{t('notif.title')}</h1>
            <p className="app-subtitle">{t(`notif.filter_${activeFilter}`)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1 hover:text-primary transition-colors bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              <span>{isFetching ? t('notif.refreshing') : t('notif.refresh')}</span>
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isMutating}
              className="text-xs font-medium text-primary flex items-center gap-1 hover:text-blue-500 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              <CheckCheck size={14} />
              <span>{t('notif.mark_all')}</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isMutating}
              className="text-xs font-medium text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{t('notif.delete_all')}</span>
            </button>
            <div className="flex gap-2 no-scrollbar overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-full p-1">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                    activeFilter === filter
                      ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(29,183,240,0.3)]'
                      : 'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text)]'
                  } capitalize`}
                >
                  {t(`notif.filter_${filter}`)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {isError ? <ErrorAlert message={errorMessage || 'Unable to load notifications.'} className="mb-4" /> : null}

        {isLoading ? <Loader className="py-20" /> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {!isLoading && filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <NotificationListItem
                  key={n.id}
                  notification={n}
                  onClick={handleOpen}
                  onDismiss={handleDismiss}
                />
              ))
            ) : !isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-[var(--text-muted)]"
              >
                <EmptyState
                  icon={<CheckCheck size={32} className="opacity-50" />}
                  title={t('notif.empty')}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {selectedNotification ? (
        <NotificationSheet
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      ) : null}
    </>
  );
}
