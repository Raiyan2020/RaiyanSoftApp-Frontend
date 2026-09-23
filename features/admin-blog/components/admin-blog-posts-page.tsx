'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminFormModal from '@/components/ui/admin-form-modal';
import CrudItemList from '@/components/ui/crud-item-list';
import ImageUpload, { type ImageUploadValue } from '@/components/ui/image-upload';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import FallbackImage from '@/components/ui/fallback-image';
import TablePagination from '@/components/ui/table-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BilingualFieldInputs from '@/features/admin-landing-page/components/bilingual-field-inputs';
import { validateRequiredBilingual } from '@/features/admin-landing-page/components/landing-form-validation';
import { bilingualErrors, getFieldErrors, type FieldErrors } from '@/lib/admin-api-error';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import type { AdminBlog, BlogPayload } from '@/features/blog/types/blog.types';
import {
  createAdminBlog,
  deleteAdminBlog,
  fetchAdminBlogCategories,
  fetchAdminBlogs,
  updateAdminBlog,
} from '@/features/blog/services/blog-api';

const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor'), {
  ssr: false,
  loading: () => <Loader />,
});

const blogKeys = {
  posts: ['admin-blogs'] as const,
  categories: ['admin-blog-categories'] as const,
};

type Bilingual = { ar: string; en: string };
const EMPTY_BI: Bilingual = { ar: '', en: '' };

const EMPTY_FORM: BlogPayload = {
  category_id: 0,
  title: EMPTY_BI,
  slug: '',
  excerpt: EMPTY_BI,
  content: EMPTY_BI,
  image: null,
  is_featured: false,
  is_active: true,
  published_at: '',
  sort_order: 0,
  meta_title: EMPTY_BI,
  meta_description: EMPTY_BI,
  og_title: EMPTY_BI,
  og_description: EMPTY_BI,
  og_image: null,
};

const bi = (value?: Partial<Bilingual>): Bilingual => ({ ar: value?.ar ?? '', en: value?.en ?? '' });

