import React from 'react';
import { Mail, Phone, Eye, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { AdminEmployee } from '../types/admin-employee.types';
import {
  formatEmployeeDate,
  formatRoleLabel,
  getEmployeeFullName,
  getEmployeeStatusLabel,
  isEmployeeBlocked,
} from '../utils/employee-helpers';

interface EmployeeTableRowProps {
  employee: AdminEmployee;
  onSelectEmployee: (employee: AdminEmployee) => void;
  onOpenModal: (employee: AdminEmployee) => void;
  onDeleteEmployee: (id: number) => void;
}

export default function EmployeeTableRow({
  employee,
  onSelectEmployee,
  onOpenModal,
  onDeleteEmployee,
}: EmployeeTableRowProps) {
  const fullName = getEmployeeFullName(employee);
  const statusLabel = getEmployeeStatusLabel(employee);
  const isBlocked = isEmployeeBlocked(employee);

  return (
    <>
      <tr className="hidden md:table-row hover:bg-white/[0.02] transition-colors group">
        <td className="p-5">
          <div className="flex items-center gap-3">
            <Avatar name={fullName} className="w-10 h-10 border border-[var(--border)] text-sm" />
            <div>
              <div className="font-medium text-[var(--text)]">{fullName}</div>
              <div className="text-[var(--text-muted)] text-xs">ID: {employee.id}</div>
            </div>
          </div>
        </td>
        <td className="p-5 text-[var(--text)]">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-[var(--text-muted)]" /> {employee.email}
            </span>
            {employee.phone ? (
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-[var(--text-muted)]" /> {employee.phone}
              </span>
            ) : null}
          </div>
        </td>
        <td className="p-5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-3)] text-[var(--text)] border border-[var(--border)]">
            {formatRoleLabel(employee.role)}
          </span>
        </td>
        <td className="p-5">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isBlocked ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              }`}
            />
            <span className={isBlocked ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'}>{statusLabel}</span>
          </div>
        </td>
        <td className="p-5 text-[var(--text-muted)]">{formatEmployeeDate(employee.created_at)}</td>
        <td className="p-5 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onSelectEmployee(employee)}
              className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => onOpenModal(employee)}
              className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteEmployee(employee.id)}
              className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-muted)] hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      <div
        className="md:hidden p-4 flex items-center justify-between cursor-pointer border-b border-[var(--border)]"
        onClick={() => onSelectEmployee(employee)}
      >
        <div className="flex items-center gap-3">
          <Avatar name={fullName} className="w-10 h-10 border border-[var(--border)] text-sm" />
          <div>
            <h3 className="text-sm font-medium text-[var(--text)]">{fullName}</h3>
            <p className="text-xs text-[var(--text-muted)]">{formatRoleLabel(employee.role)}</p>
          </div>
        </div>
        <MoreHorizontal size={20} className="text-[var(--text-muted)]" />
      </div>
    </>
  );
}
