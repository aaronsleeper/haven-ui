// Brand-fonts conformance gate. Every active React app's index.html must
// load the canonical Haven font stack (Inter, Lora, JetBrains Mono) per
// DESIGN.md §Typography.
//
// Why this gate exists:
//   base/font-features.css sets a rich OpenType feature set on body (case,
//   cpsp, ordn, salt, ss01/ss03/ss04, cv01–cv11, dlig, frac). Those codes
//   are Inter-specific. When the index.html forgets to <link> the brand
//   fonts, the browser falls back to system serifs/sans (Times, Helvetica).
//   The fallback fonts have their own OpenType feature tables mapping the
//   same feature codes to DIFFERENT glyphs — often superscripts, small
//   caps, or stylistic substitutions — so body text renders as unreadable
//   jumbles of tiny raised letters. The Patient app shipped through slices
//   1 + 2 in this broken state; the bug surfaced once Aaron opened the
//   browser rather than just verifying gates + build.
//
// What the gate checks:
//   - Each apps/*/index.html (active only; archive/inactive-apps/* excluded)
//   - Contains a <link> to fonts.googleapis.com/css2
//   - That link's family params cover Inter, Lora, and JetBrains Mono
//
// Usage:
//   pnpm conform:brand-fonts
//   pnpm conform:brand-fonts path/to/index.html ...

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const APPS_ROOT = resolve(MONOREPO_ROOT, 'apps');

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

function scanFile(path: string): Violation[] {
  const source = readFileSync(path, 'utf-8');

  // Find any link to fonts.googleapis.com.
  const linkRe = /<link[^>]*href=["']([^"']*fonts\.googleapis\.com[^"']*)["'][^>]*>/gi;
  const links = [...source.matchAll(linkRe)].map((m) => m[1]!);

  if (links.length === 0) {
    return [
      {
        file: path,
        reason:
          'no <link> to fonts.googleapis.com/css2 found. Without brand fonts, font-feature-settings on body maps Inter OpenType codes onto system fallbacks and renders text as superscript / small-cap glyphs. Copy the font block from packages/design-system/src/partials/head.html.',
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

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : findActiveAppIndexes();

  if (targets.length === 0) {
    console.log('brand-fonts gate — no active apps/*/index.html found; nothing to check');
    return;
  }

  console.log(
    `brand-fonts gate — checking ${targets.length} app index(es); required: ${REQUIRED_FAMILIES.join(', ')}`,
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
    console.error(`\nbrand-fonts gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(`\nbrand-fonts gate PASSED — all app index.html files declare the canonical font stack`);
}

main();
