import { AdminEmployee } from '../types/admin-employee.types';

export function getEmployeeFullName(employee: Pick<AdminEmployee, 'first_name' | 'last_name'>) {
  return [employee.first_name, employee.last_name].filter(Boolean).join(' ').trim();
}

export function isEmployeeBlocked(employee: AdminEmployee) {
  return Boolean(employee.is_blocked ?? employee.blocked);
}

export function getEmployeeStatusLabel(employee: AdminEmployee) {
  return isEmployeeBlocked(employee) ? 'Blocked' : 'Active';
}

export function formatEmployeeDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRoleLabel(role: string) {
  if (!role) return '—';
  return role.charAt(0).toUpperCase() + role.slice(1);
}
