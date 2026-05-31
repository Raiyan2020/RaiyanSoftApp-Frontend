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
      <label htmlFor={id} className="block text-sm font-black text-slate-800 dark:text-slate-100">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-bold text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const publicInputClass =
  'w-full rounded-lg border border-cyan-950/10 bg-white px-4 py-3 text-slate-950 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white';

export function PublicFormStatus({ type, message }: { type: 'success' | 'error' | 'loading'; message: string }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200',
    loading: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200',
  };

  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm font-bold ${styles[type]}`}>
      {message}
    </div>
  );
}

