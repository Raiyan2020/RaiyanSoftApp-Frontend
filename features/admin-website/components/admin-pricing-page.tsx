'use client';

import { useState } from 'react';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import TagRepeater from '@/components/ui/tag-repeater';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import { adminWebsiteListKeys, useAdminWebsiteList } from '../hooks/use-admin-website-list';
import { pricingPlansApi } from '../services/website-lists-api';
import type { AdminBilingual, AdminPricingPlan, AdminPricingPlanPayload } from '../types/website-lists';
import { OrderAndActiveFields, requireBilingual, toBilingual } from './list-form-fields';

const EMPTY_FORM: AdminPricingPlanPayload = {
  name: { ar: '', en: '' },
  description: { ar: '', en: '' },
  price_label: { ar: '', en: '' },
  features: [{ ar: '', en: '' }],
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

/** Stored {ar: [], en: []} -> paired rows (shorter list padded with blanks). */
function featuresToRows(features: AdminPricingPlan['features']) {
  const ar = features.ar ?? [];
  const en = features.en ?? [];
  return Array.from({ length: Math.max(ar.length, en.length, 1) }, (_, i) => ({ ar: ar[i] ?? '', en: en[i] ?? '' }));
}

export default function AdminPricingPage() {
  const { language } = useTranslation();
  const { query, create, update, remove, isSaving } = useAdminWebsiteList(adminWebsiteListKeys.pricingPlans, pricingPlansApi);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminPricingPlanPayload>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const localized = (value: AdminBilingual) => value[language] || value.en || value.ar || '';
  const patch = (next: Partial<AdminPricingPlanPayload>) => setForm((prev) => ({ ...prev, ...next }));

  function open(plan: AdminPricingPlan | null) {
    setEditingId(plan?.id ?? null);
    setForm(
      plan
        ? {
            name: toBilingual(plan.name),
            description: toBilingual(plan.description),
            price_label: toBilingual(plan.price_label),
            features: featuresToRows(plan.features),
            is_featured: plan.is_featured,
            sort_order: plan.sort_order,
            is_active: plan.is_active,
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
    const nextErrors = requireBilingual({}, form, ['name', 'description']);
    form.features.forEach((row, index) => {
      if (!row.ar.trim()) nextErrors[`features.ar.${index}`] = required;
      if (!row.en.trim()) nextErrors[`features.en.${index}`] = required;
    });
    if (form.features.length === 0) nextErrors.features = translateMessage('Add at least one feature.');
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

  const featureErrors = form.features.map((_, index) => ({
    ar: errors[`features.ar.${index}`],
    en: errors[`features.en.${index}`],
  }));
  const featuresListError = errors.features ?? errors['features.ar'] ?? errors['features.en'];

  return (
    <div className="space-y-6">
      <CrudItemList
        title={translateMessage('Pricing')}
        items={query.data ?? []}
        isLoading={query.isLoading}
        emptyLabel={translateMessage('No pricing packages yet.')}
        addLabel={translateMessage('Add Package')}
        deleteConfirmLabel={translateMessage('Delete this package?')}
        onAdd={() => open(null)}
        onEdit={(plan: AdminPricingPlan) => open(plan)}
        onDelete={(id) => remove.mutateAsync(id).catch(() => undefined)}
        isDeleting={remove.isPending}
        renderItem={(plan) => (
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text)]">
              {localized(plan.name)}
              {localized(plan.price_label) ? <span className="ms-2 text-sm font-bold text-primary">{localized(plan.price_label)}</span> : null}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">{localized(plan.description)}</p>
            <div className="mt-1 flex gap-3 text-xs font-bold">
              {plan.is_featured ? <span className="text-primary">{translateMessage('Featured')}</span> : null}
              {!plan.is_active ? <span className="text-warning">{translateMessage('Hidden')}</span> : null}
            </div>
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editingId ? 'Edit Package' : 'Add Package')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
        maxWidth="max-w-3xl"
      >
        <BilingualFieldInputs label={translateMessage('Name')} value={form.name} onChange={(name) => patch({ name })} errors={bilingualErrors(errors, 'name')} required />
        <BilingualFieldInputs
          label={translateMessage('Description')}
          value={form.description}
          onChange={(description) => patch({ description })}
          errors={bilingualErrors(errors, 'description')}
          multiline
          required
        />
        <div className="space-y-1">
          <BilingualFieldInputs
            label={translateMessage('Price label (optional)')}
            value={form.price_label}
            onChange={(price_label) => patch({ price_label })}
            errors={bilingualErrors(errors, 'price_label')}
          />
          <p className="text-xs text-[var(--text-muted)]">{translateMessage('Free text such as "From $1,500". Hidden on the website when empty.')}</p>
        </div>
        <div className="space-y-1">
          <TagRepeater
            label={translateMessage('Features')}
            addLabel={translateMessage('Add Feature')}
            tags={form.features.map((name) => ({ name, url: '' }))}
            onChange={(rows) => patch({ features: rows.map((row) => row.name) })}
            errors={featureErrors}
          />
          {featuresListError ? <p className="text-xs font-medium text-danger">{featuresListError}</p> : null}
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
          <input type="checkbox" checked={form.is_featured} onChange={(event) => patch({ is_featured: event.target.checked })} />
          {translateMessage('Highlight as recommended')}
        </label>
        <OrderAndActiveFields sortOrder={form.sort_order} isActive={form.is_active} onChange={patch} errors={errors} />
      </AdminFormModal>
    </div>
  );
}
