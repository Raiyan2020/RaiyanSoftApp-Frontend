import { AdminApiUser } from '../services/admin-users-api';
import { AdminUser } from '../types/admin-user.types';

function parseRegisteredDate(value?: string) {
  if (!value) return Date.now();
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

function splitName(user: AdminApiUser) {
  const fullName = user.full_name?.trim();
  if (!fullName) {
    return {
      firstName: user.first_name || 'Unknown',
      lastName: user.last_name || '',
    };
  }

  const [firstName, ...rest] = fullName.split(/\s+/);
  return {
    firstName: firstName || 'Unknown',
    lastName: rest.join(' '),
  };
}

export function mapAdminApiUser(user: AdminApiUser): AdminUser {
  const { firstName, lastName } = splitName(user);
  const registeredAt = parseRegisteredDate(user.registered);

  return {
    id: String(user.id),
    firstName,
    lastName,
    email: user.email || 'No Email',
    phone: [user.country_code, user.phone].filter(Boolean).join(' ') || user.phone || '',
    role: 'Customer',
    status: user.is_block ? 'Disabled' : 'Active',
    registeredAt,
    lastLoginAt: registeredAt,
    projectsCount: 0,
    userCode: user.user_code,
  };
}
