import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, Ban, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { AdminEmployee } from '../types/admin-employee.types';
import {
  formatEmployeeDate,
  formatRoleLabel,
  getEmployeeFullName,
  getEmployeeStatusLabel,
  isEmployeeBlocked,
} from '../utils/employee-helpers';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';

interface EmployeeDetailDrawerProps {
  employee: AdminEmployee;
  loading?: boolean;
  onClose: () => void;
  onToggleStatus: (employee: AdminEmployee) => void;
  onDeleteEmployee: (id: number) => void;
  toggleLoading?: boolean;
  actionMessage?: string | null;
  actionError?: string | null;
}

export default function EmployeeDetailDrawer({
  employee,
  loading = false,
  onClose,
  onToggleStatus,
  onDeleteEmployee,
  toggleLoading = false,
  actionMessage,
  actionError,
}: EmployeeDetailDrawerProps) {
  const fullName = getEmployeeFullName(employee);
  const isBlocked = isEmployeeBlocked(employee);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-h-[90dvh] max-w-lg overflow-hidden p-0">
        <div className="flex items-center justify-between p-6 pe-12 border-b border-[var(--border)]">
          <DialogTitle>{translateMessage('Employee Details')}</DialogTitle>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : null}

          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-4">
              <Avatar name={fullName} size="xl" className="w-full h-full text-3xl border-4 border-[var(--border)] shadow-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)]">{fullName}</h3>
            <p className="text-[var(--text-muted)]">{translateMessage(formatRoleLabel(employee.role))}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-2">
                <Mail size={12} /> {translateMessage('Email')}
              </div>
              <div className="text-[var(--text)]">{employee.email}</div>
            </div>
            <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-2">
                <Phone size={12} /> {translateMessage('Phone')}
              </div>
              <div className="text-[var(--text)]">{employee.phone || translateMessage('N/A')}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Status')}</div>
                <div className={isBlocked ? 'text-danger' : 'text-success'}>
                  {translateMessage(getEmployeeStatusLabel(employee))}
                </div>
              </div>
              <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Created')}</div>
                <div className="text-[var(--text)] text-sm">{formatEmployeeDate(employee.created_at)}</div>
              </div>
            </div>

            {actionError ? (
              <ErrorAlert message={actionError} />
            ) : null}
            <SuccessToast message={actionMessage} />
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)] flex gap-3">
          <button
            type="button"
            onClick={() => onToggleStatus(employee)}
            disabled={toggleLoading}
            className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
              isBlocked ? 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success' : 'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] text-warning'
            }`}
          >
            {toggleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isBlocked ? (
              <CheckCircle size={18} />
            ) : (
              <Ban size={18} />
            )}
            {translateMessage(isBlocked ? 'Unblock' : 'Block')}
          </button>
          <button
            type="button"
            onClick={() => onDeleteEmployee(employee.id)}
            className="flex-1 py-3 rounded-xl bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger font-medium text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> {translateMessage('Delete')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
