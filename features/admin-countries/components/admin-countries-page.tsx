"use client";

import React from 'react';
import { ArrowRightLeft, Globe2, Loader2, Plus, Save, Trash2, Pencil, RefreshCcw, ShieldCheck } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import SafeImage from '@/components/ui/safe-image';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { translateMessage } from '@/lib/i18n-utils';
import { getAdminCountryImageUrl } from '../services/admin-countries-api';
import { useAdminCountries } from '../hooks/use-admin-countries';

function CountryThumb({ image, name }: { image: string | null; name: string }) {
  const src = getAdminCountryImageUrl(image);

  if (!src) {
    return (
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] text-sm font-black text-[var(--text)]">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-3)]">
      <SafeImage src={src} alt={name} className="h-full w-full" />
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

  const isSaving = saveLoading || loadingCountryId !== null;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await saveCountry();
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
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-primary/90 disabled:opacity-60"
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_430px]">
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
              {translateMessage('No countries yet. Create the first one from the form on the right.')}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {countries.map((country) => {
                const isEditing = editingId === country.id;
                const isDeleting = pendingDeleteId === country.id && deleteLoading;

                return (
                  <article
                    key={country.id}
                    className={`rounded-2xl border p-4 transition ${
                      isEditing
                        ? 'border-primary/40 bg-primary/5 shadow-[0_0_0_1px_rgba(29,183,240,0.15)]'
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
                              {country.country_code} · +{country.phone_code}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                              country.is_active
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-zinc-500/10 text-[var(--text-muted)]'
                            }`}
                          >
                            <ShieldCheck size={11} />
                            {translateMessage(country.is_active ? 'Active' : 'Inactive')}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(country.id)}
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
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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

        <section className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Globe2 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">
                {translateMessage(editingId ? 'Edit Country' : 'Add Country')}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {translateMessage('Upload a country image and save its phone metadata.')}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <FieldGroup>
              <Field>
                <FieldLabel>{translateMessage('Country Name')}</FieldLabel>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-primary"
                  placeholder={translateMessage('Egypt')}
                />
                <FieldError errors={fieldErrors.name ? [fieldErrors.name] : []} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>{translateMessage('Country Code')}</FieldLabel>
                  <input
                    value={form.countryCode}
                    onChange={(event) => setForm((current) => ({ ...current, countryCode: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-primary"
                    placeholder={translateMessage('eg')}
                  />
                  <FieldDescription>{translateMessage('Use the ISO code shown in the phone input.')}</FieldDescription>
                  <FieldError errors={fieldErrors.countryCode ? [fieldErrors.countryCode] : []} />
                </Field>

                <Field>
                  <FieldLabel>{translateMessage('Phone Code')}</FieldLabel>
                  <input
                    value={form.phoneCode}
                    onChange={(event) => setForm((current) => ({ ...current, phoneCode: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-primary"
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
                      <SafeImage src={currentImageUrl} alt={form.name || translateMessage('Country image')} className="h-full w-full" />
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {translateMessage(isSaving ? 'Saving...' : editingId ? 'Update Country' : 'Create Country')}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-3)]"
                >
                  <ArrowRightLeft size={16} />
                  {translateMessage('Cancel Edit')}
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </div>

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
