'use client';

import { useEffect, useState } from 'react';
import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import { translateMessage } from '@/lib/i18n-utils';
import { useAdminSocialMedia, useCreateAdminSocialMedia, useDeleteAdminSocialMedia, useUpdateAdminSocialMedia } from '../hooks/use-admin-landing-page';
import type { AdminSocialMediaItem } from '@/features/landing-page';

export default function AdminSocialMediaTab() {
  const query = useAdminSocialMedia();
  const createMutation = useCreateAdminSocialMedia();
  const updateMutation = useUpdateAdminSocialMedia();
  const deleteMutation = useDeleteAdminSocialMedia();
  const [selected, setSelected] = useState<AdminSocialMediaItem | null>(null);
  const [platform, setPlatform] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<ImageUploadValue | null>(null);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState<AdminSocialMediaItem | null>(null);

  useEffect(() => {
    if (!selected && query.data?.[0]) {
      const next = query.data[0];
      setSelected(next);
      setPlatform(next.platform);
      setLink(next.link);
    }
  }, [query.data, selected]);

  const reset = () => {
    setSelected(null);
    setPlatform('');
    setLink('');
    setImage(null);
    setError('');
  };

  const edit = (item: AdminSocialMediaItem) => {
    setSelected(item);
    setPlatform(item.platform);
    setLink(item.link);
    setImage(null);
    setError('');
  };

  const save = async () => {
    if (!platform.trim() || !link.trim()) {
      setError(translateMessage('Platform and link are required.'));
      return;
    }
    if (!selected && !image?.file) {
      setError(translateMessage('Please upload an image.'));
      return;
    }
    const payload = { platform, link, image: image?.file || undefined };
    if (selected) await updateMutation.mutateAsync({ id: selected.id, payload });
    else await createMutation.mutateAsync(payload);
    reset();
  };

  const remove = async () => {
    if (!pendingDelete) return;
    await deleteMutation.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
    reset();
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
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[var(--text)]">{translateMessage('Social Media')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{translateMessage('Manage social links and icons shown in the footer and contact areas.')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <Plus size={14} className="me-2" />
            {translateMessage('New')}
          </Button>
        </div>
        <div className="space-y-3">
          {(query.data ?? []).map((item) => (
            <div key={item.id} className={`rounded-2xl border p-4 ${selected?.id === item.id ? 'border-primary/50 bg-primary/5' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
              <div className="flex items-center gap-3">
                {item.image ? <img src={item.image} alt={item.platform} className="h-12 w-12 rounded-xl object-cover" /> : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[var(--text)]">{item.platform}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{item.link}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => edit(item)}>
                  <Edit2 size={14} className="me-2" />
                  {translateMessage('Edit')}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(item)}>
                  <Trash2 size={14} className="me-2" />
                  {translateMessage('Delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <h3 className="text-lg font-black text-[var(--text)]">{translateMessage(selected ? 'Edit Social Link' : 'Create Social Link')}</h3>
        <div className="mt-5 space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Platform')}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={platform} onChange={(e) => setPlatform(e.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Link')}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={link} onChange={(e) => setLink(e.target.value)} />
          </label>
          <ImageUpload label={translateMessage('Image')} value={image} onChange={setImage} aspectRatio={1} />
          {selected?.image && !image ? <img src={selected.image} alt={selected.platform} className="max-h-48 w-full rounded-2xl object-cover" /> : null}
          {error ? <ErrorAlert message={error} /> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} isLoading={createMutation.isPending || updateMutation.isPending}>
              {translateMessage('Save')}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              {translateMessage('Reset')}
            </Button>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title={translateMessage('Delete')}
        message={translateMessage('Are you sure you want to delete this item?')}
        confirmText={translateMessage('Delete')}
        isDestructive
        isConfirming={deleteMutation.isPending}
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
