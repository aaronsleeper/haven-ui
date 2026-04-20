// Source-side token resolver. Reads every *.css file in
// packages/design-system/src/styles/tokens/ (minus an exclusion list),
// parses declarations in @theme / :root / :host / html blocks via
// parseTokensCSS, and returns a flat map `{ name: resolvedValue }`.
//
// Used by source-side conformance gates that need to look up registered
// token values without spinning up a browser (contrast-pairs, etc).
// Playwright-based gates (token.spec.ts, visual.spec.ts) still need
// runtime tokens for Tailwind-default coverage; this path is source-only
// and therefore misses tokens that Tailwind tree-shakes out of the
// authored files. Acceptable tradeoff for gates whose inputs are
// author-authored rule blocks in components.css.

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTokensCSS } from './parseTokensCSS';

const HERE = resolve(fileURLToPath(import.meta.url), '..');
const DS_TOKENS_DIR = resolve(HERE, '../../../../design-system/src/styles/tokens');

// components.css is the @apply layer — contains class rules, not token
// declarations. Other @apply-layer files (if they appear) go here too.
const EXCLUDED_FILES = new Set<string>(['components.css']);

export function loadSourceTokens(dir = DS_TOKENS_DIR): Record<string, string> {
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.css') && !EXCLUDED_FILES.has(f),
  );
  const concat = files
    .map((f) => readFileSync(resolve(dir, f), 'utf-8'))
    .join('\n');
  return parseTokensCSS(concat);
}
