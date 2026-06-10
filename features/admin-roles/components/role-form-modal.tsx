import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Role } from '@/lib/roleStore';
import RolePermissionList from './role-permission-list';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleValues } from '../schemas/role.schema';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { translateMessage } from '@/lib/i18n-utils';

interface RoleFormModalProps {
  onClose: () => void;
  editingRole: Role | null;
  formData: RoleValues;
  setFormData: React.Dispatch<React.SetStateAction<RoleValues>>;
  onSubmit: (data: RoleValues) => void;
  onTogglePermission: (perm: string) => void;
}

export default function RoleFormModal({
  onClose,
  editingRole,
  formData,
  setFormData,
  onSubmit,
  onTogglePermission,
}: RoleFormModalProps) {
  const form = useForm<RoleValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: formData,
  });

  // Sync form data down from parent when the modal opens for a different role.
  useEffect(() => {
    form.reset(formData);
  }, [editingRole, form]);

  // Sync form data up to parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as RoleValues);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="bg-[var(--surface)] w-full max-w-lg rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[var(--text)]">
            {translateMessage(editingRole ? 'Edit Role' : 'Add New Role')}
          </h2>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="roleForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Role Name <span className="text-red-400">*</span></FieldLabel>
                  <input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors ${
                      fieldState.invalid ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                    placeholder={translateMessage('e.g. Sales Manager')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors h-20 resize-none ${
                      fieldState.invalid ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                    placeholder={translateMessage('Role purpose...')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field data-invalid={!!form.formState.errors.permissions}>
              <RolePermissionList
                selectedPermissions={formData.permissions}
                onTogglePermission={onTogglePermission}
              />
              {form.formState.errors.permissions && (
                <FieldError errors={[form.formState.errors.permissions]} />
              )}
            </Field>
          </form>
        </div>

        <div className="p-5 border-t border-[var(--border)] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] font-medium text-sm transition-colors"
          >
            {translateMessage('Cancel')}
          </button>
          <button
            form="roleForm"
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-sky-400 text-white font-medium text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            <span>{translateMessage('Save Role')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
