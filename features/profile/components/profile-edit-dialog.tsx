'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Loader2, Mail, Save, User as UserIcon, X } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { User } from '@/lib/auth-service';
import { getUserProfilePhoneValue } from '../hooks/use-user-profile';
import { userProfileSchema, type UserProfileValues } from '../schemas/profile.schema';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';

interface ProfileEditDialogProps {
  isOpen: boolean;
  user: User | null;
  isSaving: boolean;
  error?: string | null;
  success?: boolean;
  onClose: () => void;
  onSubmit: (values: UserProfileValues) => Promise<void>;
}

export default function ProfileEditDialog({
  isOpen,
  user,
  isSaving,
  error,
  success,
  onClose,
  onSubmit,
}: ProfileEditDialogProps) {
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!user || !isOpen) return;
    const nameParts = (user.full_name || user.name || '').trim().split(/\s+/).filter(Boolean);

    form.reset({
      firstName: user.first_name || nameParts[0] || '',
      lastName: user.last_name || nameParts.slice(1).join(' ') || '',
      email: user.email || '',
      phone: getUserProfilePhoneValue(user),
    });
  }, [form, isOpen, user]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{translateMessage('Profile')}</p>
                <h2 className="mt-1 text-xl font-black text-[var(--text)]">{translateMessage('Update profile')}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                aria-label={translateMessage('Close profile form')}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="First name"
                      icon={<UserIcon size={16} />}
                      error={fieldState.error?.message}
                      autoComplete="given-name"
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Last name"
                      icon={<UserIcon size={16} />}
                      error={fieldState.error?.message}
                      autoComplete="family-name"
                    />
                  )}
                />
              </div>

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Email"
                    icon={<Mail size={16} />}
                    error={fieldState.error?.message}
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone number</FieldLabel>
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      autoComplete="tel"
                      required
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {error ? (
                <ErrorAlert message={error} />
              ) : null}
              <SuccessToast message={success ? 'Profile updated successfully.' : null} />

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                  {translateMessage('Save profile')}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
