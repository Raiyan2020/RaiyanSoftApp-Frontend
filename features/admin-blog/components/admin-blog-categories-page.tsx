'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { translateMessage } from '@/lib/i18n-utils';
import type { BlogCategoryPayload, BlogCategoryWithCount } from '@/features/blog/types/blog.types';
import {
  createAdminBlogCategory,
  deleteAdminBlogCategory,
  fetchAdminBlogCategories,
  updateAdminBlogCategory,
} from '@/features/blog/services/blog-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const EMPTY_BI = { ar: '', en: '' };

export default function AdminBlogCategoriesPage() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['admin-blog-categories'], queryFn: () => fetchAdminBlogCategories({ all: true }) });
  const createMutation = useMutation({
    mutationFn: (payload: BlogCategoryPayload) => createAdminBlogCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blog-categories'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BlogCategoryPayload }) => updateAdminBlogCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blog-categories'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminBlogCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blog-categories'] }),
  });

  const [selected, setSelected] = useState<BlogCategoryWithCount | null>(null);
  const [title, setTitle] = useState(EMPTY_BI);
  const [description, setDescription] = useState(EMPTY_BI);
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState(EMPTY_BI);
  const [metaDescription, setMetaDescription] = useState(EMPTY_BI);
  const [ogTitle, setOgTitle] = useState(EMPTY_BI);
  const [ogDescription, setOgDescription] = useState(EMPTY_BI);
  const [image, setImage] = useState<ImageUploadValue | null>(null);
  const [ogImage, setOgImage] = useState<ImageUploadValue | null>(null);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState<BlogCategoryWithCount | null>(null);

  useEffect(() => {
    if (!selected && query.data?.[0]) {
      setSelected(query.data[0]);
      const item = query.data[0];
      setTitle({ ar: item.title, en: item.title });
      setDescription({ ar: item.description || '', en: item.description || '' });
      setSlug(item.slug);
      setIsActive(item.is_active ?? true);
      setSortOrder(item.sort_order || 0);
    }
  }, [query.data, selected]);

  const reset = () => {
    setSelected(null);
    setTitle(EMPTY_BI);
    setDescription(EMPTY_BI);
    setSlug('');
    setIsActive(true);
    setSortOrder(0);
    setMetaTitle(EMPTY_BI);
    setMetaDescription(EMPTY_BI);
    setOgTitle(EMPTY_BI);
    setOgDescription(EMPTY_BI);
    setImage(null);
    setOgImage(null);
    setError('');
  };

  const edit = (item: BlogCategoryWithCount) => {
    setSelected(item);
    setTitle({ ar: item.title, en: item.title });
    setDescription({ ar: item.description || '', en: item.description || '' });
    setSlug(item.slug);
    setIsActive(item.is_active ?? true);
    setSortOrder(item.sort_order || 0);
    setMetaTitle({ ar: item.seo?.meta_title || '', en: item.seo?.meta_title || '' });
    setMetaDescription({ ar: item.seo?.meta_description || '', en: item.seo?.meta_description || '' });
    setOgTitle({ ar: item.seo?.og_title || '', en: item.seo?.og_title || '' });
    setOgDescription({ ar: item.seo?.og_description || '', en: item.seo?.og_description || '' });
    setImage(null);
    setOgImage(null);
    setError('');
  };

  const payload = (): BlogCategoryPayload => ({
    title,
    slug,
    description,
    image: image?.file,
    is_active: isActive,
    sort_order: sortOrder,
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_title: ogTitle,
    og_description: ogDescription,
    og_image: ogImage?.file,
  });

  const save = async () => {
    if (!title.ar.trim() || !title.en.trim() || !slug.trim()) {
      setError(translateMessage('Title and slug are required.'));
      return;
    }
    setError('');
    if (selected) await updateMutation.mutateAsync({ id: selected.id, payload: payload() });
    else await createMutation.mutateAsync(payload());
    reset();
  };

  const remove = async () => {
    if (!pendingDelete) return;
    await deleteMutation.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
    reset();
  };

  const items = query.data ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[var(--text)]">{translateMessage('Blog Categories')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{translateMessage('Manage categories used to organize public blogs.')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <Plus size={14} className="me-2" />
            {translateMessage('New')}
          </Button>
        </div>
        {query.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="animate-spin" size={16} />{translateMessage('Loading...')}</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`rounded-2xl border p-4 ${selected?.id === item.id ? 'border-primary/50 bg-primary/5' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                <div className="flex items-start gap-3">
                  {item.image ? <img src={item.image} alt={item.title} className="h-16 w-16 rounded-xl object-cover" /> : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--text)]">{item.title}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{item.slug}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => edit(item)}>
                    <Edit2 size={14} className="me-2" />{translateMessage('Edit')}
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(item)}>
                    <Trash2 size={14} className="me-2" />{translateMessage('Delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <h3 className="text-lg font-black text-[var(--text)]">{translateMessage(selected ? 'Edit Category' : 'Create Category')}</h3>
        <div className="mt-5 grid gap-5">
          <BilingualFieldInputs label={translateMessage('Title')} value={title} onChange={setTitle} required />
          <label className="space-y-2">
            <span className="text-sm font-bold text-[var(--text)]">{translateMessage('Slug')}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </label>
          <BilingualFieldInputs label={translateMessage('Description')} value={description} onChange={setDescription} multiline />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2"><span className="text-sm font-bold text-[var(--text)]">{translateMessage('Order')}</span><input type="number" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-primary/60" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></label>
            <label className="flex items-center gap-2 pt-8 text-sm font-bold text-[var(--text)]"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />{translateMessage('Active')}</label>
          </div>
          <ImageUpload label={translateMessage('Image')} value={image} onChange={setImage} aspectRatio={1} />
          <BilingualFieldInputs label={translateMessage('Meta Title')} value={metaTitle} onChange={setMetaTitle} />
          <BilingualFieldInputs label={translateMessage('Meta Description')} value={metaDescription} onChange={setMetaDescription} multiline />
          <BilingualFieldInputs label={translateMessage('OG Title')} value={ogTitle} onChange={setOgTitle} />
          <BilingualFieldInputs label={translateMessage('OG Description')} value={ogDescription} onChange={setOgDescription} multiline />
          <ImageUpload label={translateMessage('OG Image')} value={ogImage} onChange={setOgImage} aspectRatio={1.91} />
          {error ? <ErrorAlert message={error} /> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} isLoading={createMutation.isPending || updateMutation.isPending}>{translateMessage('Save')}</Button>
            <Button type="button" variant="outline" onClick={reset}>{translateMessage('Reset')}</Button>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title={translateMessage('Delete')}
        message={translateMessage('Are you sure you want to delete this item?')}
        confirmText={translateMessage('Delete')}
        isDestructive
        isConfirming={deleteMutation.isPending}
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
