import React from 'react';
import { Briefcase } from 'lucide-react';
import { AdminEmployee } from '../types/admin-employee.types';
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
          <p>No employees found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="p-5 font-medium">Name</th>
                  <th className="p-5 font-medium">Contact</th>
                  <th className="p-5 font-medium">Role</th>
                  <th className="p-5 font-medium">Status</th>
                  <th className="p-5 font-medium">Created</th>
                  <th className="p-5 font-medium text-right">Actions</th>
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

          <div className="md:hidden divide-y divide-[var(--border)]">
            {employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                onSelectEmployee={onSelectEmployee}
                onOpenModal={onOpenModal}
                onDeleteEmployee={onDeleteEmployee}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
