'use client';

import Input from '@/components/ui/input';
import type { BilingualField } from '@/features/landing-page';
import type { FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import type { AdminBilingual } from '../types/website-lists';

/** Admin API map -> complete form value. */
export function toBilingual(value?: AdminBilingual | null): BilingualField {
  return { ar: value?.ar ?? '', en: value?.en ?? '' };
}

/** Adds `key.ar` / `key.en` required errors for every blank bilingual field listed. */
export function requireBilingual<F, K extends keyof F & string>(errors: FieldErrors, form: F, keys: K[]): FieldErrors {
  const message = translateMessage('This field is required');
  for (const key of keys) {
    const value = form[key] as unknown as BilingualField;
    if (!value.ar.trim()) errors[`${key}.ar`] = message;
    if (!value.en.trim()) errors[`${key}.en`] = message;
  }
  return errors;
}

interface OrderAndActiveFieldsProps {
  sortOrder: number;
  isActive: boolean;
  onChange: (patch: { sort_order?: number; is_active?: boolean }) => void;
  errors: FieldErrors;
}

/** Shared "Order" + "Active" controls; inactive rows stay in the dashboard but are hidden publicly. */
export function OrderAndActiveFields({ sortOrder, isActive, onChange, errors }: OrderAndActiveFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        type="number"
        min={0}
        label={translateMessage('Order')}
        value={sortOrder}
        onChange={(event) => onChange({ sort_order: Math.max(0, Number(event.target.value) || 0) })}
        error={errors.sort_order}
      />
      <label className="flex items-center gap-2 self-end pb-3 text-sm font-bold text-[var(--text)]">
        <input type="checkbox" checked={isActive} onChange={(event) => onChange({ is_active: event.target.checked })} />
        {translateMessage('Visible on the website')}
      </label>
    </div>
  );
}
