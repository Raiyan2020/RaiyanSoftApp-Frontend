import { websiteContentConfigs } from '@/features/admin-website/config/website-content-config';
import type { WebsiteContentItem, WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';

const configBySection = websiteContentConfigs.reduce((acc, config) => {
  acc[config.section] = config;
  return acc;
}, {} as Record<WebsiteContentSection, (typeof websiteContentConfigs)[number]>);

function parseFirestoreValue(value: any): any {
  if (!value || typeof value !== 'object') return value;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('timestampValue' in value) return Date.parse(value.timestampValue);
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(parseFirestoreValue);
  if ('mapValue' in value) {
    return Object.entries(value.mapValue.fields || {}).reduce((acc, [key, nestedValue]) => {
      acc[key] = parseFirestoreValue(nestedValue);
      return acc;
    }, {} as Record<string, any>);
  }
  return value;
}

function parseFirestoreDocument(document: any): WebsiteContentItem {
  const fields = Object.entries(document.fields || {}).reduce((acc, [key, value]) => {
    acc[key] = parseFirestoreValue(value);
    return acc;
  }, {} as Record<string, any>);
  const id = String(document.name || '').split('/').pop() || '';

  return {
    id,
    title: fields.title || 'Untitled',
    slug: fields.slug || '',
    status: fields.status || 'draft',
    order: typeof fields.order === 'number' ? fields.order : 0,
    featured: Boolean(fields.featured),
    locale: fields.locale || 'ar',
    seoTitle: fields.seoTitle || '',
    seoDescription: fields.seoDescription || '',
    ogImage: fields.ogImage || '',
    data: fields.data || {},
    approval: fields.approval || {},
    createdAt: fields.createdAt || 0,
    updatedAt: fields.updatedAt || 0,
    publishedAt: fields.publishedAt || 0,
    createdBy: fields.createdBy || '',
    updatedBy: fields.updatedBy || '',
    publishedBy: fields.publishedBy || '',
  };
}

async function fetchSectionFromFirestore(section: WebsiteContentSection): Promise<WebsiteContentItem[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const config = configBySection[section];

  if (!projectId || !apiKey || !config) return [];

  const params = new URLSearchParams({
    key: apiKey,
    pageSize: '100',
    orderBy: 'order',
  });
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${config.collection}?${params.toString()}`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) return [];

  const payload = await response.json();
  return (payload.documents || [])
    .map(parseFirestoreDocument)
    .filter((item: WebsiteContentItem) => item.status === 'published')
    .sort((a: WebsiteContentItem, b: WebsiteContentItem) => a.order - b.order);
}

export async function getPublicWebsiteContent(section: WebsiteContentSection) {
  try {
    const managedItems = await fetchSectionFromFirestore(section);
    return managedItems.length > 0 ? managedItems : websiteContentFallbacks[section];
  } catch (error) {
    console.warn(`Using fallback website content for ${section}:`, error);
    return websiteContentFallbacks[section];
  }
}

export async function getPublicWebsiteData<T>(section: WebsiteContentSection): Promise<T[]> {
  const items = await getPublicWebsiteContent(section);
  return items.map((item) => ({ slug: item.slug, title: item.title, ...item.data })) as T[];
}
