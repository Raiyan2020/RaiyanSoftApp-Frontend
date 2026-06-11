'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import BilingualFieldInputs from './bilingual-field-inputs';
import ErrorAlert from '@/components/ui/error-alert';
import { globalToast } from '@/lib/toast-context';
import type { AdminSectionHeaderItem, AdminSectionHeaderPayload, BilingualField } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';
import {
  hasBilingualErrors,
  validateRequiredBilingual,
  type BilingualFieldErrors,
} from './landing-form-validation';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

interface Props {
  header: AdminSectionHeaderItem | null | undefined;
  loading: boolean;
  onSave: (payload: AdminSectionHeaderPayload) => Promise<void>;
}

export default function SectionHeaderForm({ header, loading, onSave }: Props) {
  const [title, setTitle] = useState<BilingualField>(EMPTY_BI);
  const [caption, setCaption] = useState<BilingualField>(EMPTY_BI);
  const [description, setDescription] = useState<BilingualField>(EMPTY_BI);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    title?: BilingualFieldErrors;
    caption?: BilingualFieldErrors;
    description?: BilingualFieldErrors;
  }>({});

  useEffect(() => {
    if (header) {
      setTitle(header.title);
      setCaption(header.caption);
      setDescription(header.description);
    }
  }, [header]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const nextFieldErrors = {
      title: validateRequiredBilingual(title),
      caption: validateRequiredBilingual(caption),
      description: validateRequiredBilingual(description),
    };

    setFieldErrors(nextFieldErrors);

    if (
      hasBilingualErrors(nextFieldErrors.title) ||
      hasBilingualErrors(nextFieldErrors.caption) ||
      hasBilingualErrors(nextFieldErrors.description)
    ) {
      return;
    }

    try {
      setSaving(true);
      await onSave({ title, caption, description });
      globalToast.success(translateMessage('Saved Successfully'));
    } catch (err: unknown) {
      setError(translateMessage(err instanceof Error ? err.message : 'Failed to save'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 size={16} className="animate-spin" />
        {translateMessage('Loading...')}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-bold text-[var(--text)]">{translateMessage('Section Header')}</h3>

      <BilingualFieldInputs label={translateMessage('Title')} value={title} onChange={setTitle} errors={fieldErrors.title} required />
      <BilingualFieldInputs label={translateMessage('Caption / Badge')} value={caption} onChange={setCaption} errors={fieldErrors.caption} required />
      <BilingualFieldInputs label={translateMessage('Description')} value={description} onChange={setDescription} errors={fieldErrors.description} multiline required />

      <ErrorAlert message={error} />

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {translateMessage(saving ? 'Saving...' : 'Save Header')}
      </button>
    </form>
  );
}
