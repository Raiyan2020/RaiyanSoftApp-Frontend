import React, { useEffect } from 'react';
import { User, Mail, Lock, Loader2, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminProfileSchema, AdminProfileValues } from '../schemas/profile.schema';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import Input from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import PhoneInput from '@/components/ui/phone-input';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';
import { formatRoleLabel } from '@/features/admin-employees/utils/employee-helpers';

interface AdminProfileFormProps {
  defaultValues: AdminProfileValues & { role?: string };
  onSave: (data: AdminProfileValues) => Promise<void>;
  isSaving: boolean;
  success: boolean;
}

export default function AdminProfileForm({
  defaultValues,
  onSave,
  isSaving,
  success,
}: AdminProfileFormProps) {
  const form = useForm<AdminProfileValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const watchedFirstName = form.watch('firstName');
  const watchedLastName = form.watch('lastName');

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl relative overflow-hidden w-full">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center space-y-3 w-full md:w-auto">
          <div className="w-24 h-24 rounded-full border-4 border-[var(--border)] shadow-2xl relative">
            <Avatar 
              name={`${watchedFirstName || ''} ${watchedLastName || ''}`.trim() || translateMessage('Admin')} 
              size="xl" 
              className="w-full h-full text-3xl" 
            />
            <div className="absolute bottom-0 end-0 bg-[var(--surface-3)] rounded-full p-1 border border-[var(--border)]">
              <div className="bg-emerald-500 w-4 h-4 rounded-full border-2 border-[var(--border)]" title={translateMessage('Active')} />
            </div>
          </div>
          <div className="text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
              {defaultValues.role ? translateMessage(formatRoleLabel(defaultValues.role)) : translateMessage('Admin')}
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSave)} className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="uppercase tracking-wider font-bold">{translateMessage('First Name')}</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    icon={<User size={18} />}
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? 'border-danger' : ''}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="uppercase tracking-wider font-bold">{translateMessage('Last Name')}</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    icon={<User size={18} />}
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? 'border-danger' : ''}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="uppercase tracking-wider font-bold">{translateMessage('Phone Number')}</FieldLabel>
                <PhoneInput value={field.value || ''} onChange={(value) => field.onChange(value || '')} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="uppercase tracking-wider font-bold">{translateMessage('Email Address')}</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  icon={<Mail size={18} />}
                  aria-invalid={fieldState.invalid}
                  className={fieldState.invalid ? 'border-danger' : ''}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="uppercase tracking-wider font-bold">
                  {translateMessage('New Password')}
                  <span className="ms-1 text-[var(--text-muted)] normal-case font-normal">({translateMessage('leave blank to keep current')})</span>
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  aria-invalid={fieldState.invalid}
                  className={fieldState.invalid ? 'border-danger' : ''}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <SuccessToast message={success ? 'Saved Successfully' : null} />

          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary-dark text-on-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{translateMessage('Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
