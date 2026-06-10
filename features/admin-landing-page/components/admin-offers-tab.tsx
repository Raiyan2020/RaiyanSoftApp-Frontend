'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import {
  useAdminOffers,
  useAdminOffersHeader,
  useUpdateAdminOffersHeader,
  useCreateAdminOffer,
  useUpdateAdminOffer,
  useDeleteAdminOffer,
} from '../hooks/use-admin-landing-page';
import SectionHeaderForm from './section-header-form';
import BilingualFieldInputs from './bilingual-field-inputs';
import CrudItemList from '@/components/ui/crud-item-list';
import AdminFormModal from '@/components/ui/admin-form-modal';
import type { AdminOffer, AdminOfferPayload, BilingualField, AdminSectionHeaderPayload } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';

const EMPTY_BI: BilingualField = { ar: '', en: '' };
const DEFAULT_FORM: AdminOfferPayload = { title: EMPTY_BI, caption: EMPTY_BI, button_text: EMPTY_BI, button_url: '', most_requested: 0 };

function offerToForm(o: AdminOffer): AdminOfferPayload {
  return {
    title: { ar: o.title, en: o.title },
    caption: { ar: o.caption || '', en: o.caption || '' },
    button_text: { ar: o.button_text || '', en: o.button_text || '' },
    button_url: o.button_url || '',
    most_requested: o.most_requested ? 1 : 0,
  };
}

export default function AdminOffersTab() {
  const { data: offers = [], isLoading } = useAdminOffers();
  const { data: header, isLoading: headerLoading } = useAdminOffersHeader();
  const updateHeaderMutation = useUpdateAdminOffersHeader();
  const createMutation = useCreateAdminOffer();
  const updateMutation = useUpdateAdminOffer();
  const deleteMutation = useDeleteAdminOffer();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminOfferPayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(offer: AdminOffer) {
    setEditingId(offer.id);
    setForm(offerToForm(offer));
    setFormError('');
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setFormError(translateMessage(err instanceof Error ? err.message : 'Failed to save'));
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <SectionHeaderForm
          header={header}
          loading={headerLoading}
          onSave={(p: AdminSectionHeaderPayload) => updateHeaderMutation.mutateAsync(p)}
        />
      </div>

      <CrudItemList
        title={translateMessage('Offers')}
        items={offers}
        isLoading={isLoading}
        emptyLabel={translateMessage('No offers yet.')}
        addLabel={translateMessage('Add Offer')}
        deleteConfirmLabel={translateMessage('Delete this offer?')}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
        isDeleting={deleteMutation.isPending}
        renderItem={(offer) => (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{offer.title}</p>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">{offer.caption}</p>
            </div>
            {offer.most_requested ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-400">
                <Star size={10} /> {translateMessage('Popular')}
              </span>
            ) : null}
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={editingId ? translateMessage('Edit Offer') : translateMessage('Add Offer')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Title')} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} required />
        <BilingualFieldInputs label={translateMessage('Caption / Badge')} value={form.caption} onChange={(v) => setForm((p) => ({ ...p, caption: v }))} />
        <BilingualFieldInputs label={translateMessage('Button Text')} value={form.button_text} onChange={(v) => setForm((p) => ({ ...p, button_text: v }))} />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Button URL')}</label>
          <input type="text" value={form.button_url} onChange={(e) => setForm((p) => ({ ...p, button_url: e.target.value }))} placeholder="#contact" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-primary focus:outline-none" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <input type="checkbox" checked={form.most_requested === 1} onChange={(e) => setForm((p) => ({ ...p, most_requested: e.target.checked ? 1 : 0 }))} className="h-4 w-4 rounded accent-primary" />
          {translateMessage('Mark as Most Requested')}
        </label>
      </AdminFormModal>
    </div>
  );
}
