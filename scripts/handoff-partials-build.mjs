#!/usr/bin/env node
/**
 * handoff-partials-build.mjs — shared-chrome build for the Cena × UConn handoff bundle.
 *
 * Problem this solves: the static-HTML bundle copied the app shell/nav into every page,
 * so the chrome drifted and cross-surface links rotted (dead ends). This violates
 * define-once at the build layer. Here the chrome is defined ONCE (below) and injected
 * into each page's managed nav regions. Output stays flat, self-contained HTML — the
 * exact artifact Andrey consumes (no separate export stack). Idempotent: re-running
 * regenerates the managed regions from this single source.
 *
 * It also LINK-CHECKS every output: any href that resolves to a missing file (a dead end)
 * is reported and the build exits nonzero — broken navigation fails loudly, not by clicking.
 *
 * Usage:  node scripts/handoff-partials-build.mjs [--check-only]
 *
 * Canonical-pipeline note: this is the static-HTML target's realization of the pipeline's
 * define-once rule for chrome. The `target-framework: static-HTML` framework-binding should
 * mandate a partials+flatten build like this rather than per-page copy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, '../handoff/cena-uconn');
const checkOnly = process.argv.includes('--check-only');

// ---- THE CANONICAL CHROME (single source of truth) -------------------------
// All surfaces live one level deep (handoff/cena-uconn/<surface>/page.html), so
// cross-surface links are uniformly `../<surface>/<page>`.
const TABS = [
  { key: 'home',     href: '../home/home.caught-up.html',   icon: 'fa-solid fa-house',   label: 'Home' },
  { key: 'order',    href: '../order/order.browse.html',    icon: 'fa-solid fa-utensils', label: 'Order' },
  { key: 'activity', href: '../activity/activity.list.html', icon: 'fa-regular fa-bell',  label: 'Activity' },
];
const TALK_HREF = '../talk/talk-to-person.html';

const activeAttrs = (isActive) => isActive ? ' active" aria-current="page"' : '"';
const navItem = (t, active, cls) =>
  `<a href="${t.href}" class="${cls}${active === t.key ? ' active' : ''}"${active === t.key ? ' aria-current="page"' : ''}><i class="${t.icon}" aria-hidden="true"></i><span>${t.label}</span></a>`;

const SIDEBAR = (active) => `<nav class="app-shell-sidebar" aria-label="Primary">
        <div class="nav-header">
          <div class="nav-logo">
            <img src="../assets/logo-cena.svg" alt="Cena Health" />
          </div>
        </div>
        <div class="nav-section">
          ${TABS.map(t => navItem(t, active, 'nav-item')).join('\n          ')}
        </div>
        <div class="nav-section nav-section--pinned-bottom">
          <a href="${TALK_HREF}" class="nav-item"><i class="fa-regular fa-circle-question" aria-hidden="true"></i><span>Talk to a person</span></a>
          <div class="nav-item">
            <div class="nav-avatar">MR</div>
            <span>Maria Rivera</span>
          </div>
        </div>
      </nav>`;

const BOTTOM = (active) => `<nav class="mobile-bottom-nav" aria-label="Primary">
            ${TABS.map(t => navItem(t, active, 'mobile-bottom-nav-tab')).join('\n            ')}
          </nav>`;

// which tab is active for a given surface folder ('' = none; surface is a pushed flow / door)
const ACTIVE_FOR = (surface) =>
  surface === 'home' ? 'home'
  : ['order', 'order-status', 'meals'].includes(surface) ? 'order'
  : surface === 'activity' ? 'activity'
  : '';

// ---- file walk -------------------------------------------------------------
const htmlFiles = [];
for (const surface of readdirSync(BUNDLE)) {
  const dir = join(BUNDLE, surface);
  if (!statSync(dir).isDirectory() || surface === 'assets' || surface.startsWith('_')) continue;
  for (const f of readdirSync(dir)) if (f.endsWith('.html')) htmlFiles.push({ surface, path: join(dir, f) });
}

// ---- pass 1: inject chrome into managed regions ----------------------------
let rewritten = 0;
if (!checkOnly) {
  for (const { surface, path } of htmlFiles) {
    let txt = readFileSync(path, 'utf8');
    const before = txt;
    const active = ACTIVE_FOR(surface);
    // replace the sidebar nav block (single <nav class="app-shell-sidebar">...</nav>, no nesting)
    if (/<nav class="app-shell-sidebar"/.test(txt))
      txt = txt.replace(/<nav class="app-shell-sidebar"[\s\S]*?<\/nav>/, SIDEBAR(active));
    // replace the bottom nav block
    if (/<nav class="mobile-bottom-nav"/.test(txt))
      txt = txt.replace(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/, BOTTOM(active));
    if (txt !== before) { writeFileSync(path, txt); rewritten++; }
  }
  console.log(`chrome injected into ${rewritten} pages from the single partial source`);
}

// ---- pass 2: link-check (dead-end detector) --------------------------------
const allFiles = new Set();
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : allFiles.add(resolve(p)); } };
walk(BUNDLE);
allFiles.add(resolve(BUNDLE, 'index.html'));

const HREF = /(?:href|data-nav)="([^"]+)"/g; // data-nav is navigation too (flow-actions.js)
const deadends = [];
const stubs = [];
const checkTargets = [...htmlFiles.map(f => f.path), join(BUNDLE, 'index.html')];
for (const file of checkTargets) {
  if (!existsSync(file)) continue;
  const txt = readFileSync(file, 'utf8');
  let m;
  while ((m = HREF.exec(txt))) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href === '#' || href.startsWith('#')) { stubs.push({ file: relative(BUNDLE, file), href }); continue; }
    const target = resolve(dirname(file), href.split('#')[0]);
    if (!allFiles.has(target)) deadends.push({ file: relative(BUNDLE, file), href });
  }
}

console.log(`\nlink-check: ${checkTargets.length} pages scanned`);
if (stubs.length) console.log(`  ${stubs.length} intentional "#" stub link(s) (not yet built)`);
if (deadends.length) {
  console.log(`  ✗ ${deadends.length} BROKEN link(s) — point to a missing file:`);
  for (const d of deadends) console.log(`     ${d.file}  →  ${d.href}`);
  process.exit(1);
}
console.log('  ✓ no broken links — every relative href resolves to an existing file');
