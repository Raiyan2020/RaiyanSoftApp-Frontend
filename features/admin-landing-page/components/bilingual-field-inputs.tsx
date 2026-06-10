'use client';

import React from 'react';
import type { BilingualField } from '@/features/landing-page';

interface Props {
  label: string;
  value: BilingualField;
  onChange: (val: BilingualField) => void;
  multiline?: boolean;
  required?: boolean;
}

export default function BilingualFieldInputs({ label, value, onChange, multiline = false, required }: Props) {
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
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <input
                type="text"
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                required={required}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
