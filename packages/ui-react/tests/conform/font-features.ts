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

// Entry scripts that must add `html.fonts-loaded` via `document.fonts.ready`
// to pair with the `:where(html.fonts-loaded) body` selector in font-features.css.
// Without the runtime gate, the CSS rule never fires and Haven typography
// renders as flat fallback (regression). With the CSS gate but no runtime,
// the same regression. The pairing must exist in tandem.
const ENTRY_SCRIPTS = [
  'packages/design-system/src/scripts/main.js',
  'apps/patient/src/main.tsx',
  'apps/care-coordinator/src/main.tsx',
] as const;

function scanFile(path: string): Violation[] {
  const source = readFileSync(path, 'utf-8');

  // Match a font-feature-settings declaration; capture the selector and value.
  // The selector may be plain (`body`, `:root`, `html`) or wrapped in a
  // fonts-loaded gate (`:where(html.fonts-loaded) body`, `html.fonts-loaded body`).
  // Allow multiline value (Prettier often wraps).
  const selectorRe =
    /(?:^|[\s},])\s*([^{};]*?(?::root|body|html)[^{};]*?)\s*\{[^}]*?font-feature-settings\s*:\s*([^;}]+)/gs;
  const matches = [...source.matchAll(selectorRe)];

  if (matches.length === 0) {
    return [
      {
        file: path,
        reason:
          'no `font-feature-settings` declaration found on :root, html, or body (with or without a fonts-loaded gate). Source Sans 3 carries Haven typographic voice through these features — missing them flattens type rendering. See DESIGN.md §Typography.',
      },
    ];
  }

  // Body-level declarations MUST carry a fonts-loaded gate (Patch 76+ root-cause
  // fix). Without it, font-features fire during the Google Fonts swap window
  // and substitute fallback-font glyphs (superscripts, small caps) until the
  // brand font arrives. The :where() wrapper keeps specificity neutral.
  const cssGateViolations: Violation[] = [];
  for (const match of matches) {
    const selector = (match[1] ?? '').trim();
    // Only body-level declarations need the gate; :root/html cascading rules
    // are themselves the failure mode the gate is preventing.
    if (selector.includes('body') && !selector.includes('fonts-loaded')) {
      cssGateViolations.push({
        file: path,
        reason: `body-level font-feature-settings declaration is missing a fonts-loaded gate. Use \`:where(html.fonts-loaded) body { ... }\` so features apply only after Source Sans 3 has loaded. Without the gate, features fire on system fallback fonts during the Google Fonts swap window and produce superscript/small-caps glyphs (bug recurring across Patches 70-75; structural fix /investigate 2026-05-11). See font-features.css comment block.`,
      });
    }
  }
  if (cssGateViolations.length > 0) return cssGateViolations;

  // Union of all declared feature tags across all selectors.
  const declared = new Set<string>();
  const featureRe = /'(\w+)'\s*1/g;
  for (const match of matches) {
    const value = match[2] ?? '';
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

// Runtime gate: every registered entry script must add `html.fonts-loaded`
// via `document.fonts.ready`. Missing handler in any one of them means the
// CSS gate never trips on that surface (flat-typography regression).
function scanEntryScripts(): Violation[] {
  const violations: Violation[] = [];
  for (const rel of ENTRY_SCRIPTS) {
    const abs = resolve(MONOREPO_ROOT, rel);
    let source: string;
    try {
      source = readFileSync(abs, 'utf-8');
    } catch {
      // Entry script may not exist in all configurations (e.g., archived apps).
      // Skip silently; the brand-fonts gate covers the per-app font-link check.
      continue;
    }
    const hasReady = /document\.fonts\.ready/.test(source);
    const hasClass = /fonts-loaded/.test(source);
    if (!hasReady || !hasClass) {
      violations.push({
        file: abs,
        reason: `missing fonts-loaded runtime gate. Entry script must call \`document.fonts.ready.then(() => document.documentElement.classList.add('fonts-loaded'))\` to pair with the \`:where(html.fonts-loaded) body\` selector in base/font-features.css. Without the runtime, the CSS rule never fires and brand typography renders flat (canonical features inert).`,
      });
    }
  }
  return violations;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `font-features gate — verifying canonical Source Sans 3 feature string on ${targets.length} CSS file(s) + fonts-loaded runtime pairing on ${ENTRY_SCRIPTS.length} entry script(s). Required features: ${CANONICAL_FEATURES.join(', ')}. Forbidden on body: ${FORBIDDEN_FEATURES.join(', ')}.`,
  );

  const allViolations: Violation[] = [];

  // CSS scan
  for (const target of targets) {
    const violations = scanFile(target);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel}`);
  }

  // Runtime pairing scan — every entry script must add `html.fonts-loaded`
  // via `document.fonts.ready`. Pairs with the CSS gate above.
  const runtimeViolations = scanEntryScripts();
  allViolations.push(...runtimeViolations);
  for (const rel of ENTRY_SCRIPTS) {
    const abs = resolve(MONOREPO_ROOT, rel);
    const matched = runtimeViolations.find((v) => v.file === abs);
    if (matched) console.log(`  ✗ ${rel}  (runtime gate)`);
    else console.log(`  ✓ ${rel}  (runtime gate)`);
  }

  if (allViolations.length > 0) {
    console.error(`\nfont-features gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(
    `\nfont-features gate PASSED — canonical Source Sans 3 feature string declared with fonts-loaded gate, no forbidden features on body baseline, every entry script wires document.fonts.ready`,
  );
}

main();
