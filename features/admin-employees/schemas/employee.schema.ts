import { z } from 'zod';

export const EMPLOYEE_ROLES = ['super_admin'] as const;

export const getEmployeeSchema = (isEditing: boolean) =>
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    role: z.enum(EMPLOYEE_ROLES, { message: 'Role is required' }),
    password: isEditing
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
  });

export type EmployeeValues = z.infer<ReturnType<typeof getEmployeeSchema>>;
