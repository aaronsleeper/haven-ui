// Brand-fonts conformance gate. Every active React app's index.html AND
// every standalone pattern-library HTML file (one with its own <head>) must
// load the canonical Haven font stack (Inter, Lora, JetBrains Mono) per
// DESIGN.md §Typography.
//
// Why this gate exists:
//   base/font-features.css sets a rich OpenType feature set on body (case,
//   cpsp, ordn, salt, ss01/ss03/ss04, cv01–cv11, dlig, frac). Those codes
//   are Inter-specific. When a page forgets to <link> the brand fonts, the
//   browser falls back to system serifs/sans (Times, Helvetica). Fallback
//   fonts map the same feature codes to DIFFERENT glyphs — often
//   superscripts, small caps, or stylistic substitutions — so body text
//   renders as unreadable jumbles of tiny raised letters. The Patient app
//   shipped through slices 1 + 2 in this broken state; the bug surfaced
//   once Aaron opened the browser rather than just verifying gates + build.
//
//   Original scope was apps/*/index.html only. On 2026-04-24 the superscript
//   bug recurred inside the pattern library itself — the bare
//   three-panel-shell.html demo defined its own raw <head> and linked
//   main.css but not the Google Fonts URL. The gate had a scope hole. Now
//   closed: any standalone PL HTML file (one declaring its own <head>) is
//   in scope.
//
// What the gate checks (per file):
//   - If the file delegates to partials/pl-head.html via <load src>, it
//     passes (that partial owns the canonical font block — verified here).
//   - Otherwise: contains a <link> to fonts.googleapis.com/css2 whose
//     family params cover Inter, Lora, and JetBrains Mono.
//
// Scope:
//   - Each apps/*/index.html (active only; archive/inactive-apps/* excluded)
//   - Each packages/design-system/pattern-library/**/*.html that declares
//     its own <head> (fragments without <head> are skipped — they're
//     included by a page that owns the <head>).
//
// Usage:
//   pnpm conform:brand-fonts
//   pnpm conform:brand-fonts path/to/file.html ...

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const APPS_ROOT = resolve(MONOREPO_ROOT, 'apps');
const PL_ROOT = resolve(MONOREPO_ROOT, 'packages/design-system/pattern-library');
const PL_HEAD_PARTIAL = resolve(PL_ROOT, 'partials/pl-head.html');

const REQUIRED_FAMILIES = ['Inter', 'Lora', 'JetBrains Mono'] as const;

type Violation = {
  file: string;
  reason: string;
};

function findActiveAppIndexes(): string[] {
  if (!statSync(APPS_ROOT, { throwIfNoEntry: false })?.isDirectory()) return [];
  const out: string[] = [];
  for (const entry of readdirSync(APPS_ROOT)) {
    const appDir = join(APPS_ROOT, entry);
    const stat = statSync(appDir, { throwIfNoEntry: false });
    if (!stat?.isDirectory()) continue;
    const indexPath = join(appDir, 'index.html');
    const idxStat = statSync(indexPath, { throwIfNoEntry: false });
    if (idxStat?.isFile()) out.push(indexPath);
  }
  return out;
}

// Recursively collect every .html file under a root.
function walkHtml(root: string): string[] {
  const stat = statSync(root, { throwIfNoEntry: false });
  if (!stat?.isDirectory()) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const child = join(root, entry);
    const childStat = statSync(child, { throwIfNoEntry: false });
    if (!childStat) continue;
    if (childStat.isDirectory()) {
      out.push(...walkHtml(child));
    } else if (childStat.isFile() && child.endsWith('.html')) {
      out.push(child);
    }
  }
  return out;
}

// Standalone = file declares its own <head>. Fragments that are <load>-included
// by a page don't own their <head>, so they're out of scope.
function findStandalonePatternLibraryFiles(): string[] {
  const out: string[] = [];
  for (const path of walkHtml(PL_ROOT)) {
    // Don't scan the partial itself recursively — it's the canonical source.
    if (resolve(path) === PL_HEAD_PARTIAL) continue;
    const source = readFileSync(path, 'utf-8');
    if (/<head[\s>]/i.test(source)) out.push(path);
  }
  return out;
}

// A file that delegates its <head> to pl-head.html via the Vite <load> include
// picks up the canonical font block at serve/build time. Treat as compliant.
function delegatesToPlHead(source: string): boolean {
  return /<load\s+src=["'][^"']*partials\/pl-head\.html["']\s*\/?>/i.test(source);
}

