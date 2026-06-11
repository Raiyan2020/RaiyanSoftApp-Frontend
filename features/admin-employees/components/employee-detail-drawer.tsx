import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Ban, CheckCircle, Trash2, Loader2 } from 'lucide-react';
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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(event) => event.stopPropagation()}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">{translateMessage('Employee Details')}</h2>
          <button type="button" onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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
            <p className="text-[var(--text-muted)]">{formatRoleLabel(employee.role)}</p>
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
              <div className="text-[var(--text)]">{employee.phone || 'N/A'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)] mb-1">{translateMessage('Status')}</div>
                <div className={isBlocked ? 'text-red-400' : 'text-emerald-400'}>
                  {getEmployeeStatusLabel(employee)}
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
              isBlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
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
            className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> {translateMessage('Delete')}
          </button>
        </div>
      </motion.div>
    </>
  );
}
