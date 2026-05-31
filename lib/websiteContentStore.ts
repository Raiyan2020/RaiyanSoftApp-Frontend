"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase-client';
import { createAuditLogSafe } from './auditLogStore';
import { sanitizeForFirestore } from './firestoreSanitize';
import type { WebsiteContentConfig } from '@/features/admin-website/types/website-content';
import type { WebsiteContentItem, WebsiteContentStatus } from '@/features/admin-website/types/website-content';

const timestampToMs = (value: any) => value?.toMillis?.() || 0;

const sortWebsiteContent = (items: WebsiteContentItem[]) =>
  [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

export function mapWebsiteContentDoc(id: string, data: any): WebsiteContentItem {
  return {
    id,
    title: data.title || 'Untitled',
    slug: data.slug || '',
    status: data.status || 'draft',
    order: typeof data.order === 'number' ? data.order : 0,
    featured: Boolean(data.featured),
    locale: data.locale || 'ar',
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    ogImage: data.ogImage || '',
    data: data.data || {},
    approval: data.approval || {},
    createdAt: timestampToMs(data.createdAt),
    updatedAt: timestampToMs(data.updatedAt),
    publishedAt: timestampToMs(data.publishedAt),
    createdBy: data.createdBy || '',
    updatedBy: data.updatedBy || '',
    publishedBy: data.publishedBy || '',
  };
}

export function subscribeWebsiteContent(
  config: WebsiteContentConfig,
  onChange: (items: WebsiteContentItem[]) => void,
  onError: (error: string) => void
) {
  if (!db) {
    onError('Firestore is not configured.');
    return () => {};
  }

  const q = query(collection(db, config.collection));
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(sortWebsiteContent(snapshot.docs.map((snap) => mapWebsiteContentDoc(snap.id, snap.data()))));
    },
    (error) => {
      console.error(`Website content subscription error (${config.collection}):`, error);
      onError(error.message || 'Failed to load website content.');
    }
  );
}

export async function saveWebsiteContentItem(config: WebsiteContentConfig, item: Partial<WebsiteContentItem>) {
  if (!db) throw new Error('Firestore is not configured.');

  const user = auth.currentUser;
  const isPublish = item.status === 'published';
  const payload = sanitizeForFirestore({
    title: item.title || 'Untitled',
    slug: item.slug || '',
    status: item.status || 'draft',
    order: item.order ?? 0,
    featured: Boolean(item.featured),
    locale: item.locale || 'ar',
    seoTitle: item.seoTitle || '',
    seoDescription: item.seoDescription || '',
    ogImage: item.ogImage || '',
    data: item.data || {},
    approval: item.approval || {},
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid || 'unknown',
    ...(isPublish ? { publishedAt: serverTimestamp(), publishedBy: user?.uid || 'unknown' } : {}),
  });

  if (item.id) {
    await updateDoc(doc(db, config.collection, item.id), payload);
    await createAuditLogSafe({
      entityType: 'website_content',
      entityId: item.id,
      action: `website_content.${isPublish ? 'published' : 'updated'}`,
      newValue: { collection: config.collection, ...payload },
    });
    return item.id;
  }

  const created = await addDoc(
    collection(db, config.collection),
    sanitizeForFirestore({
      ...payload,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || 'unknown',
    })
  );
  await createAuditLogSafe({
    entityType: 'website_content',
    entityId: created.id,
    action: `website_content.${isPublish ? 'created_published' : 'created'}`,
    newValue: { collection: config.collection, ...payload },
  });
  return created.id;
}

export async function updateWebsiteContentStatus(
  config: WebsiteContentConfig,
  item: WebsiteContentItem,
  status: WebsiteContentStatus
) {
  return saveWebsiteContentItem(config, { ...item, status });
}

export async function deleteWebsiteContentItem(config: WebsiteContentConfig, item: WebsiteContentItem) {
  if (!db) throw new Error('Firestore is not configured.');
  await deleteDoc(doc(db, config.collection, item.id));
  await createAuditLogSafe({
    entityType: 'website_content',
    entityId: item.id,
    action: 'website_content.deleted',
    oldValue: { collection: config.collection, ...item },
  });
}

export async function isWebsiteSlugAvailable(config: WebsiteContentConfig, slug: string, ignoreId?: string) {
  if (!db || !slug) return true;
  const q = query(collection(db, config.collection), where('slug', '==', slug), limit(2));
  const snapshot = await getDocs(q);
  return snapshot.docs.every((snap) => snap.id === ignoreId);
}
