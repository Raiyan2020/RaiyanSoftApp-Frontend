const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

/**
 * Flattens CMS rich-text HTML to plain text for clamped card previews.
 * Block/line breaks become spaces so list items don't run together.
 */
export function htmlToText(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, entity: string) => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
}
