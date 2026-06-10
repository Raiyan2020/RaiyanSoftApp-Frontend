import React from 'react';
import { Mail, Phone, Eye, Ban, CheckCircle, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { FEATURES } from '@/lib/feature-flags';
import { translateMessage } from '@/lib/i18n-utils';
import { AdminUser } from '../types/admin-user.types';

interface UsersMobileListProps {
  filteredUsers: AdminUser[];
  formatDate: (ts: number) => string;
  onSelectUser: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersMobileList({
  filteredUsers,
  formatDate,
  onSelectUser,
  onToggleStatus,
  onDeleteUser,
}: UsersMobileListProps) {
  return (
    <div className="md:hidden grid gap-3 p-4">
      {filteredUsers.map((user) => {
        const isActive = user.status === 'Active';
        const fullName = `${user.firstName} ${user.lastName}`.trim();

        return (
          <div key={user.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={fullName} className="w-10 h-10 shrink-0 border border-[var(--border)] text-sm" />
                <div className="min-w-0">
                  <p className="font-bold text-[var(--text)] truncate">{fullName}</p>
                  <p className="text-xs text-[var(--text-muted)]">{translateMessage('ID')}: {user.userCode || user.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>{user.status}</span>
              </div>
            </div>

            {/* Contact + role */}
            <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2 flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-xs text-[var(--text)]">
                <Mail size={12} className="text-[var(--text-muted)] shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
              {user.phone ? (
                <span className="flex items-center gap-2 text-xs text-[var(--text)]">
                  <Phone size={12} className="text-[var(--text-muted)] shrink-0" />
                  {user.phone}
                </span>
              ) : null}
              <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {user.role}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{formatDate(user.registeredAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectUser(user)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Eye size={14} />
                {translateMessage('View')}
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(user)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                {isActive ? translateMessage('Disable') : translateMessage('Enable')}
              </button>
              {FEATURES.userDeletion ? (
                <button
                  type="button"
                  onClick={() => onDeleteUser(user.id)}
                  className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
