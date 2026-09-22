import React from 'react';
import { Lock, Mail, ArrowRight, Loader2, Zap } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { useAdminLogin } from '../hooks/use-admin-login';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, AdminLoginValues } from '../schemas/admin-login.schema';
import { Field, FieldLabel, FieldError, PasswordInput } from '@/components/ui/field';
import AdminLoginRedirect from './admin-login-redirect';
import { translateMessage } from '@/lib/i18n-utils';

export default function AdminLoginPage() {
  const {
    error,
    isLoading,
    isBootstrapping,
    bootstrapMessage,
    handleLogin,
    handleBootstrap,
  } = useAdminLogin();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] relative overflow-hidden">
      <AdminLoginRedirect />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -start-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      </div>

      <div className="w-full max-w-xl p-6 relative z-10 sm:max-w-2xl">
        <div className="bg-[var(--surface)] backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center border border-[var(--border)] mb-4 shadow-lg">
              <SafeImage
                src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
                className="w-10 h-10 object-contain"
                alt={translateMessage('Raiyansoft Logo')}
              />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Admin Access')}</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">{translateMessage('Sign in to dashboard')}</p>
          </div>

          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{translateMessage('Email Address')}</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                      {...field}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? 'admin-login-email-error' : undefined}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-3 ps-10 pe-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="name@raiyansoft.com"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError id="admin-login-email-error" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{translateMessage('Password')}</FieldLabel>
                  <PasswordInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? 'admin-login-password-error' : undefined}
                    icon={<Lock size={18} />}
                    placeholder="••••••"
                  />
                  {fieldState.invalid && (
                    <FieldError id="admin-login-password-error" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />


            <ErrorAlert message={error} />
            <SuccessToast message={bootstrapMessage} />

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-on-primary shadow-sm shadow-primary/25 transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {/* The pending state used to replace the label with a bare
                  spinner, so the button lost the only text saying what it was
                  doing. */}
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  <span>{translateMessage('Signing in...')}</span>
                </>
              ) : (
                <>
                  <span>{translateMessage('Sign In')}</span>
                  <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest">{translateMessage('Secured Area • Raiyansoft® Admin')}</p>

            <button
              type="button"
              onClick={async () => {
                const values = await handleBootstrap();
                if (values) {
                  form.setValue('email', values.email);
                  form.setValue('password', values.password);
                }
              }}
              disabled={isBootstrapping}
              className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-muted)] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              {isBootstrapping ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
              {translateMessage('Initialize / Recover Super Admin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
