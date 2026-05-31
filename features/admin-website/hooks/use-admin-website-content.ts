"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  deleteWebsiteContentItem,
  isWebsiteSlugAvailable,
  saveWebsiteContentItem,
  subscribeWebsiteContent,
} from '@/lib/websiteContentStore';
import type {
  WebsiteContentConfig,
  WebsiteContentForm,
  WebsiteContentItem,
  WebsiteContentStatus,
} from '../types/website-content';

const emptyForm = (config: WebsiteContentConfig): WebsiteContentForm => ({
  title: '',
  slug: '',
  status: 'draft',
  order: '0',
  featured: false,
  locale: 'ar',
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
  approvedForPublic: !config.requiresApproval,
  clientApproved: !config.requiresApproval,
  data: config.fields.reduce((acc, field) => {
    acc[field.key] = field.type === 'toggle' ? false : field.type === 'list' ? [] : '';
    return acc;
  }, {} as Record<string, any>),
});

const itemToForm = (config: WebsiteContentConfig, item: WebsiteContentItem): WebsiteContentForm => ({
  title: item.title || '',
  slug: item.slug || '',
  status: item.status,
  order: String(item.order ?? 0),
  featured: Boolean(item.featured),
  locale: item.locale || 'ar',
  seoTitle: item.seoTitle || '',
  seoDescription: item.seoDescription || '',
  ogImage: item.ogImage || '',
  approvedForPublic: Boolean(item.approval?.approvedForPublic),
  clientApproved: Boolean(item.approval?.clientApproved),
  data: config.fields.reduce((acc, field) => {
    const value = item.data?.[field.key];
    acc[field.key] = field.type === 'list' ? (Array.isArray(value) ? value : []) : value ?? (field.type === 'toggle' ? false : '');
    return acc;
  }, {} as Record<string, any>),
});

const formToPayload = (
  form: WebsiteContentForm,
  config: WebsiteContentConfig,
  id?: string,
  statusOverride?: WebsiteContentStatus
): Partial<WebsiteContentItem> => ({
  ...(id ? { id } : {}),
  title: form.title.trim(),
  slug: config.requiresSlug || form.slug ? form.slug.trim() : '',
  status: statusOverride || form.status,
  order: Number.parseInt(form.order, 10) || 0,
  featured: form.featured,
  locale: form.locale || 'ar',
  seoTitle: form.seoTitle.trim(),
  seoDescription: form.seoDescription.trim(),
  ogImage: form.ogImage.trim(),
  data: form.data,
  approval: {
    approvedForPublic: form.approvedForPublic,
    clientApproved: form.clientApproved,
  },
});

export function useAdminWebsiteContent(config: WebsiteContentConfig) {
  const [items, setItems] = useState<WebsiteContentItem[]>([]);
  const [selected, setSelected] = useState<WebsiteContentItem | null>(null);
  const [form, setForm] = useState<WebsiteContentForm>(() => emptyForm(config));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WebsiteContentStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    return subscribeWebsiteContent(
      config,
      (nextItems) => {
        setItems(nextItems);
        if (config.singleton && nextItems[0]) {
          setSelected(nextItems[0]);
          setForm(itemToForm(config, nextItems[0]));
        }
        setIsLoading(false);
        setError('');
      },
      (message) => {
        setError(message);
        setIsLoading(false);
      }
    );
  }, [config]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const searchable = `${item.title} ${item.slug || ''} ${item.seoTitle || ''} ${item.seoDescription || ''}`.toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [items, query, statusFilter]);

  const createNew = () => {
    if (config.singleton && items[0]) {
      editItem(items[0]);
      return;
    }
    setSelected(null);
    setForm(emptyForm(config));
    setError('');
  };

  const editItem = (item: WebsiteContentItem) => {
    setSelected(item);
    setForm(itemToForm(config, item));
    setError('');
  };

  const duplicateItem = (item: WebsiteContentItem) => {
    setSelected(null);
    setForm({
      ...itemToForm(config, item),
      title: `${item.title} Copy`,
      slug: item.slug ? `${item.slug}-copy` : '',
      status: 'draft',
    });
    setError('');
  };

  const updateField = <K extends keyof WebsiteContentForm>(key: K, value: WebsiteContentForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateDataField = (key: string, value: any) => {
    setForm((current) => ({ ...current, data: { ...current.data, [key]: value } }));
  };

  const validateForm = async () => {
    if (!form.title.trim()) return `${config.singularLabel} title is required.`;
    if (config.requiresSlug && !form.slug.trim()) return `${config.singularLabel} slug is required.`;

    for (const field of config.fields) {
      if (!field.required) continue;
      const value = form.data[field.key];
      const isEmptyList = Array.isArray(value) && value.length === 0;
      if (value === undefined || value === null || value === '' || isEmptyList) return `${field.label} is required.`;
    }

    if (form.slug.trim()) {
      const available = await isWebsiteSlugAvailable(config, form.slug.trim(), selected?.id);
      if (!available) return `Slug "${form.slug.trim()}" is already used in ${config.label}.`;
    }

    return '';
  };

  const save = async (statusOverride?: WebsiteContentStatus) => {
    setIsSaving(true);
    setError('');
    try {
      const validationError = await validateForm();
      if (validationError) {
        setError(validationError);
        return false;
      }

      const id = await saveWebsiteContentItem(config, formToPayload(form, config, selected?.id, statusOverride));
      const savedStatus = statusOverride || form.status;
      setForm((current) => ({ ...current, status: savedStatus }));
      if (!selected) {
        setSelected({ id, ...formToPayload(form, config, id, savedStatus) } as WebsiteContentItem);
      }
      return true;
    } catch (err: any) {
      setError(err?.message || `Failed to save ${config.singularLabel.toLowerCase()}.`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (item: WebsiteContentItem) => {
    setIsSaving(true);
    setError('');
    try {
      await deleteWebsiteContentItem(config, item);
      if (selected?.id === item.id) createNew();
      return true;
    } catch (err: any) {
      setError(err?.message || `Failed to delete ${config.singularLabel.toLowerCase()}.`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    items,
    filteredItems,
    selected,
    form,
    query,
    statusFilter,
    isLoading,
    isSaving,
    error,
    setQuery,
    setStatusFilter,
    createNew,
    editItem,
    duplicateItem,
    updateField,
    updateDataField,
    save,
    remove,
  };
}
