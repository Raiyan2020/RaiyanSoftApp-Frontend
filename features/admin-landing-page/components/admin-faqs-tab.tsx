'use client';

import React, { useState } from 'react';
import {
  useAdminFaqs,
  useAdminFaqsHeader,
  useCreateAdminFaq,
  useDeleteAdminFaq,
  useUpdateAdminFaq,
  useUpdateAdminFaqsHeader,
} from '../hooks/use-admin-landing-page';
import SectionHeaderForm from './section-header-form';
import BilingualFieldInputs from './bilingual-field-inputs';
import CrudItemList from '@/components/ui/crud-item-list';
import AdminFormModal from '@/components/ui/admin-form-modal';
import { globalToast } from '@/lib/toast-context';
import type { AdminFaq, AdminFaqPayload, AdminSectionHeaderPayload, BilingualField } from '@/features/landing-page';
import { translateMessage } from '@/lib/i18n-utils';
import {
  hasBilingualErrors,
  validateRequiredBilingual,
  type BilingualFieldErrors,
} from './landing-form-validation';

const EMPTY_BI: BilingualField = { ar: '', en: '' };

const DEFAULT_FORM: AdminFaqPayload = {
  question: EMPTY_BI,
  answer: EMPTY_BI,
};

function faqToForm(faq: AdminFaq): AdminFaqPayload {
  return {
    question: faq.question,
    answer: faq.answer,
  };
}

export default function AdminFaqsTab() {
  const { data: faqs = [], isLoading } = useAdminFaqs();
  const { data: header, isLoading: headerLoading } = useAdminFaqsHeader();
  const updateHeaderMutation = useUpdateAdminFaqsHeader();
  const createMutation = useCreateAdminFaq();
  const updateMutation = useUpdateAdminFaq();
  const deleteMutation = useDeleteAdminFaq();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminFaqPayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ question?: BilingualFieldErrors; answer?: BilingualFieldErrors }>({});

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setFieldErrors({});
    setShowForm(true);
  }

  function openEdit(faq: AdminFaq) {
    setEditingId(faq.id);
    setForm(faqToForm(faq));
    setFormError('');
    setFieldErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');

    const nextFieldErrors = {
      question: validateRequiredBilingual(form.question),
      answer: validateRequiredBilingual(form.answer),
    };
    setFieldErrors(nextFieldErrors);

    if (hasBilingualErrors(nextFieldErrors.question) || hasBilingualErrors(nextFieldErrors.answer)) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      globalToast.success(translateMessage('Saved Successfully'));
      setShowForm(false);
      setEditingId(null);
      setForm(DEFAULT_FORM);
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
        title={translateMessage('FAQs')}
        items={faqs}
        isLoading={isLoading}
        emptyLabel={translateMessage('No FAQs yet.')}
        addLabel={translateMessage('Add FAQ')}
        deleteConfirmLabel={translateMessage('Delete this FAQ?')}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
        isDeleting={deleteMutation.isPending}
        renderItem={(faq) => {
          const title = faq.question.en || faq.question.ar;
          const answer = faq.answer.en || faq.answer.ar;
          return (
            <div className="space-y-1">
              <p className="font-semibold text-[var(--text)]">{title}</p>
              <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{answer}</p>
            </div>
          );
        }}
      />

      <AdminFormModal
        open={showForm}
        title={editingId ? translateMessage('Edit FAQ') : translateMessage('Add FAQ')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs
          label={translateMessage('Question')}
          value={form.question}
          onChange={(value) => setForm((current) => ({ ...current, question: value }))}
          errors={fieldErrors.question}
          required
          multiline
        />
        <BilingualFieldInputs
          label={translateMessage('Answer')}
          value={form.answer}
          onChange={(value) => setForm((current) => ({ ...current, answer: value }))}
          errors={fieldErrors.answer}
          required
          multiline
        />
      </AdminFormModal>
    </div>
  );
}
