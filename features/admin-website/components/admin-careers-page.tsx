'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import { employmentTypeLabel } from '@/lib/employment-type';
import { adminWebsiteListKeys, useAdminWebsiteList } from '../hooks/use-admin-website-list';
import { jobOpeningsApi } from '../services/website-lists-api';
import { EMPLOYMENT_TYPES, type AdminBilingual, type AdminJobOpening, type AdminJobOpeningPayload, type EmploymentType } from '../types/website-lists';
import { OrderAndActiveFields, requireBilingual, toBilingual } from './list-form-fields';

const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor'), {
  ssr: false,
  loading: () => <Loader />,
});

const EMPTY_FORM: AdminJobOpeningPayload = {
  title: { ar: '', en: '' },
  department: { ar: '', en: '' },
  location: { ar: '', en: '' },
  description: { ar: '', en: '' },
  employment_type: 'full_time',
  apply_url: '',
  sort_order: 0,
  is_active: true,
};

const APPLY_URL_PATTERN = /^(https?:\/\/\S+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/i;
const isBlankHtml = (html: string) => !html.replace(/<[^>]*>|&nbsp;/g, '').trim();

export default function AdminCareersPage() {
  const { language } = useTranslation();
  const { query, create, update, remove, isSaving } = useAdminWebsiteList(adminWebsiteListKeys.jobOpenings, jobOpeningsApi);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminJobOpeningPayload>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const localized = (value: AdminBilingual) => value[language] || value.en || value.ar || '';
  const patch = (next: Partial<AdminJobOpeningPayload>) => setForm((prev) => ({ ...prev, ...next }));

  function open(job: AdminJobOpening | null) {
    setEditingId(job?.id ?? null);
    setForm(
      job
        ? {
            title: toBilingual(job.title),
            department: toBilingual(job.department),
            location: toBilingual(job.location),
            description: toBilingual(job.description),
            employment_type: job.employment_type,
            apply_url: job.apply_url ?? '',
            sort_order: job.sort_order,
            is_active: job.is_active,
          }
        : EMPTY_FORM,
    );
    setFormError('');
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');
    const required = translateMessage('This field is required');
    const nextErrors = requireBilingual({}, form, ['title', 'department', 'location']);
    if (isBlankHtml(form.description.ar)) nextErrors['description.ar'] = required;
    if (isBlankHtml(form.description.en)) nextErrors['description.en'] = required;
    if (form.apply_url.trim() && !APPLY_URL_PATTERN.test(form.apply_url.trim())) {
      nextErrors.apply_url = translateMessage('Use a https:// link or a mailto: address.');
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (editingId) await update.mutateAsync({ id: editingId, payload: form });
      else await create.mutateAsync(form);
      setShowForm(false);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(err instanceof Error ? err.message : translateMessage('Failed to save'));
    }
  }

  return (
    <div className="space-y-6">
      <CrudItemList
        title={translateMessage('Careers')}
        items={query.data ?? []}
        isLoading={query.isLoading}
        emptyLabel={translateMessage('No job openings yet.')}
        addLabel={translateMessage('Add Job')}
        deleteConfirmLabel={translateMessage('Delete this job?')}
        onAdd={() => open(null)}
        onEdit={(job: AdminJobOpening) => open(job)}
        onDelete={(id) => remove.mutateAsync(id).catch(() => undefined)}
        isDeleting={remove.isPending}
        renderItem={(job) => (
          <div className="min-w-0">
            <p className="truncate font-semibold text-[var(--text)]">{localized(job.title)}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {[localized(job.department), localized(job.location), employmentTypeLabel(job.employment_type, language)].filter(Boolean).join(' · ')}
            </p>
            {!job.is_active ? <p className="text-xs font-bold text-warning">{translateMessage('Hidden')}</p> : null}
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editingId ? 'Edit Job' : 'Add Job')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
        maxWidth="max-w-4xl"
      >
        <BilingualFieldInputs label={translateMessage('Job title')} value={form.title} onChange={(title) => patch({ title })} errors={bilingualErrors(errors, 'title')} required />
        <BilingualFieldInputs
          label={translateMessage('Department')}
          value={form.department}
          onChange={(department) => patch({ department })}
          errors={bilingualErrors(errors, 'department')}
          required
        />
        <BilingualFieldInputs label={translateMessage('Location')} value={form.location} onChange={(location) => patch({ location })} errors={bilingualErrors(errors, 'location')} required />
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[var(--text)]">{translateMessage('Employment type')}</p>
          <Select value={form.employment_type} onValueChange={(value) => patch({ employment_type: value as EmploymentType })}>
            <SelectTrigger aria-invalid={Boolean(errors.employment_type)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{employmentTypeLabel(type, language)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employment_type ? <p className="text-xs font-medium text-danger">{errors.employment_type}</p> : null}
        </div>
        {(['ar', 'en'] as const).map((lang) => (
          <RichTextEditor
            key={lang}
            label={`${translateMessage('Description')} (${translateMessage(lang === 'ar' ? 'Arabic' : 'English')})`}
            value={form.description[lang]}
            onChange={(html) => setForm((prev) => ({ ...prev, description: { ...prev.description, [lang]: html } }))}
            error={errors[`description.${lang}`]}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            minHeight={180}
            showToolbar
            showBubbleMenu
          />
        ))}
        <div className="space-y-1">
          <Input
            dir="ltr"
            label={translateMessage('Apply link (optional)')}
            placeholder="https://… or mailto:jobs@example.com"
            value={form.apply_url}
            onChange={(event) => patch({ apply_url: event.target.value })}
            error={errors.apply_url}
          />
          <p className="text-xs text-[var(--text-muted)]">{translateMessage('When set, the careers page shows an Apply button for this job.')}</p>
        </div>
        <OrderAndActiveFields sortOrder={form.sort_order} isActive={form.is_active} onChange={patch} errors={errors} />
      </AdminFormModal>
    </div>
  );
}
