import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase-client';
import { getWebsiteContentConfig } from '@/features/admin-website/config/website-content-config';
import type { WebsiteContentItem, WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { mapWebsiteContentDoc } from './websiteContentStore';
import { websiteContentFallbacks } from './websiteContentFallbacks';

export async function getPublishedWebsiteContent(section: WebsiteContentSection): Promise<WebsiteContentItem[]> {
  const config = getWebsiteContentConfig(section);
  if (!db || !config) return websiteContentFallbacks[section] || [];

  try {
    const q = query(
      collection(db, config.collection),
      where('status', '==', 'published'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((snap) => mapWebsiteContentDoc(snap.id, snap.data()));
    return items.length > 0 ? items : websiteContentFallbacks[section] || [];
  } catch (error) {
    console.warn(`Published website content fallback used for ${section}:`, error);
    return websiteContentFallbacks[section] || [];
  }
}

