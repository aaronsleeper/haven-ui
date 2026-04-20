// Font-features conformance gate. Asserts that Haven's canonical Inter
// feature string is declared on a top-level selector (`:root` or `body`)
// inside the design-system base CSS. font-feature-settings is an inherited
// property, so a root-level declaration carries to every Inter-bearing
// descendant. Missing features == flat typography == brand regression
// (DESIGN.md §Typography: "Disabling them is a regression").
//
// Gap flagged by Brand Fidelity panel review 2026-04-20: no slice-level
// proof that the canonical feature string was wired. The file existed
// (base/font-features.css, :root selector) but no gate asserted it
// against the canonical list from DESIGN.md.
//
// Usage:
//   pnpm conform:font-features                           # default target
//   pnpm conform:font-features path/to/base.css ...      # explicit

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/base/font-features.css',
);

// Canonical Inter features per DESIGN.md §Typography. Brand Fidelity 2026-04-20:
// "ss01/ss03/ss04, cv01–cv11, dlig, frac per DESIGN.md §Typography."
const CANONICAL_FEATURES = [
  'ss01',
  'ss03',
  'ss04',
  'cv01',
  'cv02',
  'cv03',
  'cv04',
  'cv05',
  'cv06',
  'cv07',
  'cv08',
  'cv09',
  'cv10',
  'cv11',
  'dlig',
  'frac',
] as const;

type Violation = {
  file: string;
  reason: string;
};

function scanFile(path: string): Violation[] {
  const source = readFileSync(path, 'utf-8');

  // Match a root-level font-feature-settings declaration on :root or body.
  // Allow multiline value (Prettier often wraps). Capture the value block.
  const selectorRe =
    /(?:^|[\s},])\s*(?::root|body|html)\s*\{[^}]*?font-feature-settings\s*:\s*([^;}]+)/gs;
  const matches = [...source.matchAll(selectorRe)];

  if (matches.length === 0) {
    return [
      {
        file: path,
        reason:
          'no `font-feature-settings` declaration found on :root, html, or body. Inter carries Haven typographic voice through these features — missing them flattens type rendering. See DESIGN.md §Typography.',
      },
    ];
  }

  // Union of all declared feature tags across all selectors.
  const declared = new Set<string>();
  const featureRe = /'(\w+)'\s*1/g;
  for (const match of matches) {
    const value = match[1] ?? '';
    for (const fm of value.matchAll(featureRe)) declared.add(fm[1]!);
  }

  const missing = CANONICAL_FEATURES.filter((f) => !declared.has(f));
  if (missing.length > 0) {
    return [
      {
        file: path,
        reason: `font-feature-settings missing canonical features: ${missing.join(', ')}. DESIGN.md §Typography requires ${CANONICAL_FEATURES.join(', ')} at minimum.`,
      },
    ];
  }

  return [];
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `font-features gate — verifying canonical Inter feature string on ${targets.length} file(s). Required: ${CANONICAL_FEATURES.join(', ')}.`,
  );

  const allViolations: Violation[] = [];
  for (const target of targets) {
    const violations = scanFile(target);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel}`);
  }

  if (allViolations.length > 0) {
    console.error(`\nfont-features gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(`\nfont-features gate PASSED — canonical Inter feature string declared`);
}

main();
