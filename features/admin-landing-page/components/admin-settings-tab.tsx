'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import { translateMessage } from '@/lib/i18n-utils';
import BilingualFieldInputs from './bilingual-field-inputs';
import { useAdminSiteSettings, useUpdateAdminSiteSettings } from '../hooks/use-admin-landing-page';
import type { AdminSiteSettings, AdminSiteSettingsPayload, BilingualField } from '@/features/landing-page';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

export default function AdminSettingsTab() {
  const query = useAdminSiteSettings();
  const update = useUpdateAdminSiteSettings();
  const [form, setForm] = useState<AdminSiteSettingsPayload>({
    site_name: EMPTY_BI,
    site_description: EMPTY_BI,
    site_email: '',
    site_phone: '',
    first_footer_text: EMPTY_BI,
    second_footer_text: EMPTY_BI,
  });
  const [logo, setLogo] = useState<ImageUploadValue | null>(null);
  const [favicon, setFavicon] = useState<ImageUploadValue | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.data) return;
    const settings = query.data as AdminSiteSettings;
    setForm({
      site_name: settings.site_name || EMPTY_BI,
      site_description: settings.site_description || EMPTY_BI,
      site_email: settings.site_email || '',
      site_phone: settings.site_phone || '',
      first_footer_text: settings.first_footer_text || EMPTY_BI,
      second_footer_text: settings.second_footer_text || EMPTY_BI,
    });
  }, [query.data]);

  const save = async () => {
    if (!form.site_name.ar || !form.site_name.en) return setError(translateMessage('Site name is required.'));
    if (!form.site_description.ar || !form.site_description.en) return setError(translateMessage('Site description is required.'));
    if (!form.first_footer_text.ar || !form.first_footer_text.en) return setError(translateMessage('Footer text is required.'));
    if (!form.second_footer_text.ar || !form.second_footer_text.en) return setError(translateMessage('Footer text is required.'));
    setError('');
    await update.mutateAsync({
      ...form,
      site_logo: logo?.file,
      site_favicon: favicon?.file,
    });
  };

  if (query.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="me-2 animate-spin" size={18} />
        {translateMessage('Loading...')}
      </div>
    );
  }

  return (
    <section className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <div>
        <h3 className="text-lg font-black text-[var(--text)]">{translateMessage('Site Settings')}</h3>
        <p className="text-sm text-[var(--text-muted)]">{translateMessage('Update site identity, contact details, and footer copy.')}</p>
      </div>
      <BilingualFieldInputs label={translateMessage('Site Name')} value={form.site_name} onChange={(value) => setForm((current) => ({ ...current, site_name: value }))} required />
      <BilingualFieldInputs label={translateMessage('Site Description')} value={form.site_description} onChange={(value) => setForm((current) => ({ ...current, site_description: value }))} multiline required />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Site Email')}</span>
          <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={form.site_email} onChange={(e) => setForm((current) => ({ ...current, site_email: e.target.value }))} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Site Phone')}</span>
          <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={form.site_phone} onChange={(e) => setForm((current) => ({ ...current, site_phone: e.target.value }))} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ImageUpload label={translateMessage('Site Logo')} value={logo} onChange={setLogo} aspectRatio={1} />
        <ImageUpload label={translateMessage('Site Favicon')} value={favicon} onChange={setFavicon} aspectRatio={1} maxWidth={512} maxHeight={512} />
      </div>
      <BilingualFieldInputs label={translateMessage('First Footer Text')} value={form.first_footer_text} onChange={(value) => setForm((current) => ({ ...current, first_footer_text: value }))} multiline required />
      <BilingualFieldInputs label={translateMessage('Second Footer Text')} value={form.second_footer_text} onChange={(value) => setForm((current) => ({ ...current, second_footer_text: value }))} multiline required />
      {error ? <ErrorAlert message={error} /> : null}
      <Button type="button" onClick={save} isLoading={update.isPending}>
        {translateMessage('Save')}
      </Button>
    </section>
  );
}
