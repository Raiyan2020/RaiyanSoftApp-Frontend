'use client';

import React, { useState } from 'react';
import {
  useAdminTestimonials,
  useAdminTestimonialsHeader,
  useUpdateAdminTestimonialsHeader,
  useCreateAdminTestimonial,
  useUpdateAdminTestimonial,
  useDeleteAdminTestimonial,
} from '../hooks/use-admin-landing-page';
import SectionHeaderForm from './section-header-form';
import BilingualFieldInputs from './bilingual-field-inputs';
import CrudItemList from '@/components/ui/crud-item-list';
import AdminFormModal from '@/components/ui/admin-form-modal';
import type { AdminTestimonial, AdminTestimonialPayload, BilingualField, AdminSectionHeaderPayload } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';

const EMPTY_BI: BilingualField = { ar: '', en: '' };
const DEFAULT_FORM: AdminTestimonialPayload = { title: EMPTY_BI, caption: EMPTY_BI, description: EMPTY_BI, image: null };

function testimonialToForm(t: AdminTestimonial): AdminTestimonialPayload {
  return {
    title: t.title,
    caption: t.caption,
    description: t.description,
    image: null,
  };
}

export default function AdminTestimonialsTab() {
  const { data: testimonials = [], isLoading } = useAdminTestimonials();
  const { data: header, isLoading: headerLoading } = useAdminTestimonialsHeader();
  const updateHeaderMutation = useUpdateAdminTestimonialsHeader();
  const createMutation = useCreateAdminTestimonial();
  const updateMutation = useUpdateAdminTestimonial();
  const deleteMutation = useDeleteAdminTestimonial();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminTestimonialPayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(t: AdminTestimonial) {
    setEditingId(t.id);
    setForm(testimonialToForm(t));
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
        title={translateMessage('Testimonials')}
        items={testimonials}
        isLoading={isLoading}
        emptyLabel={translateMessage('No testimonials yet.')}
        addLabel={translateMessage('Add Testimonial')}
        deleteConfirmLabel={translateMessage('Delete this testimonial?')}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
        isDeleting={deleteMutation.isPending}
        renderItem={(t) => {
          const displayTitle = t.title.en || t.title.ar;
          return (
            <div className="flex items-start gap-3">
              {t.image ? (
                <img src={t.image} alt={displayTitle} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {displayTitle?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text)]">{displayTitle}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.caption.en || t.caption.ar}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2">{t.description.en || t.description.ar}</p>
              </div>
            </div>
          );
        }}
      />

      <AdminFormModal
        open={showForm}
        title={editingId ? translateMessage('Edit Testimonial') : translateMessage('Add Testimonial')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Client Name (Title)')} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} required />
        <BilingualFieldInputs label={translateMessage('Company / Role (Caption)')} value={form.caption} onChange={(v) => setForm((p) => ({ ...p, caption: v }))} />
        <BilingualFieldInputs label={translateMessage('Review / Quote')} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} multiline />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Client Photo')}</label>
          <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] ?? null }))} className="w-full text-sm text-[var(--text-muted)]" />
        </div>
      </AdminFormModal>
    </div>
  );
}
