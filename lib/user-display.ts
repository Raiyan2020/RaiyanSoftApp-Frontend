import type { User } from './auth-service';

export function getUserDisplayName(user: User | null | undefined, fallback = 'User') {
  if (!user) return fallback;

  const fullName = user.full_name || user.name;
  if (fullName?.trim()) return fullName.trim();

  const composedName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (composedName) return composedName;

  return user.phone || user.email || fallback;
}
