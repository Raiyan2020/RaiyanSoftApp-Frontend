import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

const scannedRoots = ['app', 'components', 'features', 'lib'];
const ignoredDirs = new Set(['node_modules', '.next', '.git']);

const forbiddenPatterns = [
  /from ['"]firebase\//,
  /from ['"]@\/lib\/firebase(?:-client)?['"]/,
  /from ['"]\.\/firebase(?:-client)?['"]/,
  /from ['"]\.\.\/firebase(?:-client)?['"]/,
  /NEXT_PUBLIC_FIREBASE_/,
  /\bonSnapshot\s*\(/,
  /\bcollection\s*\(\s*db\b/,
  /\bdoc\s*\(\s*db\b/,
  /\bgetDoc\s*\(/,
  /\bsetDoc\s*\(/,
  /\bupdateDoc\s*\(/,
  /\bdeleteDoc\s*\(/,
  /\baddDoc\s*\(/,
  /\buploadBytes\s*\(/,
  /\bgetDownloadURL\s*\(/,
  /\bdeleteObject\s*\(/,
];

const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }
    if ([...extensions].some((extension) => path.endsWith(extension))) {
      files.push(path);
    }
  }
  return files;
}

const violations = [];

for (const scanRoot of scannedRoots) {
  const absoluteRoot = join(root, scanRoot);
  for (const file of walk(absoluteRoot)) {
    const relativePath = relative(root, file);
    const content = readFileSync(file, 'utf8');
    const matchedPattern = forbiddenPatterns.find((pattern) => pattern.test(content));
    if (matchedPattern) {
      violations.push(`${relativePath} matched ${matchedPattern}`);
    }
  }
}

if (violations.length > 0) {
  console.error('Firebase backend usage is blocked. Use Laravel API modules instead.');
  console.error('');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Firebase backend check passed. No Firebase backend usage found.');
