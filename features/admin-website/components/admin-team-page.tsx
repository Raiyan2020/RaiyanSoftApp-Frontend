'use client';

import { useState } from 'react';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import FallbackImage from '@/components/ui/fallback-image';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import { adminWebsiteListKeys, useAdminWebsiteList } from '../hooks/use-admin-website-list';
import { teamMembersApi } from '../services/website-lists-api';
import type { AdminBilingual, AdminTeamMember, AdminTeamMemberPayload } from '../types/website-lists';
import { OrderAndActiveFields, requireBilingual, toBilingual } from './list-form-fields';

const EMPTY_FORM: AdminTeamMemberPayload = {
  name: { ar: '', en: '' },
  role: { ar: '', en: '' },
  bio: { ar: '', en: '' },
  image: null,
  sort_order: 0,
  is_active: true,
};

export default function AdminTeamPage() {
  const { language } = useTranslation();
  const { query, create, update, remove, isSaving } = useAdminWebsiteList(adminWebsiteListKeys.teamMembers, teamMembersApi);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminTeamMember | null>(null);
  const [form, setForm] = useState<AdminTeamMemberPayload>(EMPTY_FORM);
  const [imageValue, setImageValue] = useState<ImageUploadValue | null>(null);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const localized = (value: AdminBilingual) => value[language] || value.en || value.ar || '';
  const patch = (next: Partial<AdminTeamMemberPayload>) => setForm((prev) => ({ ...prev, ...next }));

  function open(member: AdminTeamMember | null) {
    setEditing(member);
    setForm(
      member
        ? {
            name: toBilingual(member.name),
            role: toBilingual(member.role),
            bio: toBilingual(member.bio),
            image: null,
            sort_order: member.sort_order,
            is_active: member.is_active,
          }
        : EMPTY_FORM,
    );
    setImageValue(null);
    setFormError('');
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');
    const nextErrors = requireBilingual({}, form, ['name', 'role']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (editing) await update.mutateAsync({ id: editing.id, payload: form });
      else await create.mutateAsync(form);
      setShowForm(false);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(err instanceof Error ? err.message : translateMessage('Failed to save'));
    }
  }

  return (
    <div className="space-y-6">
      <CrudItemList
        title={translateMessage('Team')}
        items={query.data ?? []}
        isLoading={query.isLoading}
        emptyLabel={translateMessage('No team members yet.')}
        addLabel={translateMessage('Add Team Member')}
        deleteConfirmLabel={translateMessage('Delete this team member?')}
        onAdd={() => open(null)}
        onEdit={(member: AdminTeamMember) => open(member)}
        onDelete={(id) => remove.mutateAsync(id).catch(() => undefined)}
        isDeleting={remove.isPending}
        renderItem={(member) => (
          <div className="flex items-start gap-3">
            <FallbackImage src={member.image} alt={localized(member.name)} className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--text)]">{localized(member.name)}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{localized(member.role)}</p>
              {!member.is_active ? <p className="text-xs font-bold text-warning">{translateMessage('Hidden')}</p> : null}
            </div>
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editing ? 'Edit Team Member' : 'Add Team Member')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        error={formError}
      >
        <BilingualFieldInputs label={translateMessage('Name')} value={form.name} onChange={(name) => patch({ name })} errors={bilingualErrors(errors, 'name')} required />
        <BilingualFieldInputs label={translateMessage('Role')} value={form.role} onChange={(role) => patch({ role })} errors={bilingualErrors(errors, 'role')} required />
        <BilingualFieldInputs label={translateMessage('Bio')} value={form.bio} onChange={(bio) => patch({ bio })} errors={bilingualErrors(errors, 'bio')} multiline />
        {editing?.image && !imageValue ? (
          <FallbackImage src={editing.image} alt={localized(editing.name)} className="h-16 w-16 rounded-full object-cover" />
        ) : null}
        <ImageUpload
          label={translateMessage('Photo')}
          value={imageValue}
          onChange={(next) => {
            setImageValue(next);
            patch({ image: next?.file ?? null });
          }}
          aspectRatio={1}
          maxWidth={800}
          maxHeight={800}
          previewClassName="aspect-square max-w-48"
        />
        {errors.image ? <p className="text-xs font-medium text-danger">{errors.image}</p> : null}
        <OrderAndActiveFields sortOrder={form.sort_order} isActive={form.is_active} onChange={patch} errors={errors} />
      </AdminFormModal>
    </div>
  );
}