// Opt-out marker for PL files that legitimately don't render body copy in the
// brand-fonts regime — e.g. meta-refresh redirects with empty <body>, or stale
// comparison artifacts that deliberately link a different font stack for
// side-by-side contrast. Must carry a reason so later readers know why the
// exemption exists and whether it's still valid.
//
// Format (anywhere in the file, HTML comment):
//   <!-- @brand-fonts-exempt: <reason> -->
function getBrandFontsExemptReason(source: string): string | null {
  const match = source.match(/@brand-fonts-exempt:\s*([^\n>]+?)(?:\s*-->|\n)/i);
  if (!match) return null;
  const reason = match[1]!.trim();
  return reason.length > 0 ? reason : '(no reason given)';
}

function scanFile(path: string): Violation[] {
  const source = readFileSync(path, 'utf-8');

  if (delegatesToPlHead(source)) return [];

  // Find any link to fonts.googleapis.com.
  const linkRe = /<link[^>]*href=["']([^"']*fonts\.googleapis\.com[^"']*)["'][^>]*>/gi;
  const links = [...source.matchAll(linkRe)].map((m) => m[1]!);

  if (links.length === 0) {
    return [
      {
        file: path,
        reason:
          'no <link> to fonts.googleapis.com/css2 and no <load src="../partials/pl-head.html"> found. Without brand fonts, font-feature-settings on body maps Inter OpenType codes onto system fallbacks and renders text as superscript / small-cap glyphs. Either inline the Google Fonts <link> for Inter + Lora + JetBrains Mono, or delegate <head> to partials/pl-head.html.',
      },
    ];
  }

  // Take the union of family names mentioned across all detected links.
  const familiesFound = new Set<string>();
  for (const href of links) {
    for (const match of href.matchAll(/family=([^&]+)/g)) {
      const raw = match[1]!;
      // Strip the :ital,wght@... suffix — keep everything before the first colon.
      const familyName = decodeURIComponent(raw).split(':')[0]!.replace(/\+/g, ' ').trim();
      if (familyName) familiesFound.add(familyName);
    }
  }

  const missing = REQUIRED_FAMILIES.filter((f) => !familiesFound.has(f));
  if (missing.length > 0) {
    return [
      {
        file: path,
        reason: `Google Fonts <link> found but missing families: ${missing.join(', ')}. DESIGN.md §Typography requires ${REQUIRED_FAMILIES.join(' + ')}.`,
      },
    ];
  }

  return [];
}

// The partial that every delegating PL file points to must itself carry the
// canonical font block. Verify it directly so delegation stays trustworthy.
function verifyPlHeadPartial(): Violation[] {
  if (!statSync(PL_HEAD_PARTIAL, { throwIfNoEntry: false })?.isFile()) {
    return [
      {
        file: PL_HEAD_PARTIAL,
        reason:
          'partials/pl-head.html is missing — PL files that <load>-delegate rely on this partial to carry the canonical font block.',
      },
    ];
  }
  return scanFile(PL_HEAD_PARTIAL);
}

function main(): void {
  const args = process.argv.slice(2);
  const targets =
    args.length > 0
      ? args.map((a) => resolve(a))
      : [...findActiveAppIndexes(), ...findStandalonePatternLibraryFiles()];

  if (targets.length === 0) {
    console.log('brand-fonts gate — no active apps/*/index.html or standalone PL files found; nothing to check');
    return;
  }

  console.log(
    `brand-fonts gate — checking ${targets.length} file(s) (apps/*/index.html + standalone pattern-library HTML); required: ${REQUIRED_FAMILIES.join(', ')}`,
  );

  const allViolations: Violation[] = [];

  // Verify the partial once up front — if it's broken, every delegating file is broken.
  const partialViolations = args.length > 0 ? [] : verifyPlHeadPartial();
  allViolations.push(...partialViolations);
  if (partialViolations.length > 0) {
    const rel = relative(MONOREPO_ROOT, PL_HEAD_PARTIAL);
    console.log(`  ✗ ${rel}  (canonical partial — blocks all delegating files)`);
  }

  for (const target of targets) {
    const rel = relative(MONOREPO_ROOT, target);
    const exemptReason = getBrandFontsExemptReason(readFileSync(target, 'utf-8'));
    if (exemptReason !== null) {
      console.log(`  ⚪ ${rel}  exempt: ${exemptReason}`);
      continue;
    }
    const violations = scanFile(target);
    allViolations.push(...violations);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel}`);
  }

  if (allViolations.length > 0) {
    console.error(`\nbrand-fonts gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(`\nbrand-fonts gate PASSED — every app index and standalone PL page declares (or delegates) the canonical font stack`);
}

main();
