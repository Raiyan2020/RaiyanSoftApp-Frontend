import React from 'react';
import { Briefcase, Mail, Phone, Eye, Edit2, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { translateMessage } from '@/lib/i18n-utils';
import { AdminEmployee } from '../types/admin-employee.types';
import {
  formatEmployeeDate,
  formatRoleLabel,
  getEmployeeFullName,
  getEmployeeStatusLabel,
  isEmployeeBlocked,
} from '../utils/employee-helpers';
import EmployeeTableRow from './employee-table-row';

interface EmployeesTableProps {
  employees: AdminEmployee[];
  onSelectEmployee: (employee: AdminEmployee) => void;
  onOpenModal: (employee: AdminEmployee) => void;
  onDeleteEmployee: (id: number) => void;
}

export default function EmployeesTable({
  employees,
  onSelectEmployee,
  onOpenModal,
  onDeleteEmployee,
}: EmployeesTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
      {employees.length === 0 ? (
        <div className="py-20 text-center text-[var(--text-muted)]">
          <div className="w-16 h-16 bg-[var(--surface-3)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
            <Briefcase size={24} />
          </div>
          <p>{translateMessage('No employees found.')}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="p-5 font-medium">{translateMessage('Name')}</th>
                  <th className="p-5 font-medium">{translateMessage('Contact')}</th>
                  <th className="p-5 font-medium">{translateMessage('Role')}</th>
                  <th className="p-5 font-medium">{translateMessage('Status')}</th>
                  <th className="p-5 font-medium">{translateMessage('Created')}</th>
                  <th className="p-5 font-medium text-right">{translateMessage('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm">
                {employees.map((employee) => (
                  <EmployeeTableRow
                    key={employee.id}
                    employee={employee}
                    onSelectEmployee={onSelectEmployee}
                    onOpenModal={onOpenModal}
                    onDeleteEmployee={onDeleteEmployee}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3 p-4">
            {employees.map((employee) => {
              const fullName = getEmployeeFullName(employee);
              const statusLabel = getEmployeeStatusLabel(employee);
              const isBlocked = isEmployeeBlocked(employee);

              return (
                <div key={employee.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={fullName} className="w-10 h-10 shrink-0 border border-[var(--border)] text-sm" />
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--text)] truncate">{fullName}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-3)] text-[var(--text)] border border-[var(--border)]">
                          {formatRoleLabel(employee.role)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                      <span className={`text-xs font-medium ${isBlocked ? 'text-red-400' : 'text-emerald-400'}`}>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Contact + date */}
                  <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2 flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-xs text-[var(--text)]">
                      <Mail size={12} className="text-[var(--text-muted)] shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </span>
                    {employee.phone ? (
                      <span className="flex items-center gap-2 text-xs text-[var(--text)]">
                        <Phone size={12} className="text-[var(--text-muted)] shrink-0" />
                        {employee.phone}
                      </span>
                    ) : null}
                    <p className="text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                      {translateMessage('Created')}: {formatEmployeeDate(employee.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectEmployee(employee)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      <Eye size={14} />
                      {translateMessage('View')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenModal(employee)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      <Edit2 size={14} />
                      {translateMessage('Edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
