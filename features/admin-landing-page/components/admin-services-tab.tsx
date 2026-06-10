'use client';

import React, { useState } from 'react';
import {
  useAdminServices,
  useAdminServicesHeader,
  useUpdateAdminServicesHeader,
  useCreateAdminService,
  useUpdateAdminService,
  useDeleteAdminService,
} from '../hooks/use-admin-landing-page';
import SectionHeaderForm from './section-header-form';
import BilingualFieldInputs from './bilingual-field-inputs';
import CrudItemList from '@/components/ui/crud-item-list';
import AdminFormModal from '@/components/ui/admin-form-modal';
import TagRepeater from '@/components/ui/tag-repeater';
import type { AdminService, AdminServicePayload, BilingualField, AdminSectionHeaderPayload } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

const DEFAULT_FORM: AdminServicePayload = {
  title: EMPTY_BI,
  caption: EMPTY_BI,
  description: EMPTY_BI,
  overview: EMPTY_BI,
  image: null,
  tags: [],
};

function serviceToForm(s: AdminService): AdminServicePayload {
  return {
    title: { ar: s.title, en: s.title },
    caption: { ar: s.caption, en: s.caption },
    description: { ar: s.description, en: s.description },
    overview: { ar: s.overview || '', en: s.overview || '' },
    image: null,
    tags: s.tags.map((t) => ({ name: { ar: t.name, en: t.name }, url: t.url || '' })),
  };
}

export default function AdminServicesTab() {
  const { data: services = [], isLoading } = useAdminServices();
  const { data: header, isLoading: headerLoading } = useAdminServicesHeader();
  const updateHeaderMutation = useUpdateAdminServicesHeader();
  const createMutation = useCreateAdminService();
  const updateMutation = useUpdateAdminService();
  const deleteMutation = useDeleteAdminService();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminServicePayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(service: AdminService) {
    setEditingId(service.id);
    setForm(serviceToForm(service));
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
      {/* Section header editor */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <SectionHeaderForm
          header={header}
          loading={headerLoading}
          onSave={(p: AdminSectionHeaderPayload) => updateHeaderMutation.mutateAsync(p)}
        />
      </div>

      {/* Items list */}
      <CrudItemList
        title={translateMessage('Services')}
        items={services}
        isLoading={isLoading}
        emptyLabel={translateMessage('No services yet.')}
        addLabel={translateMessage('Add Service')}
        deleteConfirmLabel={translateMessage('Delete this service?')}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
        isDeleting={deleteMutation.isPending}
        renderItem={(service) => (
          <div className="flex items-start gap-3">
            {service.image ? (
              <img src={service.image} alt={service.title} className="h-12 w-12 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {service.title?.[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{service.title}</p>
              <p className="mt-0.5 text-sm text-[var(--text-muted)] line-clamp-2">{service.description}</p>
              {service.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {service.tags.map((t) => (
                    <span key={t.id} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{t.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />

      {/* Create / Edit modal */}
      <AdminFormModal
        open={showForm}
        title={editingId ? translateMessage('Edit Service') : translateMessage('Add Service')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Title')} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} required />
        <BilingualFieldInputs label={translateMessage('Caption')} value={form.caption} onChange={(v) => setForm((p) => ({ ...p, caption: v }))} />
        <BilingualFieldInputs label={translateMessage('Description')} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} multiline />
        <BilingualFieldInputs label={translateMessage('Overview / Outcome')} value={form.overview} onChange={(v) => setForm((p) => ({ ...p, overview: v }))} multiline />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{translateMessage('Image')}</label>
          <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] ?? null }))} className="w-full text-sm text-[var(--text-muted)]" />
        </div>
        <TagRepeater
          label={translateMessage('Tags')}
          addLabel={translateMessage('Add')}
          tags={form.tags}
          onChange={(tags) => setForm((p) => ({ ...p, tags }))}
          withUrl
        />
      </AdminFormModal>
    </div>
  );
}
