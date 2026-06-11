'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import BilingualFieldInputs from './bilingual-field-inputs';
import {
  useAdminIdeaBanner,
  useAdminProjectBanner,
  useAdminFooterBanner,
  useUpdateAdminIdeaBanner,
  useUpdateAdminProjectBanner,
  useUpdateAdminFooterBanner,
} from '../hooks/use-admin-landing-page';
import type { AdminBanner, AdminBannerPayload, BilingualField } from '@/features/landing-page';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

function BannerEditor({
  title,
  banner,
  onSave,
  loading,
}: {
  title: string;
  banner: AdminBanner | null | undefined;
  onSave: (payload: AdminBannerPayload) => Promise<void>;
  loading: boolean;
}) {
  const [caption, setCaption] = useState(EMPTY_BI);
  const [heading, setHeading] = useState(EMPTY_BI);
  const [description, setDescription] = useState(EMPTY_BI);
  const [buttonText, setButtonText] = useState(EMPTY_BI);
  const [buttonUrl, setButtonUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!banner) return;
    setCaption(banner.caption || EMPTY_BI);
    setHeading(banner.title);
    setDescription(banner.description);
    setButtonText(banner.button_text || EMPTY_BI);
    setButtonUrl(banner.button_url || '');
  }, [banner]);

  const save = async () => {
    if (!heading.ar || !heading.en || !description.ar || !description.en || !buttonText.ar || !buttonText.en) {
      setError(translateMessage('Please complete all bilingual fields.'));
      return;
    }
    setError('');
    await onSave({
      caption,
      title: heading,
      description,
      button_text: buttonText,
      button_url: buttonUrl,
    });
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <h3 className="text-lg font-black text-[var(--text)]">{translateMessage(title)}</h3>
      <div className="mt-4 space-y-4">
        <BilingualFieldInputs label={translateMessage('Caption')} value={caption} onChange={setCaption} />
        <BilingualFieldInputs label={translateMessage('Title')} value={heading} onChange={setHeading} required />
        <BilingualFieldInputs label={translateMessage('Description')} value={description} onChange={setDescription} multiline required />
        <BilingualFieldInputs label={translateMessage('Button Text')} value={buttonText} onChange={setButtonText} required />
        <label className="block space-y-2">
          <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Button URL')}</span>
          <input
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60"
          />
        </label>
        {error ? <ErrorAlert message={error} /> : null}
        <Button type="button" onClick={save} isLoading={loading}>
          {translateMessage('Save')}
        </Button>
      </div>
    </section>
  );
}

export default function AdminBannersTab() {
  const idea = useAdminIdeaBanner();
  const project = useAdminProjectBanner();
  const footer = useAdminFooterBanner();
  const updateIdea = useUpdateAdminIdeaBanner();
  const updateProject = useUpdateAdminProjectBanner();
  const updateFooter = useUpdateAdminFooterBanner();

  if (idea.isLoading || project.isLoading || footer.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="me-2 animate-spin" size={18} />
        {translateMessage('Loading...')}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <BannerEditor title="Idea Banner" banner={idea.data} onSave={(payload) => updateIdea.mutateAsync(payload)} loading={updateIdea.isPending} />
      <BannerEditor title="Project Banner" banner={project.data} onSave={(payload) => updateProject.mutateAsync(payload)} loading={updateProject.isPending} />
      <BannerEditor title="Footer Banner" banner={footer.data} onSave={(payload) => updateFooter.mutateAsync(payload)} loading={updateFooter.isPending} />
    </div>
  );
}
