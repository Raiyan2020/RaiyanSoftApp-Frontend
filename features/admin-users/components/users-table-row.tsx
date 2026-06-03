import React from 'react';
import { Mail, Phone, Eye, Ban, CheckCircle, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { User } from '@/lib/userStore';

interface UsersTableRowProps {
  user: User;
  formatDate: (ts: number) => string;
  onSelectUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTableRow({
  user,
  formatDate,
  onSelectUser,
  onToggleStatus,
  onDeleteUser,
}: UsersTableRowProps) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="p-5">
        <div className="flex items-center gap-3">
          <Avatar name={`${user.firstName} ${user.lastName}`} className="w-10 h-10 border border-[var(--border)] text-sm" />
          <div>
            <div className="font-medium text-[var(--text)]">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[var(--text-muted)] text-xs">ID: {user.id.slice(-6)}</div>
          </div>
        </div>
      </td>
      <td className="p-5 text-[var(--text)]">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5">
            <Mail size={12} className="text-[var(--text-muted)]" /> {user.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={12} className="text-[var(--text-muted)]" /> {user.phone || 'N/A'}
          </span>
        </div>
      </td>
      <td className="p-5">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            user.role === 'Admin'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="p-5">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'
            }`}
          />
          <span className={user.status === 'Active' ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>{user.status}</span>
        </div>
      </td>
      <td className="p-5 text-[var(--text-muted)]">{formatDate(user.registeredAt)}</td>
      <td className="p-5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onSelectUser(user)}
            className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${
              user.status === 'Active' ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
            }`}
            title={user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
          >
            {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
          </button>
          <button
            type="button"
            onClick={() => onDeleteUser(user.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-colors"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
