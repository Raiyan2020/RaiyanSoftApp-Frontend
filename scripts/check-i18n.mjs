import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

const scannedRoots = ['app', 'components', 'features', 'screens', 'lib'];
const ignoredDirs = new Set(['node_modules', '.next', '.git']);

const extensions = new Set(['.tsx']);

// Physical direction utilities that must use the logical equivalent instead.
// Matched inside class-like string literals only (className="...", cn(...), clsx(...)).
const physicalDirectionPattern =
  /\b(?:pl|pr|ml|mr|left|right)-(?:\[[^\]]+\]|\d+(?:\.\d+)?|px|auto|full|screen|\d+\/\d+)\b|\btext-(?:left|right)\b/;

// A JSX text node: `>Some Text<` with no interpolation, sitting directly between tags.
// Conservative: requires a capitalized word, at least 2 words or 4+ letters, and
// excludes strings that look like code, punctuation-only, or numeric.
// (?<!=) excludes arrow-function returns like `=> Promise<void>` from matching on the `=>`.
const jsxTextNodePattern = /(?<!=)>\s*([A-Z][a-zA-Z]+(?:\s+[A-Za-z][a-zA-Z]*)*[.!?]?)\s*</g;

const ignoreCommentPattern = /i18n-ignore-next-line/;

function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
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

function isIgnoredLine(lines, lineIndex) {
  const prevLine = lines[lineIndex - 1] ?? '';
  const currentLine = lines[lineIndex] ?? '';
  return ignoreCommentPattern.test(prevLine) || ignoreCommentPattern.test(currentLine);
}

// Words/phrases that are not user-facing copy: HTML/SVG tag-ish content, common
// non-text tokens that can appear between `>` and `<` in JSX (e.g. inside comments
// stripped already, or short acronyms). Kept short and conservative.
const nonTextWords = new Set([
  'Fragment',
  'React',
  'Loading',
]);

function findViolations(file) {
  const relativePath = relative(root, file);
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const found = [];

  lines.forEach((line, index) => {
    if (isIgnoredLine(lines, index)) return;

    // (a) physical direction utilities inside className-like strings.
    const classAttrMatch = line.match(/(?:className|class)\s*=\s*(?:{[^}]*)?["'`]([^"'`]*)["'`]|cn\(([^)]*)\)|clsx\(([^)]*)\)/);
    if (classAttrMatch) {
      const classContent = classAttrMatch[1] ?? classAttrMatch[2] ?? classAttrMatch[3] ?? '';
      if (physicalDirectionPattern.test(classContent)) {
        found.push({ line: index + 1, text: line.trim(), rule: 'physical-direction-class' });
      }
    } else if (physicalDirectionPattern.test(line) && /className|class:/.test(line)) {
      found.push({ line: index + 1, text: line.trim(), rule: 'physical-direction-class' });
    }

    // (b) untranslated JSX text nodes.
    let match;
    jsxTextNodePattern.lastIndex = 0;
    while ((match = jsxTextNodePattern.exec(line)) !== null) {
      const text = match[1].trim();
      if (!text) continue;
      if (nonTextWords.has(text)) continue;
      // Skip single short acronym-like tokens (e.g. "OK", "ID") — likely intentional.
      if (text.length <= 2) continue;
      // Skip things that look like component/prop names embedded via template artifacts.
      if (/^[A-Z][a-z]*[A-Z]/.test(text) && !text.includes(' ')) continue; // PascalCase single token
      found.push({ line: index + 1, text: line.trim(), rule: 'untranslated-jsx-text', matched: text });
    }
  });

  return found.map((entry) => ({ ...entry, file: relativePath }));
}

const violations = [];

for (const scanRoot of scannedRoots) {
  const absoluteRoot = join(root, scanRoot);
  for (const file of walk(absoluteRoot)) {
    violations.push(...findViolations(file));
  }
}

if (violations.length > 0) {
  console.error('i18n check failed. Use logical direction utilities and translation helpers instead.');
  console.error('See .claude/skills/i18n/SKILL.md for the rules.');
  console.error('');
  for (const violation of violations) {
    const detail = violation.matched ? ` (text: "${violation.matched}")` : '';
    console.error(`- ${violation.file}:${violation.line} [${violation.rule}]${detail} ${violation.text}`);
  }
  console.error('');
  console.error(`${violations.length} violation(s) found. Opt out a legitimate exception with a "// i18n-ignore-next-line" comment.`);
  process.exit(1);
}

console.log('i18n check passed. No physical direction utilities or untranslated JSX text nodes found.');
