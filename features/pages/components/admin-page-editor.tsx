'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';

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
}: AdminPageEditorProps) {
  const updateField = <K extends keyof SimplePageForm>(key: K, value: SimplePageForm[K]) => {
    setForm({ ...form, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="me-2 animate-spin" size={20} />
        Loading page content...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
          <button type="button" onClick={onReload} className="ms-3 font-bold underline">
            Retry
          </button>
        </div>
      ) : null}

      {saveError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{saveError}</div>
      ) : null}

      {saveMessage ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">{saveMessage}</div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-muted)]">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary"
          placeholder="Page title"
        />
      </div>

      {slug === 'about-us' && isAboutForm(form) ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)]">Caption</label>
            <input
              type="text"
              value={form.caption}
              onChange={(event) => setForm({ ...form, caption: event.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary"
              placeholder="Short subtitle"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">Contact Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary"
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">Website URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(event) => setForm({ ...form, url: event.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none focus:border-primary"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-muted)]">Description</label>
        <RichTextEditor
          value={form.description}
          onChange={(value) => updateField('description', value)}
          placeholder="Write page content..."
          minHeight={280}
          showToolbar
          showBubbleMenu
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saveLoading}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-primary/20 disabled:opacity-50"
        >
          {saveLoading ? 'Saving...' : 'Save Page'}
        </button>
        <button
          type="button"
          onClick={onReload}
          disabled={loading || saveLoading}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface-3)] disabled:opacity-50"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
