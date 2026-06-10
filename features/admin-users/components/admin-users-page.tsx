import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Download, User as UserIcon } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import { useAdminUsers } from '../hooks/use-admin-users';
import UsersFilterBar from './users-filter-bar';
import UsersTable from './users-table';
import UsersMobileList from './users-mobile-list';
import UserDetailDrawer from './user-detail-drawer';

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    actionError,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    selectedUser,
    setSelectedUser,
    deleteId,
    setDeleteId,
    activeTab,
    setActiveTab,
    userProjects,
    loadingProjects,
    filteredUsers,
    formatDate,
    formatDateTime,
    handleExport,
    handleToggleStatus,
    handleDelete,
  } = useAdminUsers();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            {translateMessage('Users')}
            <span className="text-sm font-normal text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-1 rounded-full border border-[var(--border)]">
              {users.length}
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm">{translateMessage('Registered accounts management.')}</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-[var(--border)]"
        >
          <Download size={18} />
          <span>{translateMessage('Export CSV')}</span>
        </button>
      </div>

      {error || actionError ? <ErrorAlert message={error || actionError} /> : null}

      <UsersFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <div className="w-16 h-16 bg-[var(--surface-3)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
              <UserIcon size={24} />
            </div>
            <p>{translateMessage('Loading users...')}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <div className="w-16 h-16 bg-[var(--surface-3)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
              <UserIcon size={24} />
            </div>
            <p>{translateMessage(error ? 'Unable to load users.' : 'No users found matching your criteria.')}</p>
          </div>
        ) : (
          <>
            <UsersTable
              filteredUsers={filteredUsers}
              formatDate={formatDate}
              onSelectUser={setSelectedUser}
              onToggleStatus={handleToggleStatus}
              onDeleteUser={setDeleteId}
            />

            <UsersMobileList
              filteredUsers={filteredUsers}
              formatDate={formatDate}
              onSelectUser={setSelectedUser}
              onToggleStatus={handleToggleStatus}
              onDeleteUser={setDeleteId}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedUser ? (
          <UserDetailDrawer
            selectedUser={selectedUser}
            onClose={() => setSelectedUser(null)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loadingProjects={loadingProjects}
            userProjects={userProjects}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={setDeleteId}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User?"
        message="Are you sure you want to delete this user? This action cannot be undone and they will lose access immediately."
        confirmText="Delete User"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
