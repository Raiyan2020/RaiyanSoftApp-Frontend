import React from 'react';
import { demoteHtmlHeadings } from '@/lib/sanitize-html-headings';

interface PageHtmlContentProps {
  html?: string | null;
  className?: string;
  emptyMessage?: string;
}

export default function PageHtmlContent({ html, className, emptyMessage }: PageHtmlContentProps) {
  const content = html?.trim() ? demoteHtmlHeadings(html.trim()) : '';

  if (!content) {
    return emptyMessage ? <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p> : null;
  }

  return (
    <div
      className={`rich-text-editor-content text-sm leading-relaxed text-[var(--text-muted)] ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
