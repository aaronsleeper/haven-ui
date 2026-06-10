#!/usr/bin/env node
/**
 * conform:nav-index-parity
 *
 * Verifies the PL sidebar nav (pattern-library/partials/pl-nav.html) stays in
 * parity with the pattern-library/pages/ directory. Two checks:
 *
 *   (1) Every page in pages/ is either linked from the nav OR explicitly excluded
 *       below with a reason. Catches the failure shape that motivated this gate:
 *       a page lands in pages/ but the nav doesn't surface it, so it's structurally
 *       invisible to anyone discovering primitives via the sidebar.
 *
 *   (2) Every link in the nav points to a page that exists. Catches nav rot:
 *       a page was renamed/removed but the nav still links to the old name.
 *
 * Exclusions are deliberate carve-outs, not a junk drawer. Each entry names why
 * the page is in pages/ but does NOT belong in the sidebar nav. Add to this list
 * only with a reason; otherwise add the page to pl-nav.html.
 *
 * Exit codes:
 *   0 — both checks pass
 *   1 — at least one check failed (lists are printed to stderr)
 *
 * Runs in CI and locally via `pnpm --filter @haven/design-system conform:nav-index-parity`.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const pkgRoot = resolve(__filename, '../../..'); // packages/design-system/
const pagesDir = join(pkgRoot, 'pattern-library/pages');
const navFile = join(pkgRoot, 'pattern-library/partials/pl-nav.html');

// Pages that legitimately exist in pages/ but do NOT belong in the sidebar nav.
// Each entry MUST carry a reason. Reviewer should reject additions without one.
const EXCLUDED_PAGES = [
  // Research / iteration scratch — kept for reference, not patterns to consume.
  { path: 'auto-render-escalation.html', reason: 'escalation auto-render research artifact' },
  { path: 'auto-render-weekly-checkin.html', reason: 'weekly-checkin auto-render research artifact' },
  { path: 'handauthored-escalation.html', reason: 'hand-authored escalation comparison page' },
  { path: 'diagram-color-stroke-iter.html', reason: 'diagram color/stroke iteration page' },
  { path: 'diagram-connector-iter.html', reason: 'diagram connector iteration page' },
  { path: 'diagram-text-iter.html', reason: 'diagram text iteration page' },
  // Site chrome — not patterns themselves.
  { path: 'index.html', reason: 'PL site landing page; reached via brand link' },
  // Cena Public Site working pages — only the listed composition lives in the nav.
  { path: 'cena-public/about.html', reason: 'public-site about page; not a PL primitive' },
];

const EXCLUDED_SET = new Set(EXCLUDED_PAGES.map((e) => e.path));

function listHtmlFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue; // skip _assets/, etc.
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...listHtmlFiles(full, base));
    } else if (entry.endsWith('.html')) {
      out.push(relative(base, full));
    }
  }
  return out;
}

function navPageRefs(navHtml) {
  // Match ../pages/<anything>.html (including sub-paths); strip the prefix.
  const re = /\.\.\/pages\/([^"#\s]+\.html)/g;
  const found = new Set();
  let m;
  while ((m = re.exec(navHtml)) !== null) {
    found.add(m[1]);
  }
  return found;
}

const pages = new Set(listHtmlFiles(pagesDir));
const nav = navPageRefs(readFileSync(navFile, 'utf8'));

// (1) Pages missing from nav (and not excluded).
const missingFromNav = [...pages]
  .filter((p) => !nav.has(p) && !EXCLUDED_SET.has(p))
  .sort();

// (2) Nav links pointing at non-existent pages.
const navBrokenLinks = [...nav].filter((p) => !pages.has(p)).sort();

// Bonus: excluded entries that no longer exist (stale exclusions to clean up).
const staleExclusions = EXCLUDED_PAGES
  .filter((e) => !pages.has(e.path))
  .map((e) => e.path)
  .sort();

let failed = false;

if (missingFromNav.length > 0) {
  failed = true;
  console.error(`\n[conform:nav-index-parity] FAIL — ${missingFromNav.length} page(s) in pages/ are not linked from pl-nav.html:`);
  for (const p of missingFromNav) console.error(`  - pages/${p}`);
  console.error(`\nAdd each to packages/design-system/pattern-library/partials/pl-nav.html under the right INDEX section, OR add a deliberate carve-out (with reason) to EXCLUDED_PAGES in tools/conform/nav-index-parity.mjs.`);
}

if (navBrokenLinks.length > 0) {
  failed = true;
  console.error(`\n[conform:nav-index-parity] FAIL — ${navBrokenLinks.length} nav link(s) point at non-existent pages:`);
  for (const p of navBrokenLinks) console.error(`  - ../pages/${p}`);
  console.error(`\nThe page was renamed or removed. Update pl-nav.html.`);
}

if (staleExclusions.length > 0) {
  // Stale exclusions are a hygiene issue, not a hard failure — warn and continue.
  console.error(`\n[conform:nav-index-parity] WARN — ${staleExclusions.length} EXCLUDED_PAGES entr(ies) no longer exist on disk:`);
  for (const p of staleExclusions) console.error(`  - ${p}`);
  console.error(`\nClean up tools/conform/nav-index-parity.mjs.`);
}

if (failed) {
  process.exit(1);
}

console.log(`[conform:nav-index-parity] ok — ${pages.size} pages, ${nav.size} nav links, ${EXCLUDED_PAGES.length} exclusions; parity holds.`);
