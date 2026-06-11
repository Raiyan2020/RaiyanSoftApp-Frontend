'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useAdminHero, useUpdateAdminHero } from '../hooks/use-admin-landing-page';
import BilingualFieldInputs from './bilingual-field-inputs';
import TagRepeater from '@/components/ui/tag-repeater';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import type { AdminHeroPayload, BilingualField } from '@/features/landing-page';
import { formatLandingButtonUrlForForm } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';
import {
  hasBilingualErrors,
  hasTagErrors,
  validateLandingButtonUrl,
  validateLandingTagUrls,
  validateOptionalAbsoluteUrl,
  validateRequiredBilingual,
  type BilingualFieldErrors,
  type TagRowErrors,
} from './landing-form-validation';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

const DEFAULT_FORM: AdminHeroPayload = {
  title: EMPTY_BI,
  caption: EMPTY_BI,
  description: EMPTY_BI,
  vedio_url: '',
  f_button_text: EMPTY_BI,
  f_button_url: '',
  l_button_text: EMPTY_BI,
  l_button_url: '',
  status: 1,
  tags: [],
};

export default function AdminHeroTab() {
  const { data: heroes, isLoading } = useAdminHero();
  const updateMutation = useUpdateAdminHero();
  const [form, setForm] = useState<AdminHeroPayload>(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    title?: BilingualFieldErrors;
    f_button_url?: string;
    l_button_url?: string;
    vedio_url?: string;
    tags?: TagRowErrors[];
  }>({});
  const [success, setSuccess] = useState(false);

  const hero = heroes?.[0];

  useEffect(() => {
    if (hero) {
      setForm({
        title: hero.title,
        caption: hero.caption,
        description: hero.description,
        vedio_url: hero.vedio_url || '',
        f_button_text: hero.f_button_text,
        f_button_url: formatLandingButtonUrlForForm(hero.f_button_url),
        l_button_text: hero.l_button_text,
        l_button_url: formatLandingButtonUrlForForm(hero.l_button_url),
        status: hero.status ? 1 : 0,
        tags: hero.tags?.map((t) => ({
          name: t.name,
          url: formatLandingButtonUrlForForm(t.url),
        })) ?? [],
      });
    }
  }, [hero]);

  function validateForm() {
    const nextErrors = {
      title: validateRequiredBilingual(form.title),
      f_button_url: validateLandingButtonUrl(form.f_button_url),
      l_button_url: validateLandingButtonUrl(form.l_button_url),
      vedio_url: validateOptionalAbsoluteUrl(form.vedio_url),
      tags: validateLandingTagUrls(form.tags),
    };

    setFieldErrors(nextErrors);

    return !(
      hasBilingualErrors(nextErrors.title) ||
      nextErrors.f_button_url ||
      nextErrors.l_button_url ||
      nextErrors.vedio_url ||
      hasTagErrors(nextErrors.tags)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await updateMutation.mutateAsync(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(translateMessage(err instanceof Error ? err.message : 'Failed to save'));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-[var(--text-muted)]">
        <Loader2 size={18} className="animate-spin" />
        {translateMessage('Loading...')}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <h2 className="text-lg font-bold text-[var(--text)]">{translateMessage('Hero Section')}</h2>

      <BilingualFieldInputs label={translateMessage('Title')} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} errors={fieldErrors.title} required />
      <BilingualFieldInputs label={translateMessage('Caption / Badge')} value={form.caption} onChange={(v) => setForm((p) => ({ ...p, caption: v }))} />
      <BilingualFieldInputs label={translateMessage('Description')} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} multiline />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Primary Button Text')}</label>
          <div className="grid grid-cols-2 gap-2">
            <input dir="rtl" type="text" value={form.f_button_text.ar} onChange={(e) => setForm((p) => ({ ...p, f_button_text: { ...p.f_button_text, ar: e.target.value } }))} placeholder="عربي" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-primary focus:outline-none" />
            <input type="text" value={form.f_button_text.en} onChange={(e) => setForm((p) => ({ ...p, f_button_text: { ...p.f_button_text, en: e.target.value } }))} placeholder={translateMessage('English (placeholder)')} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Primary Button URL')}</label>
          <input
            type="text"
            value={form.f_button_url}
            onChange={(e) => setForm((p) => ({ ...p, f_button_url: e.target.value }))}
            placeholder="#contact"
            aria-invalid={Boolean(fieldErrors.f_button_url)}
            className={`w-full rounded-xl border bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none ${
              fieldErrors.f_button_url ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
            }`}
          />
          {fieldErrors.f_button_url ? <p className="mt-1 text-xs font-medium text-red-400">{fieldErrors.f_button_url}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Secondary Button Text')}</label>
          <div className="grid grid-cols-2 gap-2">
            <input dir="rtl" type="text" value={form.l_button_text.ar} onChange={(e) => setForm((p) => ({ ...p, l_button_text: { ...p.l_button_text, ar: e.target.value } }))} placeholder="عربي" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-primary focus:outline-none" />
            <input type="text" value={form.l_button_text.en} onChange={(e) => setForm((p) => ({ ...p, l_button_text: { ...p.l_button_text, en: e.target.value } }))} placeholder={translateMessage('English (placeholder)')} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Secondary Button URL')}</label>
          <input
            type="text"
            value={form.l_button_url}
            onChange={(e) => setForm((p) => ({ ...p, l_button_url: e.target.value }))}
            placeholder="#works"
            aria-invalid={Boolean(fieldErrors.l_button_url)}
            className={`w-full rounded-xl border bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none ${
              fieldErrors.l_button_url ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
            }`}
          />
          {fieldErrors.l_button_url ? <p className="mt-1 text-xs font-medium text-red-400">{fieldErrors.l_button_url}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Video URL (YouTube)')}</label>
        <input
          type="url"
          value={form.vedio_url}
          onChange={(e) => setForm((p) => ({ ...p, vedio_url: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-invalid={Boolean(fieldErrors.vedio_url)}
          className={`w-full rounded-xl border bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none ${
            fieldErrors.vedio_url ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
          }`}
        />
        {fieldErrors.vedio_url ? <p className="mt-1 text-xs font-medium text-red-400">{fieldErrors.vedio_url}</p> : null}
      </div>

      {/* Tags — shared TagRepeater */}
      <TagRepeater
        label={translateMessage('Tags (Proof Points)')}
        addLabel={translateMessage('Add Tag')}
        tags={form.tags}
        onChange={(tags) => setForm((p) => ({ ...p, tags }))}
        withUrl
        errors={fieldErrors.tags}
      />

      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <input type="checkbox" checked={form.status === 1} onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? 1 : 0 }))} className="h-4 w-4 rounded accent-primary" />
          {translateMessage('Active / Visible')}
        </label>
      </div>

      <ErrorAlert message={error} />
      <SuccessToast message={success ? 'Saved successfully!' : null} />

      <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50">
        {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {translateMessage('Save Hero')}
      </button>
    </form>
  );
}
