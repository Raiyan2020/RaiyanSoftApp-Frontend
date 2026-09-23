'use client';

import React from 'react';
import type { BilingualField } from '@/features/landing-page';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { translateMessage } from '@/lib/i18n-utils';

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
        {(['ar', 'en'] as const).map((lang) => {
          const fieldProps = {
            label: lang === 'ar' ? translateMessage('Arabic') : translateMessage('English'),
            value: value[lang],
            dir: lang === 'ar' ? 'rtl' : 'ltr',
            required,
            error: errors?.[lang],
          };
          return multiline ? (
            <Textarea
              key={lang}
              rows={3}
              {...fieldProps}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            />
          ) : (
            <Input
              key={lang}
              type="text"
              {...fieldProps}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            />
          );
        })}
      </div>
    </div>
  );
}
