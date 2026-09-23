"use client";

import React from 'react';
import { Loader2, Plus, Trash2, Pencil, RefreshCcw, ShieldCheck } from 'lucide-react';
import AdminFormModal from '@/components/ui/admin-form-modal';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import Input from '@/components/ui/input';
import FallbackImage from '@/components/ui/fallback-image';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { translateMessage } from '@/lib/i18n-utils';
import { formatCallingCode } from '@/lib/utils';
import { getAdminCountryImageUrl } from '../services/admin-countries-api';
import { useAdminCountries } from '../hooks/use-admin-countries';

function CountryThumb({ image, name }: { image: string | null; name: string }) {
  const src = getAdminCountryImageUrl(image);

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-3)]">
      <FallbackImage src={src} alt={name} className="h-full w-full" />
    </div>
  );
}

export default function AdminCountriesPage() {
  const {
    countries,
    form,
    setForm,
    editingId,
    loadingCountryId,
    currentImageUrl,
    formResetToken,
    listLoading,
    listError,
    reload,
    saveLoading,
    deleteLoading,
    fieldErrors,
    startCreate,
    startEdit,
    saveCountry,
    pendingDeleteId,
    setPendingDeleteId,
    handleDelete,
    resetForm,
  } = useAdminCountries();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const isSaving = saveLoading || loadingCountryId !== null;

  const openCreate = () => {
    startCreate();
    setIsFormOpen(true);
  };

  const openEdit = async (id: number) => {
    if (await startEdit(id)) setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const onSubmit = async () => {
    if (await saveCountry()) setIsFormOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Countries')}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {translateMessage('Manage the countries available for phone inputs and regional settings.')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary shadow-lg transition hover:bg-primary/90 disabled:opacity-60"
          >
            <Plus size={16} />
            {translateMessage('Add Country')}
          </button>
          <button
            type="button"
            onClick={() => reload().catch(() => undefined)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
          >
            <RefreshCcw size={16} />
            {translateMessage('Refresh')}
          </button>
        </div>
      </div>

      {listError ? <ErrorAlert message={translateMessage(listError)} /> : null}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">
              {translateMessage('Available Countries')}
              <span className="ms-2 rounded-full border border-[var(--border)] bg-[var(--surface-3)] px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)]">
                {countries.length}
              </span>
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {translateMessage('These records power phone input country options and region-aware settings.')}
            </p>
          </div>
        </div>

        {listLoading ? (
          <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : countries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-6 py-16 text-center text-sm text-[var(--text-muted)]">
            {translateMessage('No countries yet. Use Add Country to create the first one.')}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {countries.map((country) => {
              const isEditing = editingId === country.id;
              const isDeleting = pendingDeleteId === country.id && deleteLoading;

              return (
                <article
                  key={country.id}
                  className={`rounded-2xl border p-4 transition ${
                    isEditing
                      ? 'border-primary/40 bg-primary/5 shadow-[0_0_0_1px_rgb(var(--primary-glow-rgb) / 0.15)]'
                      : 'border-[var(--border)] bg-[var(--surface-2)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CountryThumb image={country.image} name={country.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-[var(--text)]">{country.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                            {country.country_code} · {formatCallingCode(country.phone_code)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                            country.is_active
                              ? 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success'
                              : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                          }`}
                        >
                          <ShieldCheck size={11} />
                          {translateMessage(country.is_active ? 'Active' : 'Inactive')}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(country.id)}
                          disabled={loadingCountryId === country.id || deleteLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-3)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loadingCountryId === country.id ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
                          {translateMessage('Edit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(country.id)}
                          disabled={loadingCountryId === country.id || deleteLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] bg-[color-mix(in_srgb,var(--danger)_5%,transparent)] px-3 py-2 text-xs font-semibold text-danger transition hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          {translateMessage('Delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <AdminFormModal
        open={isFormOpen}
        title={translateMessage(editingId ? 'Edit Country' : 'Add Country')}
        onClose={closeForm}
        onSubmit={onSubmit}
        isSubmitting={isSaving}
      >
        <p className="text-sm text-[var(--text-muted)]">
          {translateMessage('Upload a country image and save its phone metadata.')}
        </p>
        <FieldGroup>
          <Field>
            <FieldLabel>{translateMessage('Country Name')}</FieldLabel>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder={translateMessage('Egypt')}
            />
            <FieldError errors={fieldErrors.name ? [fieldErrors.name] : []} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>{translateMessage('Country Code')}</FieldLabel>
              <Input
                value={form.countryCode}
                onChange={(event) => setForm((current) => ({ ...current, countryCode: event.target.value }))}
                placeholder={translateMessage('eg')}
              />
              <FieldDescription>{translateMessage('Use the ISO code shown in the phone input.')}</FieldDescription>
              <FieldError errors={fieldErrors.countryCode ? [fieldErrors.countryCode] : []} />
            </Field>

            <Field>
              <FieldLabel>{translateMessage('Phone Code')}</FieldLabel>
              <Input
                value={form.phoneCode}
                onChange={(event) => setForm((current) => ({ ...current, phoneCode: event.target.value }))}
                placeholder={translateMessage('20')}
              />
              <FieldDescription>{translateMessage('Use digits only, without the plus sign.')}</FieldDescription>
              <FieldError errors={fieldErrors.phoneCode ? [fieldErrors.phoneCode] : []} />
            </Field>
          </div>

          <Field>
            <FieldLabel>{translateMessage('Country Image')}</FieldLabel>
            {currentImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
                <div className="relative aspect-[16/9] w-full bg-[var(--surface-3)]">
                  <FallbackImage src={currentImageUrl} alt={form.name || translateMessage('Country image')} className="h-full w-full" />
                </div>
                <p className="px-4 py-3 text-xs text-[var(--text-muted)]">
                  {translateMessage('Current image. Upload a new one to replace it.')}
                </p>
              </div>
            ) : null}
            <ImageUpload
              key={`${editingId ?? 'create'}-${formResetToken}`}
              label={translateMessage('Upload Image')}
              value={form.image as ImageUploadValue | null}
              onChange={(value) => setForm((current) => ({ ...current, image: value }))}
              aspectRatio={16 / 9}
              previewClassName="aspect-[16/9] w-full rounded-2xl"
            />
            <FieldError errors={fieldErrors.image ? [fieldErrors.image] : []} />
          </Field>

          <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[var(--text)]">{translateMessage('Active Country')}</p>
              <p className="text-xs text-[var(--text-muted)]">{translateMessage('Inactive countries stay hidden from public selectors.')}</p>
            </div>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              className="h-5 w-5 accent-primary"
            />
          </label>
          <FieldError errors={fieldErrors.isActive ? [fieldErrors.isActive] : []} />
        </FieldGroup>
      </AdminFormModal>

      <ConfirmModal
        isOpen={pendingDeleteId != null}
        title="Delete Country?"
        message="This will remove the country from the dashboard and public selectors."
        confirmText="Delete Country"
        isDestructive
        isConfirming={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
