'use client';

/**
 * TagRepeater — shared component for managing an array of
 * { name: { ar, en }; url: string } rows (bilingual tags with an optional URL).
 *
 * Usage:
 *   <TagRepeater
 *     label={translateMessage('Tags (Proof Points)')}
 *     tags={form.tags}
 *     onChange={(tags) => setForm((p) => ({ ...p, tags }))}
 *     withUrl
 *   />
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

export interface TagRow {
  name: { ar: string; en: string };
  url: string;
}

interface TagRepeaterProps {
  label: string;
  addLabel?: string;
  tags: TagRow[];
  onChange: (tags: TagRow[]) => void;
  withUrl?: boolean;
  errors?: Array<Partial<Record<'ar' | 'en' | 'url', string>> | undefined>;
}

export default function TagRepeater({
  label,
  addLabel,
  tags,
  onChange,
  withUrl = false,
  errors = [],
}: TagRepeaterProps) {
  function addRow() {
    onChange([...tags, { name: { ar: '', en: '' }, url: '' }]);
  }

  function removeRow(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<TagRow>) {
    onChange(tags.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateName(index: number, lang: 'ar' | 'en', value: string) {
    updateRow(index, { name: { ...tags[index].name, [lang]: value } });
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
        >
          <Plus size={12} />
          {addLabel ?? translateMessage('Add Tag')}
        </button>
      </div>

      {tags.length > 0 && (
        <div className="space-y-2">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2.5"
            >
              {/* Arabic */}
              <div className="flex-1">
                <input
                  dir="rtl"
                  type="text"
                  value={tag.name.ar}
                  onChange={(e) => updateName(i, 'ar', e.target.value)}
                  placeholder="عربي"
                  aria-invalid={Boolean(errors[i]?.ar)}
                  className={`w-full rounded-lg border bg-[var(--surface)] px-2.5 py-2 text-sm focus:outline-none ${
                    errors[i]?.ar ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
                  }`}
                />
                {errors[i]?.ar ? <p className="mt-1 text-xs font-medium text-red-400">{errors[i]?.ar}</p> : null}
              </div>
              {/* English */}
              <div className="flex-1">
                <input
                  type="text"
                  value={tag.name.en}
                  onChange={(e) => updateName(i, 'en', e.target.value)}
                  placeholder={translateMessage('English (placeholder)')}
                  aria-invalid={Boolean(errors[i]?.en)}
                  className={`w-full rounded-lg border bg-[var(--surface)] px-2.5 py-2 text-sm focus:outline-none ${
                    errors[i]?.en ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
                  }`}
                />
                {errors[i]?.en ? <p className="mt-1 text-xs font-medium text-red-400">{errors[i]?.en}</p> : null}
              </div>
              {/* Optional URL */}
              {withUrl && (
                <div className="flex-1">
                  <input
                    type="text"
                    value={tag.url}
                    onChange={(e) => updateRow(i, { url: e.target.value })}
                    placeholder={translateMessage('URL (opt.)')}
                    aria-invalid={Boolean(errors[i]?.url)}
                    className={`w-full rounded-lg border bg-[var(--surface)] px-2.5 py-2 text-sm focus:outline-none ${
                      errors[i]?.url ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border)] focus:border-primary'
                    }`}
                  />
                  {errors[i]?.url ? <p className="mt-1 text-xs font-medium text-red-400">{errors[i]?.url}</p> : null}
                </div>
              )}
              {/* Remove */}
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
                aria-label={translateMessage('Delete')}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
