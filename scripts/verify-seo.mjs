/**
 * Smoke test for public SEO routes after build.
 * Usage: node scripts/verify-seo.mjs [baseUrl]
 */
const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/services/mobile-app-development',
  '/portfolio',
  '/blogs',
  '/blogs/estimate-digital-product-cost',
  '/pricing',
  '/contact',
  '/quote',
  '/consultation',
  '/faq',
  '/testimonials',
  '/partners',
  '/team',
  '/careers',
  '/privacy',
  '/terms',
];

const privateRoutes = ['/admin', '/home', '/login', '/profile'];

function countMatches(html, pattern) {
  const re = new RegExp(pattern, 'gi');
  return (html.match(re) || []).length;
}

async function checkRoute(path) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const h1Count = countMatches(html, '<h1[\\s>]');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';

  return { path, status: res.status, title, description, ogTitle, canonical, h1Count, robots, ok: res.ok };
}

async function main() {
  console.log(`Verifying SEO at ${baseUrl}\n`);

  const robotsRes = await fetch(`${baseUrl}/robots.txt`);
  const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
  console.log(`robots.txt: ${robotsRes.status}`);
  console.log(`sitemap.xml: ${sitemapRes.status}`);

  if (!robotsRes.ok || !sitemapRes.ok) {
    console.error('robots.txt or sitemap.xml missing');
    process.exit(1);
  }

  let failures = 0;

  for (const path of publicRoutes) {
    const result = await checkRoute(path);
    const issues = [];
    if (!result.ok) issues.push(`status ${result.status}`);
    if (!result.title) issues.push('missing title');
    if (!result.description) issues.push('missing description');
    if (!result.ogTitle) issues.push('missing og:title');
    if (!result.canonical) issues.push('missing canonical');
    if (result.h1Count !== 1) issues.push(`h1 count=${result.h1Count} (expected 1)`);
    if (result.robots.includes('noindex')) issues.push('unexpected noindex');

    const status = issues.length ? 'FAIL' : 'OK';
    if (issues.length) failures += 1;
    console.log(`${status} ${path} — ${issues.join(', ') || result.title}`);
  }

  for (const path of privateRoutes) {
    const result = await checkRoute(path);
    const noIndex = result.robots.includes('noindex');
    console.log(`${noIndex ? 'OK' : 'FAIL'} ${path} — robots=${result.robots || 'none'}`);
    if (!noIndex) failures += 1;
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed`);
    process.exit(1);
  }

  console.log('\nAll SEO checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
