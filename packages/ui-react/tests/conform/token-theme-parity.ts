// Token theme-parity conformance gate. Every semantic --color-* token
// declared in semantic.css's @theme inline block must have a counterpart in
// the .dark { ... } override block, OR carry an inline `theme-invariant`
// comment at its declaration site.
//
// Why this gate exists:
//   Before this gate, dark-mode support in components.css was per-class via
//   `@apply dark:bg-sand-900` alongside a plain `background-color: var(...)`
//   reading a theme-unaware semantic token. In the cascade, plain property
//   wins over Tailwind-expanded `dark:` utilities — so the dark variant
//   didn't flip at runtime even when it was declared. The correct layer for
//   theme awareness is the token itself (.dark redefines the var value);
//   components that read it via plain `var(--)` then flip automatically.
//
//   Having two parallel expressions of intent (token and @apply dark:) drifts.
//   This gate enforces: tokens are the source of theme truth. A semantic
//   color token that doesn't declare both modes is a bug.
//
// What the gate checks:
//   - Parses semantic.css for every `--color-*` token in @theme inline blocks
//   - Parses every `.dark { ... }` block for `--color-*` overrides
//   - For each @theme token: must appear in a .dark block, OR its declaration
//     line must contain the literal text `theme-invariant` in a CSS comment
//   - Also reports stale .dark overrides: tokens not found in any @theme
//
// Usage:
//   pnpm conform:token-theme-parity
//   pnpm conform:token-theme-parity path/to/semantic.css

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/semantic.css',
);

type TokenDecl = { name: string; line: number; invariant: boolean };

function stripBlockComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
}

// Extract the body of each `@theme inline { ... }` block. Naive brace-balancing
// over the raw source is sufficient — CSS doesn't nest @theme blocks.
function extractBlocks(source: string, openPattern: RegExp): string[] {
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(openPattern.source, openPattern.flags.includes('g') ? openPattern.flags : openPattern.flags + 'g');
  while ((match = re.exec(source)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    const start = i;
    while (i < source.length && depth > 0) {
      const ch = source[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      if (depth === 0) break;
      i++;
    }
    if (depth === 0) blocks.push(source.slice(start, i));
  }
  return blocks;
}

function lineOfOffset(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

function collectColorTokens(source: string, bodies: string[]): TokenDecl[] {
  const out: TokenDecl[] = [];
  for (const body of bodies) {
    const bodyStart = source.indexOf(body);
    const decoratedRe = /(--color-[A-Za-z0-9_-]+)\s*:\s*[^;]+;([^\n]*)/g;
    let m: RegExpExecArray | null;
    while ((m = decoratedRe.exec(body)) !== null) {
      const name = m[1]!;
      const tail = m[2] ?? '';
      const invariant = /theme-invariant/i.test(tail);
      const absOffset = bodyStart + (m.index ?? 0);
      out.push({ name, line: lineOfOffset(source, absOffset), invariant });
    }
  }
  return out;
}

function main(): void {
  const args = process.argv.slice(2);
  const target = args.length > 0 ? resolve(args[0]!) : DEFAULT_TARGET;

  const rel = relative(MONOREPO_ROOT, target);
  console.log(`token-theme-parity gate — checking ${rel}`);

  const source = readFileSync(target, 'utf-8');
  const stripped = stripBlockComments(source);

  const themeBodies = extractBlocks(stripped, /@theme\s+inline\s*\{/g);
  const darkBodies = extractBlocks(stripped, /(^|[^-\w])\.dark\s*\{/g);

  if (themeBodies.length === 0) {
    console.error(`  ✗ no @theme inline { } block found in ${rel}`);
    process.exit(1);
  }

  // Tokens declared in @theme inline (from the *original* source so we can
  // see the invariant comments on the declaration line).
  const themeTokens = collectColorTokens(source, extractBlocks(source, /@theme\s+inline\s*\{/g));

  // Tokens overridden in .dark { } — ignore comments for the set-membership check.
  const darkTokens = new Set<string>();
  for (const body of darkBodies) {
    for (const m of body.matchAll(/(--color-[A-Za-z0-9_-]+)\s*:/g)) {
      darkTokens.add(m[1]!);
    }
  }

  const missing = themeTokens.filter((t) => !t.invariant && !darkTokens.has(t.name));
  const stale = [...darkTokens].filter((n) => !themeTokens.some((t) => t.name === n));

  console.log(
    `  @theme tokens: ${themeTokens.length}  .dark overrides: ${darkTokens.size}  invariant opt-outs: ${themeTokens.filter((t) => t.invariant).length}`,
  );

  if (missing.length === 0 && stale.length === 0) {
    console.log(`\ntoken-theme-parity gate PASSED — every semantic color token has a dark counterpart or is marked theme-invariant`);
    return;
  }

  console.error(`\ntoken-theme-parity gate FAILED`);
  if (missing.length > 0) {
    console.error(`  ${missing.length} token(s) missing a .dark { } override:`);
    for (const t of missing) {
      console.error(`    ${t.name}  (${rel}:${t.line})`);
    }
    console.error(`  Fix: add the token to the .dark { } block in ${rel}, or annotate the declaration with '/* theme-invariant */'.`);
  }
  if (stale.length > 0) {
    console.error(`  ${stale.length} stale .dark override(s) — no matching @theme token:`);
    for (const n of stale) console.error(`    ${n}`);
    console.error(`  Fix: remove the stale entry from the .dark { } block, or add the matching token to @theme inline.`);
  }
  process.exit(1);
}

main();
