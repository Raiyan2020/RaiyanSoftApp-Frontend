"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Archive, Copy, ExternalLink, Plus, Search, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import { getWebsiteContentConfig } from '../config/website-content-config';
import { useAdminWebsiteContent } from '../hooks/use-admin-website-content';
import type { WebsiteContentField, WebsiteContentItem, WebsiteContentSection, WebsiteContentStatus } from '../types/website-content';

const statusStyles: Record<WebsiteContentStatus, string> = {
  draft: 'bg-slate-500/10 text-[var(--text)] border-slate-500/20',
  published: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  archived: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
};

const listToTextarea = (value: any) => (Array.isArray(value) ? value.join('\n') : '');
const textareaToList = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: WebsiteContentField;
  value: any;
  onChange: (value: any) => void;
}) {
  const baseClass = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-primary/60';

  if (field.type === 'textarea' || field.type === 'list') {
    return (
      <textarea
        className={`${baseClass} min-h-28 resize-y`}
        value={field.type === 'list' ? listToTextarea(value) : value || ''}
        onChange={(event) => onChange(field.type === 'list' ? textareaToList(event.target.value) : event.target.value)}
        placeholder={translateMessage(field.placeholder || (field.type === 'list' ? 'One item per line' : ''))}
      />
    );
  }

  if (field.type === 'toggle') {
    return (
      <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-primary" />
        {translateMessage('Enabled')}
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <select className={baseClass} value={value || ''} onChange={(event) => onChange(event.target.value)}>
        <option value="">{translateMessage('Select')}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {translateMessage(option.label)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className={baseClass}
      type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
      value={value || ''}
      onChange={(event) => onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)}
      placeholder={translateMessage(field.placeholder || '')}
    />
  );
}

function getPreviewHref(section: WebsiteContentSection, item: WebsiteContentItem | null) {
  if (!item) return '/';
  if (section === 'services' && item.slug) return `/services/${item.slug}`;
  if (section === 'apps' && item.slug) return `/portfolio/${item.slug}`;
  if (section === 'blog' && item.slug) return `/blog/${item.slug}`;
  if (section === 'legal' && item.slug === 'privacy') return '/privacy';
  if (section === 'legal' && item.slug === 'terms') return '/terms';

  const indexPages: Partial<Record<WebsiteContentSection, string>> = {
    homepage: '/',
    services: '/services',
    apps: '/portfolio',
    blog: '/blog',
    faqs: '/faq',
    pricing: '/pricing',
    testimonials: '/testimonials',
    partners: '/partners',
    team: '/team',
    careers: '/careers',
    settings: '/',
    steps: '/',
  };

  return indexPages[section] || '/';
}

export default function AdminWebsiteSectionPage({ section }: { section: WebsiteContentSection }) {
  const config = getWebsiteContentConfig(section);
  const isSingleton = Boolean(config.singleton);
  const [pendingDelete, setPendingDelete] = useState<WebsiteContentItem | null>(null);
  const manager = useAdminWebsiteContent(config);

  const counts = useMemo(
    () => ({
      all: manager.items.length,
      published: manager.items.filter((item) => item.status === 'published').length,
      draft: manager.items.filter((item) => item.status === 'draft').length,
      archived: manager.items.filter((item) => item.status === 'archived').length,
    }),
    [manager.items]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/admin/website" className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
            {translateMessage('Website CMS')}
          </Link>
          <h1 className="mt-2 text-3xl font-black text-[var(--text)]">{translateMessage(config.label)}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{translateMessage(config.description)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!isSingleton ? (
            <Button type="button" variant="outline" onClick={manager.createNew}>
              <Plus className="me-2" size={16} /> {translateMessage('New')} {translateMessage(config.singularLabel)}
            </Button>
          ) : null}
          <Link href={getPreviewHref(section, manager.selected)} target="_blank" className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-3)] px-5 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface-3)]">
            <ExternalLink className="me-2" size={16} /> {translateMessage('Preview')}
          </Link>
        </div>
      </div>

      {manager.error ? <ErrorAlert message={manager.error} /> : null}

      <div className="grid gap-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-6 flex flex-col gap-3 border-b border-[var(--border)] pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--text)]">{isSingleton ? translateMessage(config.singularLabel) : manager.selected ? `${translateMessage('Edit')} ${translateMessage(config.singularLabel)}` : `${translateMessage('New')} ${translateMessage(config.singularLabel)}`}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{translateMessage(isSingleton ? 'Update the global content for this section and publish when ready.' : 'Save as draft first, then publish when content and SEO are ready.')}</p>
            </div>
            {manager.selected && !isSingleton ? (
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => manager.duplicateItem(manager.selected!)}>
                  <Copy size={15} className="me-2" /> {translateMessage('Duplicate')}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => manager.save('archived')} isLoading={manager.isSaving}>
                  <Archive size={15} className="me-2" /> {translateMessage('Archive')}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(manager.selected)}>
                  <Trash2 size={15} className="me-2" /> {translateMessage('Delete')}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Title')} *</span>
              <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.title} onChange={(event) => manager.updateField('title', event.target.value)} />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Slug')} {config.requiresSlug ? '*' : ''}</span>
              <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.slug} onChange={(event) => manager.updateField('slug', event.target.value)} placeholder="url-friendly-slug" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Order')}</span>
              <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" type="number" value={manager.form.order} onChange={(event) => manager.updateField('order', event.target.value)} />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Locale')}</span>
              <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.locale} onChange={(event) => manager.updateField('locale', event.target.value)}>
                <option value="ar">{translateMessage('Arabic')}</option>
                <option value="en">{translateMessage('English')}</option>
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-5">
            {config.fields.map((field) => (
              <label key={field.key} className="space-y-2">
                <span className="text-sm font-bold text-[var(--text)]">
                  {translateMessage(field.label)} {field.required ? '*' : ''}
                </span>
                <FieldControl field={field} value={manager.form.data[field.key]} onChange={(value) => manager.updateDataField(field.key, value)} />
                {field.description ? <span className="block text-xs text-[var(--text-muted)]">{translateMessage(field.description)}</span> : null}
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text)]">{translateMessage('SEO')}</h3>
            <div className="mt-4 grid gap-5">
              <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.seoTitle} onChange={(event) => manager.updateField('seoTitle', event.target.value)} placeholder={translateMessage('SEO title')} />
              <textarea className="min-h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.seoDescription} onChange={(event) => manager.updateField('seoDescription', event.target.value)} placeholder={translateMessage('SEO description')} />
              <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={manager.form.ogImage} onChange={(event) => manager.updateField('ogImage', event.target.value)} placeholder={translateMessage('Open Graph image URL')} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text)]">
              <input type="checkbox" checked={manager.form.featured} onChange={(event) => manager.updateField('featured', event.target.checked)} className="h-4 w-4 accent-primary" />
              {translateMessage('Featured')}
            </label>
            {config.requiresApproval ? (
              <>
                <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                  <input type="checkbox" checked={manager.form.approvedForPublic} onChange={(event) => manager.updateField('approvedForPublic', event.target.checked)} className="h-4 w-4 accent-primary" />
                  {translateMessage('Approved for public')}
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                  <input type="checkbox" checked={manager.form.clientApproved} onChange={(event) => manager.updateField('clientApproved', event.target.checked)} className="h-4 w-4 accent-primary" />
                  {translateMessage('Client approved')}
                </label>
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-5">
            <Button type="button" variant="outline" onClick={() => manager.save('draft')} isLoading={manager.isSaving}>
              {translateMessage('Save Draft')}
            </Button>
            <Button type="button" onClick={() => manager.save('published')} isLoading={manager.isSaving}>
              {translateMessage('Publish')}
            </Button>
          </div>
        </section>

        {!isSingleton ? (
          <section className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-[var(--text)]">{translateMessage('Existing')} {translateMessage(config.label)}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{translateMessage('Search, filter, and select an existing item when you need to edit published or draft content.')}</p>
              </div>
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  value={manager.query}
                  onChange={(event) => manager.setQuery(event.target.value)}
                  placeholder={`${translateMessage('Search')} ${translateMessage(config.label).toLowerCase()}...`}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pe-4 ps-11 text-sm text-[var(--text)] outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <div className="grid gap-2 text-center text-xs sm:grid-cols-4">
              {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => manager.setStatusFilter(status)}
                  className={`rounded-xl border px-2 py-3 font-bold capitalize transition ${
                    manager.statusFilter === status ? 'border-primary/50 bg-primary/10 text-primary' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {translateMessage(status)}
                  <span className="mt-1 block text-[var(--text)]">{counts[status]}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {manager.isLoading ? <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">{translateMessage('Loading content...')}</p> : null}
              {!manager.isLoading && manager.filteredItems.length === 0 ? (
                <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">{translateMessage('No content found. Create the first item to start managing this section.')}</p>
              ) : null}
              {manager.filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => manager.editItem(item)}
                  className={`rounded-2xl border p-4 text-start transition ${
                    manager.selected?.id === item.id ? 'border-primary/50 bg-primary/10' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-[var(--text)]">{item.title}</h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{item.slug || item.id}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${statusStyles[item.status]}`}>{translateMessage(item.status)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title={`${translateMessage('Delete')} ${translateMessage(config.singularLabel)}`}
        message={`${translateMessage('This will permanently delete')} "${pendingDelete?.title || translateMessage('this item')}" ${translateMessage('from')} ${translateMessage(config.label)}. ${translateMessage('This cannot be undone.')}`}
        confirmText={translateMessage('Delete')}
        isDestructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const ok = await manager.remove(pendingDelete);
          if (ok) setPendingDelete(null);
        }}
      />
    </div>
  );
}
