'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';

interface AdminPageEditorProps {
  slug: PageSlug;
  form: SimplePageForm | AboutUsForm;
  setForm: (value: SimplePageForm | AboutUsForm) => void;
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
  saveError: string | null;
  saveMessage: string | null;
  onSave: () => void;
  onReload: () => void;
  readOnly?: boolean;
  readOnlyMessage?: string;
}

function isAboutForm(form: SimplePageForm | AboutUsForm): form is AboutUsForm {
  return 'caption' in form;
}

export default function AdminPageEditor({
  slug,
  form,
  setForm,
  loading,
  error,
  saveLoading,
  saveError,
  saveMessage,
  onSave,
  onReload,
  readOnly = false,
  readOnlyMessage,
}: AdminPageEditorProps) {
  const updateField = <K extends keyof SimplePageForm>(key: K, value: SimplePageForm[K]) => {
    if (readOnly) return;
    setForm({ ...form, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="me-2 animate-spin" size={20} />
        {translateMessage('Loading page content...')}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-muted)]">
          <ErrorAlert message={error} />
          <button type="button" onClick={onReload} className="ms-3 font-bold underline">
            {translateMessage('Retry')}
          </button>
        </div>
      ) : null}

      {saveError ? <ErrorAlert message={saveError} /> : null}
      <SuccessToast message={saveMessage} />

      {readOnly && readOnlyMessage ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-[var(--text-muted)]">
          {translateMessage(readOnlyMessage)}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Title')}</label>
        <input
          type="text"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          readOnly={readOnly}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary read-only:cursor-not-allowed read-only:opacity-75"
          placeholder={translateMessage('Page title')}
        />
      </div>

      {slug === 'about-us' && isAboutForm(form) ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Caption')}</label>
            <input
              type="text"
              value={form.caption}
              onChange={(event) => {
                if (readOnly) return;
                setForm({ ...form, caption: event.target.value });
              }}
              readOnly={readOnly}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary read-only:cursor-not-allowed read-only:opacity-75"
              placeholder={translateMessage('Short subtitle')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Contact Email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => {
                  if (readOnly) return;
                  setForm({ ...form, email: event.target.value });
                }}
                readOnly={readOnly}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary read-only:cursor-not-allowed read-only:opacity-75"
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Website URL')}</label>
              <input
                type="url"
                value={form.url}
                onChange={(event) => {
                  if (readOnly) return;
                  setForm({ ...form, url: event.target.value });
                }}
                readOnly={readOnly}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary read-only:cursor-not-allowed read-only:opacity-75"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Description')}</label>
        <RichTextEditor
          value={form.description}
          onChange={(value) => updateField('description', value)}
          placeholder={translateMessage('Write page content...')}
          minHeight={280}
          showToolbar
          showBubbleMenu
          disabled={readOnly}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={readOnly || saveLoading}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-primary/20 disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-2">
            {saveLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            {translateMessage(readOnly ? 'Read-only' : saveLoading ? 'Saving...' : 'Save Page')}
          </span>
        </button>
        <button
          type="button"
          onClick={onReload}
          disabled={loading || saveLoading}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface-3)] disabled:opacity-50"
        >
          {translateMessage('Reload')}
        </button>
      </div>
    </div>
  );
}