/** ISO timestamp -> value for <input type="datetime-local"> in the admin's local time. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const isBlankHtml = (html: string) => !html.replace(/<[^>]*>|&nbsp;/g, '').trim();

function postToForm(post: AdminBlog): BlogPayload {
  return {
    category_id: post.category_id ?? 0,
    title: bi(post.title),
    slug: post.slug,
    excerpt: bi(post.excerpt),
    content: bi(post.content),
    image: null,
    is_featured: post.is_featured,
    is_active: post.is_active,
    published_at: toLocalInput(post.published_at),
    sort_order: post.sort_order,
    meta_title: bi(post.meta_title),
    meta_description: bi(post.meta_description),
    og_title: bi(post.og_title),
    og_description: bi(post.og_description),
    og_image: null,
  };
}

export default function AdminBlogPostsPage() {
  const { language } = useTranslation();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const postsQuery = useQuery({
    queryKey: [...blogKeys.posts, page] as const,
    queryFn: () => fetchAdminBlogs({ page }),
  });
  const categoriesQuery = useQuery({ queryKey: blogKeys.categories, queryFn: () => fetchAdminBlogCategories({ all: true }) });
  const invalidate = () => qc.invalidateQueries({ queryKey: blogKeys.posts });
  const createMutation = useMutation({ mutationFn: createAdminBlog, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BlogPayload }) => updateAdminBlog(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteAdminBlog, onSuccess: invalidate });

  const posts = postsQuery.data?.items ?? [];
  const pagination = postsQuery.data?.pagination ?? null;
  // A delete can empty the current page; step back to the new last page
  // instead of showing nothing.
  if (pagination && page > Math.max(1, pagination.last_page)) {
    setPage(Math.max(1, pagination.last_page));
  }

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogPayload>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageValue, setImageValue] = useState<ImageUploadValue | null>(null);
  const [ogImageValue, setOgImageValue] = useState<ImageUploadValue | null>(null);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const categories = categoriesQuery.data ?? [];
  const localized = (value?: Partial<Bilingual>) => value?.[language] || value?.en || value?.ar || '';
  const update = (patch: Partial<BlogPayload>) => setForm((prev) => ({ ...prev, ...patch }));

  function open(post: AdminBlog | null) {
    setEditingId(post?.id ?? null);
    setForm(post ? postToForm(post) : EMPTY_FORM);
    setSlugTouched(Boolean(post));
    setImageValue(null);
    setOgImageValue(null);
    setFormError('');
    setErrors({});
    setShowForm(true);
  }

  function statusLabel(post: AdminBlog): string {
    if (!post.is_active) return translateMessage('Draft');
    if (post.published_at && new Date(post.published_at) > new Date()) return translateMessage('Scheduled');
    return translateMessage('Published');
  }

  async function handleSave() {
    setFormError('');
    const required = translateMessage('This field is required');
    const nextErrors: FieldErrors = {};
    if (!form.category_id) nextErrors.category_id = required;
    if (!form.slug.trim()) nextErrors.slug = required;
    for (const key of ['title', 'excerpt'] as const) {
      const fieldErrors = validateRequiredBilingual(form[key]);
      if (fieldErrors.ar) nextErrors[`${key}.ar`] = fieldErrors.ar;
      if (fieldErrors.en) nextErrors[`${key}.en`] = fieldErrors.en;
    }
    if (isBlankHtml(form.content.ar)) nextErrors['content.ar'] = required;
    if (isBlankHtml(form.content.en)) nextErrors['content.en'] = required;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (editingId) await updateMutation.mutateAsync({ id: editingId, payload: form });
      else await createMutation.mutateAsync(form);
      setShowForm(false);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(err instanceof Error ? err.message : translateMessage('Failed to save blog.'));
    }
  }

  return (
    <div className="space-y-6">
      <CrudItemList
        title={translateMessage('Blog')}
        items={posts}
        isLoading={postsQuery.isLoading}
        emptyLabel={translateMessage('No blog posts yet.')}
        addLabel={translateMessage('Add Post')}
        deleteConfirmLabel={translateMessage('Delete this post?')}
        onAdd={() => open(null)}
        onEdit={(post: AdminBlog) => open(post)}
        onDelete={(id) => deleteMutation.mutateAsync(id).catch(() => undefined)}
        isDeleting={deleteMutation.isPending}
        renderItem={(post) => (
          <div className="flex items-start gap-3">
            <FallbackImage src={post.image} alt={localized(post.title)} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--text)]">{localized(post.title)}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {[localized(post.category?.title), `/${post.slug}`].filter(Boolean).join(' · ')}
              </p>
              <span className="mt-1 inline-flex rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-bold text-[var(--text)]">
                {statusLabel(post)}
              </span>
            </div>
          </div>
        )}
      />
      <TablePagination pagination={pagination} onPageChange={setPage} loading={postsQuery.isFetching} />

      <AdminFormModal
        open={showForm}
        title={translateMessage(editingId ? 'Edit Blog' : 'Create Blog')}
        onClose={() => setShowForm(false)}
        onSubmit={handleSave}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[var(--text)]">{translateMessage('Category')}</p>
          <Select value={form.category_id ? String(form.category_id) : undefined} onValueChange={(value) => update({ category_id: Number(value) })}>
            <SelectTrigger aria-invalid={Boolean(errors.category_id)}>
              <SelectValue placeholder={translateMessage('Select')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>{localized(category.title)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id ? <p className="text-xs font-medium text-danger">{errors.category_id}</p> : null}
        </div>

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
          label={translateMessage('Excerpt')}
          value={form.excerpt}
          onChange={(excerpt) => update({ excerpt })}
          errors={bilingualErrors(errors, 'excerpt')}
          multiline
          required
        />
        {(['ar', 'en'] as const).map((lang) => (
          <RichTextEditor
            key={lang}
            label={`${translateMessage('Content')} (${translateMessage(lang === 'ar' ? 'Arabic' : 'English')})`}
            value={form.content[lang]}
            onChange={(html) => setForm((prev) => ({ ...prev, content: { ...prev.content, [lang]: html } }))}
            error={errors[`content.${lang}`]}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            minHeight={220}
            showToolbar
            showBubbleMenu
          />
        ))}
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
            type="datetime-local"
            label={translateMessage('Publish date')}
            value={form.published_at}
            onChange={(event) => update({ published_at: event.target.value })}
            error={errors.published_at}
          />
          <Input
            type="number"
            label={translateMessage('Order')}
            value={form.sort_order}
            onChange={(event) => update({ sort_order: Number(event.target.value) || 0 })}
            error={errors.sort_order}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)]">{translateMessage('Leave the date empty to publish immediately. A future date schedules the post.')}</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
            <input type="checkbox" checked={form.is_active} onChange={(event) => update({ is_active: event.target.checked })} />
            {translateMessage('Active')}
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
            <input type="checkbox" checked={form.is_featured} onChange={(event) => update({ is_featured: event.target.checked })} />
            {translateMessage('Featured')}
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
