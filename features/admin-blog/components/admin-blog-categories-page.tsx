'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import Input from '@/components/ui/input';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { validateRequiredBilingual } from '@/features/admin-landing-page/components/landing-form-validation';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import type { AdminBlogCategory, BlogCategoryPayload } from '@/features/blog/types/blog.types';
import {
  createAdminBlogCategory,
  deleteAdminBlogCategory,
  fetchAdminBlogCategories,
  updateAdminBlogCategory,
} from '@/features/blog/services/blog-api';

const categoryKeys = { all: ['admin-blog-categories'] as const };

type Bilingual = { ar: string; en: string };
const EMPTY_BI: Bilingual = { ar: '', en: '' };

const EMPTY_FORM: BlogCategoryPayload = {
  title: EMPTY_BI,
  slug: '',
  description: EMPTY_BI,
  image: null,
  is_active: true,
  sort_order: 0,
  meta_title: EMPTY_BI,
  meta_description: EMPTY_BI,
  og_title: EMPTY_BI,
  og_description: EMPTY_BI,
  og_image: null,
};

const bi = (value?: Partial<Bilingual>): Bilingual => ({ ar: value?.ar ?? '', en: value?.en ?? '' });

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categoryToForm(category: AdminBlogCategory): BlogCategoryPayload {
  return {
    title: bi(category.title),
    slug: category.slug,
    description: bi(category.description),
    image: null,
    is_active: category.is_active,
    sort_order: category.sort_order,
    meta_title: bi(category.meta_title),
    meta_description: bi(category.meta_description),
    og_title: bi(category.og_title),
    og_description: bi(category.og_description),
    og_image: null,
  };
}

export default function AdminBlogCategoriesPage() {
  const { language } = useTranslation();
  const qc = useQueryClient();
  const query = useQuery({ queryKey: categoryKeys.all, queryFn: () => fetchAdminBlogCategories({ all: true }) });
  const invalidate = () => qc.invalidateQueries({ queryKey: categoryKeys.all });
  const createMutation = useMutation({ mutationFn: createAdminBlogCategory, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BlogCategoryPayload }) => updateAdminBlogCategory(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteAdminBlogCategory, onSuccess: invalidate });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogCategoryPayload>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageValue, setImageValue] = useState<ImageUploadValue | null>(null);
  const [ogImageValue, setOgImageValue] = useState<ImageUploadValue | null>(null);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const localized = (value?: Partial<Bilingual>) => value?.[language] || value?.en || value?.ar || '';
  const update = (patch: Partial<BlogCategoryPayload>) => setForm((prev) => ({ ...prev, ...patch }));

  function open(category: AdminBlogCategory | null) {
    setEditingId(category?.id ?? null);
    setForm(category ? categoryToForm(category) : EMPTY_FORM);
    setSlugTouched(Boolean(category));
    setImageValue(null);
    setOgImageValue(null);
    setFormError('');
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    setFormError('');
    const titleErrors = validateRequiredBilingual(form.title);
    const nextErrors: FieldErrors = {};
    if (titleErrors.ar) nextErrors['title.ar'] = titleErrors.ar;
    if (titleErrors.en) nextErrors['title.en'] = titleErrors.en;
    if (!form.slug.trim()) nextErrors.slug = translateMessage('This field is required');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (editingId) await updateMutation.mutateAsync({ id: editingId, payload: form });
      else await createMutation.mutateAsync(form);
      setShowForm(false);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(err instanceof Error ? err.message : translateMessage('Failed to save blog category.'));
    }
  }

  return (
    <div className="space-y-6">
      <CrudItemList
        title={translateMessage('Blog Categories')}
        items={query.data ?? []}
        isLoading={query.isLoading}
        emptyLabel={translateMessage('No blog categories yet.')}
        addLabel={translateMessage('Add Category')}
        deleteConfirmLabel={translateMessage('Delete this category?')}
        onAdd={() => open(null)}
        onEdit={(category: AdminBlogCategory) => open(category)}
        onDelete={(id) => deleteMutation.mutateAsync(id).catch(() => undefined)}
        isDeleting={deleteMutation.isPending}
        renderItem={(category) => (
          <div className="min-w-0">
            <p className="truncate font-semibold text-[var(--text)]">{localized(category.title)}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              /{category.slug}
              {category.is_active ? '' : ` · ${translateMessage('Inactive')}`}
            </p>
          </div>
        )}
      />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editingId ? 'Edit Category' : 'Add Category')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
        maxWidth="max-w-3xl"
      >
        <BilingualFieldInputs
          label={translateMessage('Title')}
          value={form.title}
          onChange={(title) => update(slugTouched ? { title } : { title, slug: slugify(title.en) })}
          errors={bilingualErrors(errors, 'title')}
          required
        />
        <Input
          label={translateMessage('Slug')}
          dir="ltr"
          value={form.slug}
          onChange={(event) => {
            setSlugTouched(true);
            update({ slug: event.target.value });
          }}
          error={errors.slug}
        />
        <BilingualFieldInputs
          label={translateMessage('Description')}
          value={form.description}
          onChange={(description) => update({ description })}
          errors={bilingualErrors(errors, 'description')}
          multiline
        />
        <ImageUpload
          label={translateMessage('Image')}
          value={imageValue}
          onChange={(next) => {
            setImageValue(next);
            update({ image: next?.file ?? null });
          }}
          aspectRatio={16 / 9}
        />
        {errors.image ? <p className="text-xs font-medium text-danger">{errors.image}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="number"
            label={translateMessage('Order')}
            value={form.sort_order}
            onChange={(event) => update({ sort_order: Number(event.target.value) || 0 })}
            error={errors.sort_order}
          />
          <label className="flex items-center gap-2 self-end pb-3 text-sm font-bold text-[var(--text)]">
            <input type="checkbox" checked={form.is_active} onChange={(event) => update({ is_active: event.target.checked })} />
            {translateMessage('Active')}
          </label>
        </div>

        <details className="rounded-xl border border-[var(--border)] p-4">
          <summary className="cursor-pointer text-sm font-bold text-[var(--text)]">{translateMessage('SEO')}</summary>
          <div className="mt-4 space-y-4">
            <BilingualFieldInputs label={translateMessage('Meta Title')} value={bi(form.meta_title)} onChange={(meta_title) => update({ meta_title })} errors={bilingualErrors(errors, 'meta_title')} />
            <BilingualFieldInputs label={translateMessage('Meta Description')} value={bi(form.meta_description)} onChange={(meta_description) => update({ meta_description })} errors={bilingualErrors(errors, 'meta_description')} multiline />
            <BilingualFieldInputs label={translateMessage('OG Title')} value={bi(form.og_title)} onChange={(og_title) => update({ og_title })} errors={bilingualErrors(errors, 'og_title')} />
            <BilingualFieldInputs label={translateMessage('OG Description')} value={bi(form.og_description)} onChange={(og_description) => update({ og_description })} errors={bilingualErrors(errors, 'og_description')} multiline />
            <ImageUpload
              label={translateMessage('OG Image')}
              value={ogImageValue}
              onChange={(next) => {
                setOgImageValue(next);
                update({ og_image: next?.file ?? null });
              }}
              aspectRatio={1.91}
            />
            {errors.og_image ? <p className="text-xs font-medium text-danger">{errors.og_image}</p> : null}
          </div>
        </details>
      </AdminFormModal>
    </div>
  );
}
