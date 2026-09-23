import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Ban, CheckCircle, Trash2 } from 'lucide-react';
import { UserProject } from '@/lib/userProjectsStore';
import { FEATURES } from '@/lib/feature-flags';
import { AdminUser } from '../types/admin-user.types';
import UserProfileTab from './user-profile-tab';
import UserProjectsTab from './user-projects-tab';
import { translateMessage } from '@/lib/i18n-utils';

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
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-h-[90dvh] max-w-2xl overflow-hidden p-0">
        <div className="flex items-center justify-between p-6 pe-12 border-b border-[var(--border)]">
          <DialogTitle>{translateMessage('User Details')}</DialogTitle>
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
            {translateMessage('Projects')}
            {/* Count comes with the user (projects_count); the list itself loads lazily on this tab. */}
            {selectedUser.projectsCount !== null ? ` (${selectedUser.projectsCount})` : null}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
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
      </DialogContent>
    </Dialog>
  );
}
