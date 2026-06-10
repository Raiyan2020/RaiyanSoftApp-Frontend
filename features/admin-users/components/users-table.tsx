import React from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { AdminUser } from '../types/admin-user.types';
import UsersTableRow from './users-table-row';

interface UsersTableProps {
  filteredUsers: AdminUser[];
  formatDate: (ts: number) => string;
  onSelectUser: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTable({
  filteredUsers,
  formatDate,
  onSelectUser,
  onToggleStatus,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
            <th className="p-5 font-medium">{translateMessage('User')}</th>
            <th className="p-5 font-medium">{translateMessage('Contact')}</th>
            <th className="p-5 font-medium">{translateMessage('Role')}</th>
            <th className="p-5 font-medium">{translateMessage('Status')}</th>
            <th className="p-5 font-medium">{translateMessage('Registered')}</th>
            <th className="p-5 font-medium text-right">{translateMessage('Actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-sm">
          {filteredUsers.map((user) => (
            <UsersTableRow
              key={user.id}
              user={user}
              formatDate={formatDate}
              onSelectUser={onSelectUser}
              onToggleStatus={onToggleStatus}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
