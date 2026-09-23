'use client';

import { useState } from 'react';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import Input from '@/components/ui/input';
import FallbackImage from '@/components/ui/fallback-image';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { validateOptionalAbsoluteUrl } from '@/features/admin-landing-page/components/landing-form-validation';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import { adminWebsiteListKeys, useAdminWebsiteList } from '../hooks/use-admin-website-list';
import { partnersApi } from '../services/website-lists-api';
import type { AdminBilingual, AdminPartner, AdminPartnerPayload } from '../types/website-lists';
import { OrderAndActiveFields, requireBilingual, toBilingual } from './list-form-fields';

const EMPTY_FORM: AdminPartnerPayload = {
  name: { ar: '', en: '' },
  description: { ar: '', en: '' },
  url: '',
  logo: null,
  sort_order: 0,
  is_active: true,
};

export default function AdminPartnersPage() {
  const { language } = useTranslation();
  const { query, create, update, remove, isSaving } = useAdminWebsiteList(adminWebsiteListKeys.partners, partnersApi);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminPartner | null>(null);
  const [form, setForm] = useState<AdminPartnerPayload>(EMPTY_FORM);
  const [logoValue, setLogoValue] = useState<ImageUploadValue | null>(null);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const localized = (value: AdminBilingual) => value[language] || value.en || value.ar || '';
  const patch = (next: Partial<AdminPartnerPayload>) => setForm((prev) => ({ ...prev, ...next }));

  function open(partner: AdminPartner | null) {
    setEditing(partner);
    setForm(
      partner
        ? {
            name: toBilingual(partner.name),
            description: toBilingual(partner.description),
            url: partner.url ?? '',
            logo: null,
            sort_order: partner.sort_order,
            is_active: partner.is_active,
          }
        : EMPTY_FORM,
    );
    setLogoValue(null);
    setFormError('');
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');
    const nextErrors = requireBilingual({}, form, ['name']);
    const urlError = validateOptionalAbsoluteUrl(form.url);
    if (urlError) nextErrors.url = urlError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (editing) await update.mutateAsync({ id: editing.id, payload: form });
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
        title={translateMessage('Partners')}
        items={query.data ?? []}
        isLoading={query.isLoading}
        emptyLabel={translateMessage('No partners yet.')}
        addLabel={translateMessage('Add Partner')}
        deleteConfirmLabel={translateMessage('Delete this partner?')}
        onAdd={() => open(null)}
        onEdit={(partner: AdminPartner) => open(partner)}
        onDelete={(id) => remove.mutateAsync(id).catch(() => undefined)}
        isDeleting={remove.isPending}
        renderItem={(partner) => (
          <div className="flex items-start gap-3">
            <FallbackImage src={partner.logo} alt={localized(partner.name)} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--text)]">{localized(partner.name)}</p>
              {partner.url ? <p className="truncate text-xs text-[var(--text-muted)]" dir="ltr">{partner.url}</p> : null}
              {!partner.is_active ? <p className="text-xs font-bold text-warning">{translateMessage('Hidden')}</p> : null}
            </div>
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editing ? 'Edit Partner' : 'Add Partner')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Name')} value={form.name} onChange={(name) => patch({ name })} errors={bilingualErrors(errors, 'name')} required />
        <BilingualFieldInputs
          label={translateMessage('Description')}
          value={form.description}
          onChange={(description) => patch({ description })}
          errors={bilingualErrors(errors, 'description')}
          multiline
        />
        <Input
          type="url"
          dir="ltr"
          label={translateMessage('Website URL')}
          placeholder="https://example.com"
          value={form.url}
          onChange={(event) => patch({ url: event.target.value })}
          error={errors.url}
        />
        {editing?.logo && !logoValue ? (
          <FallbackImage src={editing.logo} alt={localized(editing.name)} className="h-16 w-16 rounded-lg object-contain" />
        ) : null}
        <ImageUpload
          label={translateMessage('Logo')}
          value={logoValue}
          onChange={(next) => {
            setLogoValue(next);
            patch({ logo: next?.file ?? null });
          }}
          aspectRatio={1}
          maxWidth={512}
          maxHeight={512}
          previewClassName="aspect-square max-w-40"
        />
        {errors.logo ? <p className="text-xs font-medium text-danger">{errors.logo}</p> : null}
        <OrderAndActiveFields sortOrder={form.sort_order} isActive={form.is_active} onChange={patch} errors={errors} />
      </AdminFormModal>
    </div>
  );
}
