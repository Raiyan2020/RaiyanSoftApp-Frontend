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
  projectsCount: number;
  userCode?: string;
};
