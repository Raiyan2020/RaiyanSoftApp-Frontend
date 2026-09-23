import { z } from 'zod';
import { optionalPhoneSchema } from '@/lib/phone';

export const EMPLOYEE_ROLES = ['super_admin'] as const;

export const getEmployeeSchema = (isEditing: boolean) =>
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: optionalPhoneSchema,
    role: z.enum(EMPLOYEE_ROLES, { message: 'Role is required' }),
    password: isEditing
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
  });

export type EmployeeValues = z.infer<ReturnType<typeof getEmployeeSchema>>;
