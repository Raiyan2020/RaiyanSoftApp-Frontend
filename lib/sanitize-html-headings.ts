/**
 * Demotes embedded h1 tags in CMS HTML so page-level h1 stays unique.
 */
export function demoteHtmlHeadings(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>');
}
