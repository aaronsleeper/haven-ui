// One-Family-Per-Role conformance gate. Scans components.css for any
// non-canonical color-family utility or var reference. Per DESIGN.md §Color
// and Token Steward judgment-framework.md, `sand` is the canonical warm
// neutral surface family; the alias families (stone, gray, zinc, slate,
// neutral) exist only as defensive fallbacks against Tailwind v4's cascade
// override trap — never component-facing vocabulary.
//
// Gap surfaced 2026-04-20: Aaron inspected the patched patient app and found
// `body` on stone, `.queue-sidebar` on sand, `.three-panel-shell-center` on
// gray — three token families for one "page/pane surface" role. Structural
// gates (manifest, token, visual) couldn't catch this because hex-literal
// aliasing kept the computed colors "close enough" to pass pixel diffs.
// This gate closes that gap by reading the source-of-truth CSS.
//
// Usage:
//   pnpm conform:css-family                       # default: components.css
//   pnpm conform:css-family path/to/file.css ...  # explicit files

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/components.css',
);

// Forbidden neutral-family names. Sand is canonical; these are hex-literal
// aliases in palette.css kept for defensive fallback only.
const FORBIDDEN_FAMILIES = ['stone', 'gray', 'zinc', 'slate', 'neutral'] as const;

// Tailwind color-affecting property prefixes that generate utilities from
// the color palette. Covers the full surface — background, text, border,
// ring, divide, outline, fill, stroke, accent, caret, placeholder, shadow,
// from, via, to (gradient stops). If it takes a color family, it's here.
const COLOR_PROPS = [
  'bg',
  'text',
  'border',
  'ring',
  'ring-offset',
  'divide',
  'outline',
  'fill',
  'stroke',
  'accent',
  'caret',
  'placeholder',
  'shadow',
  'from',
  'via',
  'to',
];

// Variant prefixes (pseudo-classes, modes). Can chain (e.g. dark:hover:bg-gray-50).
const VARIANT_PREFIXES = [
  'hover',
  'focus',
  'focus-visible',
  'focus-within',
  'active',
  'disabled',
  'visited',
  'checked',
  'group-hover',
  'group-focus',
  'peer-hover',
  'peer-focus',
  'peer-checked',
  'dark',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'print',
];

// Build the master utility regex. Matches:
//   [variant:]*prop-family-step
// e.g. bg-gray-500, dark:hover:text-neutral-900, placeholder:text-stone-400
const VARIANT_PART = `(?:(?:${VARIANT_PREFIXES.join('|')}):)*`;
const PROP_PART = `(?:${COLOR_PROPS.join('|')})`;
const FAMILY_PART = `(?:${FORBIDDEN_FAMILIES.join('|')})`;
const UTILITY_RE = new RegExp(
  `(?<![\\w-])${VARIANT_PART}${PROP_PART}-${FAMILY_PART}-\\d{1,3}(?:/\\d{1,3})?(?![\\w-])`,
  'g',
);

// Raw var() references into alias families: var(--color-gray-500), etc.
const VAR_RE = new RegExp(`var\\(\\s*--color-${FAMILY_PART}-\\d{1,3}\\s*(?:,[^)]*)?\\)`, 'g');

type Violation = {
  file: string;
  line: number;
  column: number;
  match: string;
  kind: 'utility' | 'var';
};

function scanFile(path: string): Violation[] {
  const source = readFileSync(path, 'utf-8');
  const lines = source.split('\n');
  const violations: Violation[] = [];
  lines.forEach((line, idx) => {
    for (const match of line.matchAll(UTILITY_RE)) {
      violations.push({
        file: path,
        line: idx + 1,
        column: (match.index ?? 0) + 1,
        match: match[0],
        kind: 'utility',
      });
    }
    for (const match of line.matchAll(VAR_RE)) {
      violations.push({
        file: path,
        line: idx + 1,
        column: (match.index ?? 0) + 1,
        match: match[0],
        kind: 'var',
      });
    }
  });
  return violations;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `one-family-per-role gate — scanning ${targets.length} file(s) for non-canonical families: ${FORBIDDEN_FAMILIES.join(', ')} (canonical: sand)`,
  );

  const allViolations: Violation[] = [];
  for (const target of targets) {
    const violations = scanFile(target);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel} — ${violations.length} violation(s)`);
  }

  if (allViolations.length > 0) {
    console.error(`\none-family-per-role gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}:${v.line}:${v.column}  [${v.kind}] ${v.match} — migrate to sand`);
    }
    console.error(
      '\n  Fix: replace non-canonical family with sand (bg-gray-50 → bg-sand-50, etc.). See Token Steward judgment-framework.md → "One family per surface role".',
    );
    process.exit(1);
  }

  console.log(`\none-family-per-role gate PASSED — all color utilities + var refs use sand`);
}

main();
