import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
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
    <div className="hidden md:block">
      <Table className="text-start border-collapse">
        <TableHeader>
          <TableRow className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider hover:bg-transparent">
            <TableHead className="p-5 font-medium text-start">{translateMessage('User')}</TableHead>
            <TableHead className="p-5 font-medium text-start">{translateMessage('Contact')}</TableHead>
            <TableHead className="p-5 font-medium text-start">{translateMessage('Role')}</TableHead>
            <TableHead className="p-5 font-medium text-start">{translateMessage('Status')}</TableHead>
            <TableHead className="p-5 font-medium text-start">{translateMessage('Registered')}</TableHead>
            <TableHead className="p-5 font-medium text-start">{translateMessage('Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-[var(--border)] text-sm">
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
        </TableBody>
      </Table>
    </div>
  );
}
