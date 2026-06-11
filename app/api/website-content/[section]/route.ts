import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { websiteContentFallbacks } from '@/lib/websiteContentFallbacks';
import type { WebsiteContentApiDocument, WebsiteContentStore } from '@/lib/website-content-api';
import type { WebsiteContentSection } from '@/features/admin-website/types/website-content';

const DATA_DIR = join(process.cwd(), '.data');
const DATA_FILE = join(DATA_DIR, 'website-content.json');

function toDocument(item: any): WebsiteContentApiDocument {
  return {
    ...item,
    data: item.data || {},
  };
}

async function readStore(): Promise<WebsiteContentStore> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw) as WebsiteContentStore;
  } catch {
    const seeded = Object.entries(websiteContentFallbacks).reduce((acc, [section, items]) => {
      acc[section as WebsiteContentSection] = items.map(toDocument);
      return acc;
    }, {} as WebsiteContentStore);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(seeded, null, 2), 'utf8');
    return seeded;
  }
}

async function writeStore(store: WebsiteContentStore) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const store = await readStore();
  const items = store[section as WebsiteContentSection] || [];
  return NextResponse.json({ status: true, message: 'ok', data: items });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const body = await request.json();
  const store = await readStore();
  const items = store[section as WebsiteContentSection] || [];
  const id = body.id || `${section}-${Date.now()}`;
  const nextItem = toDocument({ ...body, id, updatedAt: Date.now(), createdAt: body.createdAt || Date.now() });
  const index = items.findIndex((item) => item.id === id);
  if (index >= 0) items[index] = nextItem;
  else items.unshift(nextItem);
  store[section as WebsiteContentSection] = items;
  await writeStore(store);
  return NextResponse.json({ status: true, message: 'saved', data: id });
}
