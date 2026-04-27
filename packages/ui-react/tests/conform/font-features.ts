// Font-features conformance gate. Asserts that Haven's canonical
// Source Sans 3 feature string is declared on a top-level selector
// (`:root` or `body`) inside the design-system base CSS.
// font-feature-settings is an inherited property, so a root-level
// declaration carries to every Source-Sans-3-bearing descendant.
// Missing features == flat typography == brand regression
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

// Canonical Source Sans 3 features per DESIGN.md §Typography (post-rename
// 2026-04-27). Inter-specific cv01–cv11 character variants were removed —
// those codes are not in Source Sans 3's feature table.
//
// `frac` was removed from the canonical body baseline 2026-04-27 (Patch A.5).
// Source Sans 3's `frac` engine substitutes digits with numerator-style
// glyphs in digit-adjacent prose ("Column 1" → "Column ¹", "grid-2" →
// "grid-²"), regressing pattern-library prose for cosmetic fraction support
// no plain text needs. The opt-in `.frac` semantic class in components.css
// covers actual fractional strings.
const CANONICAL_FEATURES = [
  'ss01',
  'ss03',
  'ss04',
  'dlig',
] as const;

// Features that must NOT appear on the body baseline. Regress digit-adjacent
// prose by substituting plain numerals with numerator/denominator glyphs.
// Use opt-in semantic classes (e.g. .frac in components.css) instead.
const FORBIDDEN_FEATURES = [
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
          'no `font-feature-settings` declaration found on :root, html, or body. Source Sans 3 carries Haven typographic voice through these features — missing them flattens type rendering. See DESIGN.md §Typography.',
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

  const forbiddenFound = FORBIDDEN_FEATURES.filter((f) => declared.has(f));
  if (forbiddenFound.length > 0) {
    return [
      {
        file: path,
        reason: `font-feature-settings declares forbidden features on body baseline: ${forbiddenFound.join(', ')}. These regress digit-adjacent prose (e.g. "Column 1" → "Column ¹"). Use opt-in semantic classes (.frac) for actual fractional strings instead. See font-features.css comment block.`,
      },
    ];
  }

  return [];
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `font-features gate — verifying canonical Source Sans 3 feature string on ${targets.length} file(s). Required: ${CANONICAL_FEATURES.join(', ')}. Forbidden on body: ${FORBIDDEN_FEATURES.join(', ')}.`,
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

  console.log(`\nfont-features gate PASSED — canonical Source Sans 3 feature string declared, no forbidden features on body baseline`);
}

main();
