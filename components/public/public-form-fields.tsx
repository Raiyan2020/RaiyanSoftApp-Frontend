import { translateMessage } from '@/lib/i18n-utils';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function PublicField({ id, label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-[var(--text)]">
        {translateMessage(label)}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-bold text-danger">
          {translateMessage(error)}
        </p>
      ) : null}
    </div>
  );
}

export const publicInputClass =
  // Same surface as the shared Input/PhoneInput (`app-input`) so mixed fields match.
  'w-full app-input rounded-xl min-h-11 px-4 py-2.5 transition-colors focus:border-primary focus:outline-none rtl:placeholder-shown:[direction:rtl]';

export function PublicFormStatus({ type, message }: { type: 'success' | 'error' | 'loading'; message: string }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200',
    loading: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200',
  };

  return (
    <div role="status" className={`rounded-xl border px-4 py-3 text-sm font-bold ${styles[type]}`}>
      {translateMessage(message)}
    </div>
  );
}
