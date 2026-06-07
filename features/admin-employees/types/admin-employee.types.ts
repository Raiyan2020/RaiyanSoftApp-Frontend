export type EmployeeRole = 'staff' | 'admin' | string;

export type AdminEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: EmployeeRole;
  is_blocked?: boolean;
  blocked?: boolean;
  created_at?: string;
};

export type CreateEmployeePayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role: EmployeeRole;
};

export type UpdateEmployeePayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: EmployeeRole;
};
