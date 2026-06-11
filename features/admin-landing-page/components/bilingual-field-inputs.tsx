'use client';

import React from 'react';
import type { BilingualField } from '@/features/landing-page';

interface Props {
  label: string;
  value: BilingualField;
  onChange: (val: BilingualField) => void;
  multiline?: boolean;
  required?: boolean;
  errors?: Partial<Record<keyof BilingualField, string>>;
}

export default function BilingualFieldInputs({ label, value, onChange, multiline = false, required, errors }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-[var(--text)]">{label}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(['ar', 'en'] as const).map((lang) => (
          <div key={lang}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {lang === 'ar' ? 'Arabic (عربي)' : 'English'}
            </label>
            {multiline ? (
              <textarea
                rows={3}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                required={required}
                aria-invalid={Boolean(errors?.[lang])}
                className={`w-full rounded-xl border bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ${
                  errors?.[lang]
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/15'
                    : 'border-[var(--border)] focus:border-primary focus:ring-primary/20'
                }`}
              />
            ) : (
              <input
                type="text"
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                required={required}
                aria-invalid={Boolean(errors?.[lang])}
                className={`w-full rounded-xl border bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ${
                  errors?.[lang]
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/15'
                    : 'border-[var(--border)] focus:border-primary focus:ring-primary/20'
                }`}
              />
            )}
            {errors?.[lang] ? (
              <p className="mt-1 text-xs font-medium text-red-400">{errors[lang]}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
