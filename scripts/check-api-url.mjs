// Guards against shipping a dev API origin in a production bundle.
//
// NEXT_PUBLIC_* values are inlined into the client bundle at build time, and
// Next resolves `.env.local` ahead of `.env` in every environment except test.
// A developer's `.env.local` pointing at a local backend therefore silently
// bakes `http://127.0.0.1:8000/api` into the deployed JS, where every request
// fails CORS. This has already shipped once.
//
// Escape hatch: ALLOW_LOCAL_API=1 for a deliberate local production build.

import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1']);

loadEnvConfig(process.cwd(), false);

const raw = process.env.NEXT_PUBLIC_API_URL;

if (!raw) {
  console.log('check-api-url: NEXT_PUBLIC_API_URL unset, falling back to the production default.');
  process.exit(0);
}

let hostname;
try {
  ({ hostname } = new URL(raw));
} catch {
  console.error(`check-api-url: NEXT_PUBLIC_API_URL is not a valid URL: ${raw}`);
  process.exit(1);
}

if (!LOCAL_HOSTS.has(hostname)) {
  console.log(`check-api-url: NEXT_PUBLIC_API_URL -> ${hostname}`);
  process.exit(0);
}

if (process.env.ALLOW_LOCAL_API === '1') {
  console.warn(`check-api-url: allowing local API origin ${raw} (ALLOW_LOCAL_API=1).`);
  process.exit(0);
}

console.error(
  [
    '',
    `check-api-url: refusing to build — NEXT_PUBLIC_API_URL points at a local backend (${raw}).`,
    '',
    'This value is inlined into the client bundle, so the deployed site would call',
    'your machine and every API request would fail CORS.',
    '',
    'Fix one of these:',
    '  - Remove or rename .env.local on the build machine (it overrides .env).',
    '  - Set NEXT_PUBLIC_API_URL to the production API, e.g. https://portal.raiyan.cc/api',
    '  - Re-run with ALLOW_LOCAL_API=1 if this build is intentionally local.',
    '',
  ].join('\n')
);
process.exit(1);
