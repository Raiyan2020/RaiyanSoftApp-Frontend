'use client';

import React, { useState } from 'react';
import {
  useAdminCapabilities,
  useAdminCapabilitiesHeader,
  useUpdateAdminCapabilitiesHeader,
  useCreateAdminCapability,
  useUpdateAdminCapability,
  useDeleteAdminCapability,
} from '../hooks/use-admin-landing-page';
import SectionHeaderForm from './section-header-form';
import BilingualFieldInputs from './bilingual-field-inputs';
import CrudItemList from '@/components/ui/crud-item-list';
import AdminFormModal from '@/components/ui/admin-form-modal';
import TagRepeater from '@/components/ui/tag-repeater';
import type { AdminCapability, AdminCapabilityPayload, BilingualField, AdminSectionHeaderPayload } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';

const EMPTY_BI: BilingualField = { ar: '', en: '' };
const DEFAULT_FORM: AdminCapabilityPayload = { title: EMPTY_BI, caption: EMPTY_BI, description: EMPTY_BI, image: null, tags: [] };

function capabilityToForm(c: AdminCapability): AdminCapabilityPayload {
  return {
    title: { ar: c.title, en: c.title },
    caption: { ar: c.caption || '', en: c.caption || '' },
    description: { ar: c.description || '', en: c.description || '' },
    image: null,
    tags: c.tags.map((t) => ({ name: { ar: t.name, en: t.name }, url: t.url || '' })),
  };
}

export default function AdminCapabilitiesTab() {
  const { data: capabilities = [], isLoading } = useAdminCapabilities();
  const { data: header, isLoading: headerLoading } = useAdminCapabilitiesHeader();
  const updateHeaderMutation = useUpdateAdminCapabilitiesHeader();
  const createMutation = useCreateAdminCapability();
  const updateMutation = useUpdateAdminCapability();
  const deleteMutation = useDeleteAdminCapability();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminCapabilityPayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(cap: AdminCapability) {
    setEditingId(cap.id);
    setForm(capabilityToForm(cap));
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
        title={translateMessage('Capabilities')}
        items={capabilities}
        isLoading={isLoading}
        emptyLabel={translateMessage('No capabilities yet.')}
        addLabel={translateMessage('Add Capability')}
        deleteConfirmLabel={translateMessage('Delete this capability?')}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
        isDeleting={deleteMutation.isPending}
        renderItem={(cap) => (
          <div className="flex items-start gap-3">
            {cap.image ? (
              <img src={cap.image} alt={cap.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {cap.title?.[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{cap.title}</p>
              <p className="mt-0.5 text-sm text-[var(--text-muted)] line-clamp-2">{cap.description}</p>
              {cap.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cap.tags.map((t) => (
                    <span key={t.id} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{t.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={editingId ? translateMessage('Edit Capability') : translateMessage('Add Capability')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Title')} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} required />
        <BilingualFieldInputs label={translateMessage('Caption / Badge')} value={form.caption} onChange={(v) => setForm((p) => ({ ...p, caption: v }))} />
        <BilingualFieldInputs label={translateMessage('Description')} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} multiline />
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
