import { AdminEmployee } from '../types/admin-employee.types';

type EmployeeNameLike = Pick<AdminEmployee, 'first_name' | 'last_name'> & {
  full_name?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: number | string;
};

export function getEmployeeFullName(employee: EmployeeNameLike) {
  const directName = [employee.full_name, employee.name].find((value) => value && value.trim());
  if (directName) return directName.trim();

  const splitName = [employee.first_name || employee.firstName, employee.last_name || employee.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  if (splitName) return splitName;

  if (employee.email) return employee.email;
  if (employee.id !== undefined && employee.id !== null) return `Employee ${employee.id}`;
  return 'Unassigned';
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
  return role
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
