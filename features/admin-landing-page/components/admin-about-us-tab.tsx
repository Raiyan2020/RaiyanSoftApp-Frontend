'use client';

import { useEffect, useState } from 'react';
import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import { translateMessage } from '@/lib/i18n-utils';
import BilingualFieldInputs from './bilingual-field-inputs';
import {
  useAdminAboutUsCards,
  useAdminAboutUsHeader,
  useCreateAdminAboutUsCard,
  useDeleteAdminAboutUsCard,
  useUpdateAdminAboutUsCard,
  useUpdateAdminAboutUsHeader,
} from '../hooks/use-admin-landing-page';
import type { AdminAboutUsCard, BilingualField } from '@/features/landing-page';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

export default function AdminAboutUsTab() {
  const headerQuery = useAdminAboutUsHeader();
  const cardsQuery = useAdminAboutUsCards();
  const updateHeader = useUpdateAdminAboutUsHeader();
  const createCard = useCreateAdminAboutUsCard();
  const updateCard = useUpdateAdminAboutUsCard();
  const deleteCard = useDeleteAdminAboutUsCard();

  const [header, setHeader] = useState({
    title: EMPTY_BI,
    caption: EMPTY_BI,
    description: EMPTY_BI,
  });
  const [selected, setSelected] = useState<AdminAboutUsCard | null>(null);
  const [cardTitle, setCardTitle] = useState(EMPTY_BI);
  const [cardDescription, setCardDescription] = useState(EMPTY_BI);
  const [imageValue, setImageValue] = useState<ImageUploadValue | null>(null);
  const [imageError, setImageError] = useState('');
  const [pendingDelete, setPendingDelete] = useState<AdminAboutUsCard | null>(null);

  useEffect(() => {
    if (headerQuery.data) {
      setHeader({
        title: headerQuery.data.title,
        caption: headerQuery.data.caption,
        description: headerQuery.data.description,
      });
    }
  }, [headerQuery.data]);

  useEffect(() => {
    if (!selected && cardsQuery.data?.[0]) {
      const next = cardsQuery.data[0];
      setSelected(next);
      setCardTitle(next.title);
      setCardDescription(next.description);
    }
  }, [cardsQuery.data, selected]);

  const cards = cardsQuery.data ?? [];

  const startCreate = () => {
    setSelected(null);
    setCardTitle(EMPTY_BI);
    setCardDescription(EMPTY_BI);
    setImageValue(null);
    setImageError('');
  };

  const startEdit = (card: AdminAboutUsCard) => {
    setSelected(card);
    setCardTitle(card.title);
    setCardDescription(card.description);
    setImageValue(null);
    setImageError('');
  };

  const handleHeaderSave = async () => {
    await updateHeader.mutateAsync({ title: header.title, caption: header.caption, description: header.description });
  };

  const handleCardSave = async () => {
    if (!cardTitle.ar.trim() || !cardTitle.en.trim() || !cardDescription.ar.trim() || !cardDescription.en.trim()) {
      setImageError(translateMessage('All bilingual fields are required.'));
      return;
    }
    if (!selected && !imageValue?.file) {
      setImageError(translateMessage('Please upload an image.'));
      return;
    }
    const payload = {
      title: cardTitle,
      description: cardDescription,
      image: imageValue?.file || undefined,
    };
    if (selected) await updateCard.mutateAsync({ id: selected.id, payload });
    else await createCard.mutateAsync(payload);
    startCreate();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await deleteCard.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
    startCreate();
  };

  const selectedId = selected?.id;

  if (headerQuery.isLoading || cardsQuery.isLoading) {
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
            <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('About Us')}</h2>
            <p className="text-sm text-[var(--text-muted)]">{translateMessage('Manage the header and the about us cards shown on the public site.')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={startCreate}>
            <Plus size={14} className="me-2" />
            {translateMessage('New')}
          </Button>
        </div>

        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className={`rounded-2xl border p-4 ${selectedId === card.id ? 'border-primary/50 bg-primary/5' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
              <div className="flex items-start gap-3">
                {card.image ? <img src={card.image} alt={card.title.ar} className="h-16 w-16 rounded-xl object-cover" /> : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[var(--text)]">{card.title.ar || card.title.en}</p>
                  <p className="line-clamp-2 text-xs text-[var(--text-muted)]">{card.description.ar || card.description.en}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(card)}>
                  <Edit2 size={14} className="me-2" />
                  {translateMessage('Edit')}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(card)}>
                  <Trash2 size={14} className="me-2" />
                  {translateMessage('Delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <h3 className="text-xl font-black text-[var(--text)]">{translateMessage(selected ? 'Edit Card' : 'Create Card')}</h3>
        <div className="mt-5 space-y-5">
          <BilingualFieldInputs label={translateMessage('Title')} value={cardTitle} onChange={setCardTitle} required />
          <BilingualFieldInputs label={translateMessage('Description')} value={cardDescription} onChange={setCardDescription} multiline required />
          <ImageUpload
            label={translateMessage('Image')}
            value={imageValue}
            onChange={setImageValue}
            aspectRatio={16 / 9}
          />
          {selected?.image && !imageValue ? (
            <img src={selected.image} alt={selected.title.ar} className="max-h-48 w-full rounded-2xl object-cover" />
          ) : null}
          {imageError ? <ErrorAlert message={imageError} /> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleCardSave} isLoading={createCard.isPending || updateCard.isPending}>
              {translateMessage('Save')}
            </Button>
            <Button type="button" variant="outline" onClick={startCreate}>
              {translateMessage('Reset')}
            </Button>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h4 className="mb-3 text-sm font-black text-[var(--text)]">{translateMessage('Section Header')}</h4>
            <div className="space-y-4">
              <BilingualFieldInputs label={translateMessage('Title')} value={header.title} onChange={(value) => setHeader((current) => ({ ...current, title: value }))} required />
              <BilingualFieldInputs label={translateMessage('Caption')} value={header.caption} onChange={(value) => setHeader((current) => ({ ...current, caption: value }))} required />
              <BilingualFieldInputs label={translateMessage('Description')} value={header.description} onChange={(value) => setHeader((current) => ({ ...current, description: value }))} multiline required />
              <Button type="button" onClick={handleHeaderSave} isLoading={updateHeader.isPending}>
                {translateMessage('Save Header')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title={translateMessage('Delete')}
        message={translateMessage('Are you sure you want to delete this item?')}
        confirmText={translateMessage('Delete')}
        isDestructive
        isConfirming={deleteCard.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
