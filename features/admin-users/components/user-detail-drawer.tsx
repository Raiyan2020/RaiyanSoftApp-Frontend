import React from 'react';
import { motion } from 'framer-motion';
import { X, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { UserProject } from '@/lib/userProjectsStore';
import { FEATURES } from '@/lib/feature-flags';
import { AdminUser } from '../types/admin-user.types';
import UserProfileTab from './user-profile-tab';
import UserProjectsTab from './user-projects-tab';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';

interface UserDetailDrawerProps {
  selectedUser: AdminUser;
  onClose: () => void;
  activeTab: 'profile' | 'projects';
  setActiveTab: (tab: 'profile' | 'projects') => void;
  loadingProjects: boolean;
  userProjects: UserProject[];
  formatDate: (ts: number) => string;
  formatDateTime: (ts: number) => string;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserDetailDrawer({
  selectedUser,
  onClose,
  activeTab,
  setActiveTab,
  loadingProjects,
  userProjects,
  formatDate,
  formatDateTime,
  onToggleStatus,
  onDeleteUser,
}: UserDetailDrawerProps) {
  const { dir } = useTranslation();
  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(event) => event.stopPropagation()}
        className="fixed inset-y-0 end-0 z-50 w-full max-w-lg bg-[var(--surface)] border-s border-[var(--border)] shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">{translateMessage('User Details')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {translateMessage('Profile Info')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'projects'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {translateMessage('Projects')} ({userProjects.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' ? (
            <UserProfileTab
              selectedUser={selectedUser}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
            />
          ) : (
            <UserProjectsTab
              loadingProjects={loadingProjects}
              userProjects={userProjects}
              formatDate={formatDate}
            />
          )}
        </div>

        {activeTab === 'profile' ? (
          <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onToggleStatus(selectedUser)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  selectedUser.status === 'Active'
                    ? 'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] text-warning hover:bg-[color-mix(in_srgb,var(--warning)_20%,transparent)] border border-[color-mix(in_srgb,var(--warning)_20%,transparent)]'
                    : 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success hover:bg-[color-mix(in_srgb,var(--success)_20%,transparent)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)]'
                }`}
              >
                {selectedUser.status === 'Active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                {translateMessage(selectedUser.status === 'Active' ? 'Disable Account' : 'Activate Account')}
              </button>
              {FEATURES.userDeletion ? (
                <button
                  type="button"
                  onClick={() => onDeleteUser(selectedUser.id)}
                  className="flex-1 py-3 rounded-xl bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger hover:bg-[color-mix(in_srgb,var(--danger)_20%,transparent)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  {translateMessage('Delete')}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </motion.div>
    </>
  );
}
