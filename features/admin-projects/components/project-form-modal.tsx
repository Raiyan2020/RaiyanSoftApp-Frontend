import React, { useEffect, useState } from 'react';
import FallbackImage from '@/components/ui/fallback-image';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Project } from '@/lib/projectStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectValues } from '../schemas/project.schema';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import { translateMessage } from '@/lib/i18n-utils';

const isValidImageUrl = (url: any): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    if (url.startsWith('/')) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });
}

interface ProjectFormModalProps {
  onClose: () => void;
  editingProject: Project | null;
  formData: ProjectValues;
  setFormData: React.Dispatch<React.SetStateAction<ProjectValues>>;
  onSubmit: (data: ProjectValues) => void;
}

export default function ProjectFormModal({
  onClose,
  editingProject,
  formData,
  setFormData,
  onSubmit,
}: ProjectFormModalProps) {
  const [imageValue, setImageValue] = useState<ImageUploadValue | null>(null);
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  // Clear the picked upload preview whenever the project being edited
  // changes, adjusted during render (comparing against the previous
  // editingProject) instead of in an effect.
  const [prevEditingProject, setPrevEditingProject] = useState(editingProject);
  if (editingProject !== prevEditingProject) {
    setPrevEditingProject(editingProject);
    setImageValue(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={false}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="bg-[var(--surface)] w-full max-w-lg rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[var(--text)]">
            {translateMessage(editingProject ? 'Edit Project' : 'Add New Project')}
          </h2>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="projectForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{translateMessage('Project Name')} <span className="text-danger">*</span></FieldLabel>
                  <input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors ${
                      fieldState.invalid ? 'border-[color-mix(in_srgb,var(--danger)_50%,transparent)] focus:border-danger' : ''
                    }`}
                    placeholder={translateMessage('e.g. Raiyan CRM')}
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
                  <FieldLabel>{translateMessage('Short Description')} <span className="text-danger">*</span></FieldLabel>
                  <textarea
                    {...field}
                    maxLength={120}
                    aria-invalid={fieldState.invalid}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors h-24 resize-none ${
                      fieldState.invalid ? 'border-[color-mix(in_srgb,var(--danger)_50%,transparent)] focus:border-danger' : ''
                    }`}
                    placeholder={translateMessage('Brief overview (max 120 chars)')}
                  />
                  <div className="flex justify-between mt-1">
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <span />
                    )}
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {(field.value || '').length}/120
                    </div>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="link"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{translateMessage('Project URL')} <span className="text-danger">*</span></FieldLabel>
                  <input
                    {...field}
                    type="url"
                    aria-invalid={fieldState.invalid}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors ${
                      fieldState.invalid ? 'border-[color-mix(in_srgb,var(--danger)_50%,transparent)] focus:border-danger' : ''
                    }`}
                    placeholder={translateMessage('https://...')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="logoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{translateMessage('Project Logo')}</FieldLabel>
                  <input
                    {...field}
                    value={field.value || ''}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    onChange={(event) => {
                      field.onChange(event);
                      setFormData((prev) => ({ ...prev, logoUrl: event.target.value }));
                      setImageValue(null);
                    }}
                    className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none transition-colors text-sm ${
                      fieldState.invalid ? 'border-[color-mix(in_srgb,var(--danger)_50%,transparent)] focus:border-danger' : ''
                    }`}
                    placeholder={translateMessage('Paste image URL...')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <div className="mt-3">
                    <ImageUpload
                      label={translateMessage('Upload optimized logo')}
                      value={imageValue}
                      onChange={async (nextImage) => {
                        setImageValue(nextImage);

                        if (!nextImage) {
                          field.onChange('');
                          setFormData((prev) => ({ ...prev, logoUrl: '' }));
                          return;
                        }

                        const dataUrl = await fileToDataUrl(nextImage.file);
                        field.onChange(dataUrl);
                        setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
                      }}
                      aspectRatio={1}
                      maxWidth={1080}
                      maxHeight={1080}
                      previewClassName="aspect-square max-w-48"
                    />
                  </div>
                  {isValidImageUrl(field.value) && !imageValue ? (
                    <div className="mt-2 w-16 h-16 bg-[var(--surface-3)] rounded-xl border border-[var(--border)] overflow-hidden relative group">
                      <div className="relative w-full h-full">
                        <FallbackImage src={field.value} alt={translateMessage('Preview')} className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[11px] text-[var(--text)]">{translateMessage('Preview')}</span>
                      </div>
                    </div>
                  ) : null}
                </Field>
              )}
            />
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
            form="projectForm"
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-medium text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            <span>{translateMessage('Save Project')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
