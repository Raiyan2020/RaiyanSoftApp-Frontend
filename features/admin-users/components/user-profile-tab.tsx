import React from 'react';
import { Phone, User as UserIcon, Calendar, Briefcase, Clock, CheckCircle } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { User } from '@/lib/userStore';

interface UserProfileTabProps {
  selectedUser: User;
  formatDate: (ts: number) => string;
  formatDateTime: (ts: number) => string;
}

export default function UserProfileTab({ selectedUser, formatDate, formatDateTime }: UserProfileTabProps) {
  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 mb-4 relative">
          <Avatar
            name={`${selectedUser.firstName} ${selectedUser.lastName}`}
            size="xl"
            className="w-full h-full text-3xl border-4 border-[var(--border)] shadow-xl"
          />
          <div
            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[var(--border)] ${
              selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
        </div>
        <h3 className="text-2xl font-bold text-[var(--text)] mb-1">
          {selectedUser.firstName} {selectedUser.lastName}
        </h3>
        <p className="text-[var(--text-muted)] text-sm">{selectedUser.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
          <div className="text-[var(--text-muted)] text-xs mb-1 flex items-center gap-1">
            <Phone size={12} /> Phone
          </div>
          <div className="text-[var(--text)] text-sm font-medium">{selectedUser.phone || 'N/A'}</div>
        </div>
        <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
          <div className="text-[var(--text-muted)] text-xs mb-1 flex items-center gap-1">
            <UserIcon size={12} /> Role
          </div>
          <div className="text-[var(--text)] text-sm font-medium">{selectedUser.role}</div>
        </div>
        <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
          <div className="text-[var(--text-muted)] text-xs mb-1 flex items-center gap-1">
            <Calendar size={12} /> Registered
          </div>
          <div className="text-[var(--text)] text-sm font-medium">{formatDate(selectedUser.registeredAt)}</div>
        </div>
        <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
          <div className="text-[var(--text-muted)] text-xs mb-1 flex items-center gap-1">
            <Briefcase size={12} /> Projects
          </div>
          <div className="text-[var(--text)] text-sm font-medium">{selectedUser.projectsCount || 0} Created</div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-bold text-[var(--text)] mb-3 uppercase tracking-wider">Activity</h4>
        <div className="bg-[var(--surface-3)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          <div className="p-4 flex items-center justify-between">
            <span className="text-[var(--text-muted)] text-sm flex items-center gap-2">
              <Clock size={16} /> Last Login
            </span>
            <span className="text-[var(--text)] text-sm">{formatDateTime(selectedUser.lastLoginAt)}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-[var(--text-muted)] text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Account Status
            </span>
            <span
              className={`text-sm font-medium ${selectedUser.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {selectedUser.status}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
