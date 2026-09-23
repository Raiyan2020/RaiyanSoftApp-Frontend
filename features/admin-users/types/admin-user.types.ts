export type AdminUserStatus = 'Active' | 'Disabled';

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Admin';
  status: AdminUserStatus;
  registeredAt: number;
  lastLoginAt: number;
  /** null = unknown (API didn't send projects_count); never render it as 0. */
  projectsCount: number | null;
  userCode?: string;
};
