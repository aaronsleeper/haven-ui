#!/usr/bin/env node
// spec_to_haven_svg.mjs — CSS Grid w/ interleaved label columns + JS-pinned SVG arrows.
//
// Grid structure (per Aaron 2026-06-06 — labels positioned like rectangles, edges
// pass under them, no absolute positioning for content):
//   col 1                    : lane labels
//   col 2, 4, 6, ...         : node cells (one per sequence position)
//   col 3, 5, 7, ...         : edge label cells (between adjacent nodes)
//   rows                     : one per lane
//
// Edge labels live in their own grid cells. Cross-lane labels span rows
// (grid-row: src_row / tgt_row+1). Parallel edges between same pair stack labels
// inside one cell. The SVG overlay carries edge geometry; labels' background-color
// masks the line where they overlap.
//
// Usage:
//   spec_from_markdown.py --json <use-case-dir> | node spec_to_haven_svg.mjs > out.html

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const spec = JSON.parse(readFileSync(0, 'utf8'));

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- A2 chrome-CSS extractor (per HVD §3.13 / sot-site-sop-section.md Phase 3) ---
//
// The diagram viewport chrome (controls + indicator + help + viewport frame + grid
// cursor + reduced-motion + print) lives canonical in components.css under the
// "Diagram Viewport Controls" comment block. This extractor reads that block at
// build time and inlines it into the iframe srcdoc <style> block so the iframe
// context (which can't resolve the relative <link> to main.css) renders with the
// canon CSS.
//
// Token resolution: components.css uses plain var(--token) refs. The iframe srcdoc
// has no parent CSS context, so we inject hex fallbacks via TOKEN_FALLBACKS below.
// The hex values are sourced from packages/design-system/src/styles/tokens/palette.css
// + semantic.css; if a token used in the chrome doesn't have a fallback here, the
// iframe renders with browser defaults (visible failure, not silent drift).
//
// Drift safeguards:
//   - Selector additions under .diagram-viewport/.diagram-controls/.diagram-grid/
//     .diagram-zoom-indicator/.diagram-help are automatically picked up (the
//     extractor takes everything between the start + end comment markers).
//   - If a new token reference is added to the chrome and not in TOKEN_FALLBACKS,
//     the iframe rendering is visibly broken — fail-loud, not silent-drift.
//   - If the comment markers ever move, the extractor throws at build time.
//
// Future Tier-N improvements (not v1):
//   - Auto-derive TOKEN_FALLBACKS by parsing palette.css + semantic.css
//   - Invariant tripwire pinning "every .diagram-* rule in components.css with
//     chrome prefix appears in the iframe srcdoc test artifact"

const COMPONENTS_CSS_PATH = resolve(
  __dirname,
  '../../packages/design-system/src/styles/tokens/components.css'
);

// Hex fallbacks for tokens referenced in the chrome block. Sourced from
// palette.css (sand family) and semantic.css (secondary aliases, surface-page,
// border-default). Keep in sync — see Drift safeguards above.
const TOKEN_FALLBACKS = {
  '--color-sand-50': '#f8f4ec',
  '--color-sand-100': '#e4dfd7',
  '--color-sand-200': '#cfcac2',
  '--color-sand-500': '#958e85',
  '--color-sand-700': '#5a544e',
  '--color-secondary-100': '#e4dfd7',     // = sand-100
  '--color-secondary-200': '#cfcac2',     // = sand-200
  '--color-secondary-700': '#5a544e',     // = sand-700
  '--color-surface-page': '#fbfaf8',
  '--color-border-default': '#d6cdbe',
  '--font-body': "'Source Sans 3', system-ui, sans-serif",
  '--font-mono': "'Source Code Pro', monospace",
  '--space-1': '4px',
  '--space-2': '8px',
  '--space-4': '16px',
  '--duration-fast': '100ms',
  '--ease-haven-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

function extractDiagramChromeCss() {
  const css = readFileSync(COMPONENTS_CSS_PATH, 'utf8');
  const startMarker = '/* --- Diagram Viewport Controls:';
  const endMarker = '/* --- Escalation:';
  const startIdx = css.indexOf(startMarker);
  const endIdx = css.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      'spec_to_haven_svg A2 extractor: could not locate Diagram Viewport Controls block in components.css. ' +
      'Comment markers (start: "/* --- Diagram Viewport Controls:", end: "/* --- Escalation:") may have moved.'
    );
  }
  const rawBlock = css.slice(startIdx, endIdx).trimEnd();
  // Inject hex fallbacks: var(--token) -> var(--token, #hex)
  // Only inject if not already present (existing fallbacks in source survive).
  return rawBlock.replace(/var\((--[a-z0-9-]+)\)/g, (match, token) => {
    const fallback = TOKEN_FALLBACKS[token];
    return fallback ? `var(${token}, ${fallback})` : match;
  });
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- grid placement ---
const laneIndexById = new Map(spec.lanes.map((l, i) => [l.id, i]));
const nodeSeqById = new Map(spec.nodes.map((n, i) => [n.id, i]));

const numLanes = spec.lanes.length;
const numNodes = spec.nodes.length;

// Node grid column = 2 + 2*seq (col 1 is lane label; cols 2,4,6,... are nodes)
function nodeCol(seq) { return 2 + 2 * seq; }
// Edge label col is BETWEEN source and target. For seq src→tgt where tgt > src,
// label goes at col 3 + 2*src (immediately right of source).
function labelCol(srcSeq) { return 3 + 2 * srcSeq; }

// --- group edges by (label_col, row_start, row_end) ---
// Parallel edges between same nodes share a cell. Edges from same source to
// different targets get different cells. Spanning rows handled per-edge.
const labelCells = new Map(); // key -> { col, rowStart, rowEnd, labels: [{ text, edgeIdx }] }
spec.edges.forEach((e, idx) => {
  if (!e.label) return;
  const srcSeq = nodeSeqById.get(e.from);
  const tgtSeq = nodeSeqById.get(e.to);
  if (srcSeq === undefined || tgtSeq === undefined) return;
  const srcRow = laneIndexById.get(spec.nodes[srcSeq].lane) + 1;
  const tgtRow = laneIndexById.get(spec.nodes[tgtSeq].lane) + 1;
  const rowStart = Math.min(srcRow, tgtRow);
  const rowEnd = Math.max(srcRow, tgtRow) + 1;
  const col = labelCol(srcSeq);
  const key = `${col}:${rowStart}:${rowEnd}`;
  if (!labelCells.has(key)) {
    labelCells.set(key, { col, rowStart, rowEnd, labels: [] });
  }
  labelCells.get(key).labels.push({ text: e.label, edgeIdx: idx });
});

// --- emit grid-template-columns string ---
// 90px (lane label) + [minmax(220px, 1fr) (node) + minmax(100px, 160px) (label)] * (N-1) + node
// Node tracks flex (responsive); box is hard-locked to width: 220px so cell-being-wider just adds
// empty space around a centered fixed box. Label tracks bounded so labels stay readable but
// never sprawl. Deeper defensive max on the node track waits until we move to spec-aware fr
// ratios AND relax box width (next slice).
function gridTemplateColumns(n) {
  const parts = ['90px'];
  for (let i = 0; i < n; i++) {
    parts.push('minmax(220px, 1fr)');
    if (i < n - 1) parts.push('minmax(100px, 160px)');
  }
  return parts.join(' ');
}

// Serialize edges (with source/target row indices computed from spec) for in-page JS arrow pinning
const edgesWithRows = spec.edges.map(e => {
  const srcSeq = nodeSeqById.get(e.from);
  const tgtSeq = nodeSeqById.get(e.to);
  return {
    ...e,
    srcRowIdx: srcSeq !== undefined ? laneIndexById.get(spec.nodes[srcSeq].lane) : 0,
    tgtRowIdx: tgtSeq !== undefined ? laneIndexById.get(spec.nodes[tgtSeq].lane) : 0,
  };
});
const edgesJSON = JSON.stringify(edgesWithRows);

const out = [];
out.push(`<!DOCTYPE html>`);
out.push(`<html lang="en">`);
out.push(`<head>`);
out.push(`<meta charset="UTF-8">`);
out.push(`<title>${esc(spec.title)} — Diagram (auto, grid+labels)</title>`);
out.push(`<link rel="preconnect" href="https://fonts.googleapis.com">`);
out.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);
out.push(`<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">`);
out.push(`<link rel="stylesheet" href="../../../../packages/design-system/src/styles/main.css">`);
out.push(`<script src="https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js"></script>`);
out.push(`<style>`);
out.push(`body { background: var(--color-surface-page, #fbfaf8); margin: 0; padding: 32px;`);
out.push(`       font-family: var(--font-sans, 'Source Sans 3', sans-serif);`);
out.push(`       color: var(--color-text-normal, #0d322d); }`);
out.push(`.diagram-frame-wrapper { margin: 0 auto; max-width: 1600px; }`);
out.push(`.diagram-header { margin-bottom: 24px; }`);
out.push(`.diagram-header h1 { font-family: var(--font-serif, 'Lora', serif); font-size: 28px;`);
out.push(`                     font-weight: 500; margin: 0 0 6px 0; }`);
out.push(`.diagram-header .draft-marker { font-family: var(--font-mono, 'Source Code Pro', monospace);`);
out.push(`                                color: var(--color-warm-amber-700, #735311);`);
out.push(`                                font-size: 12px; letter-spacing: 0.05em; }`);
out.push(``);
out.push(`/* Grid: interleaved node + label columns */`);
out.push(`.diagram-grid {`);
out.push(`  display: grid;`);
out.push(`  grid-template-columns: ${gridTemplateColumns(numNodes)};`);
out.push(`  grid-template-rows: repeat(${numLanes}, minmax(140px, auto));`);
out.push(`  column-gap: 8px;`);
out.push(`  row-gap: 12px;`);
out.push(`  position: relative;`);
out.push(`  padding: 24px 0;`);
out.push(`}`);
out.push(``);
out.push(`/* Lane labels (col 1) */`);
out.push(`.diagram-lane-label-cell { grid-column: 1; display: flex; align-items: center; padding-left: 12px; }`);
out.push(`.diagram-lane-label { font-family: var(--font-mono, 'Source Code Pro', monospace);`);
out.push(`                      font-size: 11px; font-weight: 600; letter-spacing: 0.12em;`);
out.push(`                      color: var(--color-text-muted, #555); }`);
out.push(``);
out.push(`/* Lane dividers */`);
out.push(`.diagram-lane-divider {`);
out.push(`  grid-column: 1 / -1;`);
out.push(`  border-top: 1px solid var(--color-border-muted, #e8dfca);`);
out.push(`  height: 0; align-self: start; margin-top: -6px; z-index: 0;`);
out.push(`}`);
out.push(``);
out.push(`/* Node cell: callout stacked above box. position:relative needed for z-index. */`);
out.push(`/* padding-top buffer keeps callouts off the lane divider boundary above. */`);
out.push(`.diagram-node-cell {`);
out.push(`  display: flex; flex-direction: column; align-items: center; justify-content: center;`);
out.push(`  gap: 6px; position: relative; z-index: 3;`);
out.push(`  padding-top: 8px;`);
out.push(`}`);
out.push(``);
out.push(`/* Callout above box — bg masks lines that cross callout area (skip-edge jogs, etc.) */`);
out.push(`.diagram-callout {`);
out.push(`  font-family: var(--font-mono, 'Source Code Pro', monospace);`);
out.push(`  font-size: 10px; font-weight: 600; letter-spacing: 0.05em;`);
out.push(`  color: var(--color-warm-amber-700, #735311);`);
out.push(`  max-width: 220px; text-align: center; line-height: 1.25;`);
out.push(`  background: var(--color-surface-page, #fbfaf8);`);
out.push(`  padding: 4px 8px; border-radius: 3px;`);
out.push(`}`);
out.push(`.diagram-callout--critical { color: var(--color-red-700, #8a2a29); }`);
out.push(`.diagram-callout--gap { color: var(--color-red-600, #a8332f); }`);
out.push(`.diagram-callout--assumption { color: var(--color-warm-sand-700, #4d4538); }`);
out.push(``);
out.push(`/* Node box */`);
out.push(`.diagram-box {`);
out.push(`  width: 220px; min-height: 90px;`);
out.push(`  display: flex; flex-direction: column; align-items: center; justify-content: center;`);
out.push(`  padding: 10px 12px 22px; box-sizing: border-box;`);
out.push(`  border: 1.5px solid var(--color-border-default, #d6cdbe);`);
out.push(`  border-radius: 4px; background: var(--color-surface-card, #fff);`);
out.push(`  text-align: center; position: relative;`);
out.push(`}`);
out.push(`.diagram-box--attestation-gate { border: 2.5px solid var(--color-primary-700, #1e5149); }`);
out.push(`.diagram-box--uncertain-tbd { border-style: dashed;`);
out.push(`  border-color: var(--color-warm-amber-500, #aa8232);`);
out.push(`  background: var(--color-warm-amber-50, #f8f1e3); }`);
out.push(`.diagram-box--uncertain-assumption { border-style: dashed;`);
out.push(`  border-color: var(--color-warm-sand-500, #7a6f5a);`);
out.push(`  background: var(--color-warm-sand-50, #faf6ee); }`);
out.push(`.diagram-box--uncertain-gap { border-style: dotted;`);
out.push(`  border-color: var(--color-red-500, #c13c3b);`);
out.push(`  background: var(--color-red-50, #ffedea); }`);
out.push(`.diagram-box-title { font-size: 13px; font-weight: 600;`);
out.push(`  color: var(--color-text-normal, #0d322d); line-height: 1.2; }`);
out.push(`.diagram-box--attestation-gate .diagram-box-title {`);
out.push(`  font-family: var(--font-serif, 'Lora', serif); font-style: italic;`);
out.push(`  font-weight: 500; color: var(--color-primary-700, #1e5149); }`);
out.push(`.diagram-box-detail { font-size: 11px; line-height: 1.3; margin-top: 2px;`);
out.push(`  color: var(--color-text-normal, #0d322d); }`);
out.push(`.diagram-box-detail.is-secondary { color: var(--color-text-muted, #555); font-size: 10px; }`);
out.push(`.diagram-box-watcher { font-family: var(--font-mono, 'Source Code Pro', monospace);`);
out.push(`  font-size: 9px; color: var(--color-text-muted, #555); letter-spacing: 0.1em;`);
out.push(`  text-transform: uppercase; position: absolute; bottom: 4px; left: 0; right: 0; text-align: center; }`);
out.push(``);
out.push(`/* Edge label cell — bg lives on the label-group wrapper (sizes to content), NOT the cell. */`);
out.push(`/* Cell-level bg would mask the full grid row height (~140px+) and cut lines at row boundaries. */`);
out.push(`/* The wrapper sizes to its contents so masking only covers the labels' actual extent. */`);
out.push(`/* position:relative needed for z-index. */`);
out.push(`.diagram-edge-label-cell {`);
out.push(`  display: flex; align-items: center; justify-content: center;`);
out.push(`  position: relative; z-index: 2; min-width: 100px;`);
out.push(`}`);
out.push(`.diagram-edge-label-group {`);
out.push(`  display: flex; flex-direction: column; align-items: stretch; gap: 0;`);
out.push(`  background: var(--color-surface-page, #fbfaf8);`);
out.push(`  border-radius: 3px;`);
out.push(`  padding: 4px 0;`);
out.push(`}`);
out.push(`.diagram-edge-label {`);
out.push(`  font-family: var(--font-mono, 'Source Code Pro', monospace);`);
out.push(`  font-size: 10px; color: var(--color-text-muted, #555);`);
out.push(`  padding: 3px 10px; line-height: 1.3;`);
out.push(`  text-align: center; white-space: normal;`);
out.push(`  max-width: 160px;`);
out.push(`  overflow-wrap: break-word; hyphens: auto;`);
out.push(`}`);
out.push(``);
out.push(`/* SVG edges overlay — under labels (z-index 1), under nodes (z-index 3) */`);
out.push(`.diagram-edges { position: absolute; top: 0; left: 0; width: 100%; height: 100%;`);
out.push(`                 pointer-events: none; z-index: 1; }`);
out.push(``);
out.push(`.diagram-meta { font-size: 13px; color: var(--color-text-muted, #555);`);
out.push(`                margin-top: 24px; padding-top: 16px;`);
out.push(`                border-top: 1px solid var(--color-border-muted, #e8dfca); max-width: 900px; }`);
out.push(``);
// Diagram viewport chrome — read from components.css canonical at build time
// (A2 extractor; HVD §3.13 Tier 1 PL promotion 2026-06-07). The block covers:
// .diagram-viewport, .diagram-grid (cursor), .diagram-controls + button + descendants,
// .diagram-zoom-indicator, .diagram-help, @media (prefers-reduced-motion: reduce),
// @media print. Token references get hex fallbacks injected so the iframe srcdoc
// context (no parent <link> resolution) renders with canon values.
out.push(extractDiagramChromeCss());
out.push(``);
// Print-only body reset — separate from the chrome block in components.css since
// body styling is renderer-scaffolding, not chrome.
out.push(`@media print { body { padding: 0; } }`);
out.push(`</style>`);
out.push(`</head>`);
out.push(`<body>`);
out.push(``);
out.push(`<div class="diagram-frame-wrapper">`);
out.push(`<header class="diagram-header">`);
out.push(`  <h1>${esc(spec.title)}</h1>`);
out.push(`  <span class="draft-marker">${esc(spec.draft_marker || '')}</span>`);
out.push(`</header>`);
out.push(``);
out.push(`<div class="diagram-viewport">`);
out.push(`  <div class="diagram-help" role="note" aria-label="Diagram keyboard shortcuts">drag · wheel zoom · +/− · 0 fit · ← → ↑ ↓ pan</div>`);
out.push(`  <div class="diagram-zoom-indicator" aria-label="Current zoom">100%</div>`);
out.push(`  <div class="diagram-controls" role="group" aria-label="Diagram pan and zoom controls">`);
out.push(`    <button type="button" class="diagram-zoom-out-btn" aria-label="Zoom out" aria-keyshortcuts="-" title="Zoom out (−)">−</button>`);
// FIT button: inline SVG (FA Pro v7 fa-arrows-to-dot path) — the iframe srcdoc
// context cannot resolve <link> to main.css, so FA's <i class="fa-solid"> font
// glyph won't render here. Inline SVG carries the same canon icon. The PL
// fragment (doc-diagram-viewport-controls.html) uses <i class="fa-solid fa-arrows-to-dot">
// since the PL preview server loads main.css; both render the same glyph.
out.push(`    <button type="button" class="diagram-fit-btn" aria-label="Fit to viewport" aria-keyshortcuts="0" title="Fit to viewport (0)">`);
out.push(`      <svg width="14" height="14" viewBox="0 0 512 512" aria-hidden="true" fill="currentColor"><path d="M256 0c17.7 0 32 14.3 32 32l0 32 32 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-64 64c-12.5 12.5-32.8 12.5-45.3 0l-64-64c-9.2-9.2-11.9-22.9-6.9-34.9S179.1 64 192 64l32 0 0-32c0-17.7 14.3-32 32-32zM169.4 393.4l64-64c12.5-12.5 32.8-12.5 45.3 0l64 64c9.2 9.2 11.9 22.9 6.9 34.9S332.9 448 320 448l-32 0 0 32c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32-32 0c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9zM32 224l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c12.5 12.5 12.5 32.8 0 45.3l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9S64 332.9 64 320l0-32-32 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm297.4 54.6c-12.5-12.5-12.5-32.8 0-45.3l64-64c9.2-9.2 22.9-11.9 34.9-6.9S448 179.1 448 192l0 32 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 32c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-64-64zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`);
out.push(`    </button>`);
out.push(`    <button type="button" class="diagram-zoom-in-btn" aria-label="Zoom in" aria-keyshortcuts="+" title="Zoom in (+)">+</button>`);
out.push(`  </div>`);
out.push(`<div class="diagram-grid">`);

// Lane labels
for (let i = 0; i < spec.lanes.length; i++) {
  out.push(`  <div class="diagram-lane-label-cell" style="grid-row: ${i + 1};">`);
  out.push(`    <span class="diagram-lane-label">${esc(spec.lanes[i].label.toUpperCase())}</span>`);
  out.push(`  </div>`);
}

// Lane dividers (between rows 2..N)
for (let i = 1; i < spec.lanes.length; i++) {
  out.push(`  <div class="diagram-lane-divider" style="grid-row: ${i + 1};"></div>`);
}

// Node cells
for (const n of spec.nodes) {
  const seq = nodeSeqById.get(n.id);
  const row = laneIndexById.get(n.lane) + 1;
  const col = nodeCol(seq);
  const modifier = n.modifier || 'default';
  const boxClasses = ['diagram-box'];
  if (modifier !== 'default') boxClasses.push(`diagram-box--${modifier}`);
  out.push(`  <div class="diagram-node-cell" style="grid-row: ${row}; grid-column: ${col};" data-node="${esc(n.id)}">`);
  if (n.callout) {
    const suffix =
      n.callout.type === 'critical' ? ' diagram-callout--critical'
      : n.callout.type === 'gap' ? ' diagram-callout--gap'
      : n.callout.type === 'assumption' ? ' diagram-callout--assumption'
      : '';
    out.push(`    <div class="diagram-callout${suffix}">${esc(n.callout.text)}</div>`);
  }
  out.push(`    <div class="${boxClasses.join(' ')}">`);
  out.push(`      <div class="diagram-box-title">${esc(n.title)}</div>`);
  if (n.detail && n.detail.length) {
    for (let i = 0; i < n.detail.length; i++) {
      const cls = i === 0 ? 'diagram-box-detail' : 'diagram-box-detail is-secondary';
      out.push(`      <div class="${cls}">${esc(n.detail[i])}</div>`);
    }
  }
  if (n.watcher) {
    out.push(`      <div class="diagram-box-watcher">▲ watches: ${esc(n.watcher)}</div>`);
  }
  out.push(`    </div>`);
  out.push(`  </div>`);
}

// Edge label cells (labels wrapped in a group so masking sizes to label extent, not full cell)
for (const cell of labelCells.values()) {
  const rowAttr = cell.rowStart === cell.rowEnd - 1
    ? `grid-row: ${cell.rowStart};`
    : `grid-row: ${cell.rowStart} / ${cell.rowEnd};`;
  out.push(`  <div class="diagram-edge-label-cell" style="${rowAttr} grid-column: ${cell.col};">`);
  out.push(`    <div class="diagram-edge-label-group">`);
  for (const l of cell.labels) {
    out.push(`      <div class="diagram-edge-label">${esc(l.text)}</div>`);
  }
  out.push(`    </div>`);
  out.push(`  </div>`);
}

// SVG overlay (populated by JS)
out.push(`  <svg class="diagram-edges" xmlns="http://www.w3.org/2000/svg"></svg>`);

out.push(`</div> <!-- /diagram-grid -->`);
out.push(`</div> <!-- /diagram-viewport -->`);

if (spec.caption) {
  out.push(``);
  out.push(`<div class="diagram-meta"><p>${esc(spec.caption)}</p></div>`);
}

out.push(`</div> <!-- /diagram-frame-wrapper -->`);
out.push(``);

// --- JS arrow pinning ---
out.push(`<script>`);
out.push(`(function() {`);
out.push(`  const EDGES = ${edgesJSON};`);
out.push(`  const CORNER_R = 24;`);
out.push(`  const PARALLEL_OFFSET = 18;`);
out.push(``);
out.push(`  function qCurvePath(points, radius) {`);
out.push(`    if (!points.length) return '';`);
out.push(`    if (points.length < 3) return points.map((p, i) => (i === 0 ? \`M \${p.x} \${p.y}\` : \`L \${p.x} \${p.y}\`)).join(' ');`);
out.push(`    const segs = [\`M \${points[0].x} \${points[0].y}\`];`);
out.push(`    for (let i = 1; i < points.length - 1; i++) {`);
out.push(`      const p0 = points[i - 1], p1 = points[i], p2 = points[i + 1];`);
out.push(`      const inDx = p1.x - p0.x, inDy = p1.y - p0.y;`);
out.push(`      const outDx = p2.x - p1.x, outDy = p2.y - p1.y;`);
out.push(`      const inIsH = Math.abs(inDy) < 0.5, outIsH = Math.abs(outDy) < 0.5;`);
out.push(`      if (inIsH === outIsH) { segs.push(\`L \${p1.x} \${p1.y}\`); continue; }`);
out.push(`      const inLen = Math.hypot(inDx, inDy), outLen = Math.hypot(outDx, outDy);`);
out.push(`      const r = Math.min(radius, inLen / 2, outLen / 2);`);
out.push(`      if (r < 8) { segs.push(\`L \${p1.x} \${p1.y}\`); continue; }`);
out.push(`      const ax = p1.x - (inDx / inLen) * r, ay = p1.y - (inDy / inLen) * r;`);
out.push(`      const dx = p1.x + (outDx / outLen) * r, dy = p1.y + (outDy / outLen) * r;`);
out.push(`      segs.push(\`L \${ax.toFixed(1)} \${ay.toFixed(1)}\`);`);
out.push(`      segs.push(\`Q \${p1.x} \${p1.y} \${dx.toFixed(1)} \${dy.toFixed(1)}\`);`);
out.push(`    }`);
out.push(`    const last = points[points.length - 1];`);
out.push(`    segs.push(\`L \${last.x} \${last.y}\`);`);
out.push(`    return segs.join(' ');`);
out.push(`  }`);
out.push(``);
out.push(`  // rectFromOffsets — getBoundingClientRect-shaped object with coords relative to grid,`);
out.push(`  // computed via offsetLeft/offsetTop. Transform-immune: pan/zoom transforms on grid`);
out.push(`  // don't affect offset* (CSS-layout coords), so arrow geometry stays correct under any`);
out.push(`  // transform applied to the grid wrapper.`);
out.push(`  function rectFromOffsets(el, grid) {`);
out.push(`    let x = 0, y = 0, cur = el;`);
out.push(`    while (cur && cur !== grid) {`);
out.push(`      x += cur.offsetLeft;`);
out.push(`      y += cur.offsetTop;`);
out.push(`      cur = cur.offsetParent;`);
out.push(`    }`);
out.push(`    const w = el.offsetWidth, h = el.offsetHeight;`);
out.push(`    return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h };`);
out.push(`  }`);
out.push(``);
out.push(`  function routeEdge(srcRect, tgtRect, gridRect, dupIdx, totalDup, edge, grid) {`);
out.push(`    const offset = totalDup > 1 ? (dupIdx - (totalDup - 1) / 2) * PARALLEL_OFFSET : 0;`);
out.push(`    const sx = srcRect.right - gridRect.left;`);
out.push(`    const sy = srcRect.top + srcRect.height / 2 - gridRect.top + offset;`);
out.push(`    const tx = tgtRect.left - gridRect.left;`);
out.push(`    const ty = tgtRect.top + tgtRect.height / 2 - gridRect.top + offset;`);
out.push(`    if (Math.abs(sy - ty) < 1) {`);
out.push(`      // Same-lane edge. If non-adjacent (long horizontal distance), jog above lane`);
out.push(`      // to clear intermediate boxes AND their callouts. Threshold: > 2*box-width (~440px).`);
out.push(`      const distance = Math.abs(tx - sx);`);
out.push(`      if (distance > 440) {`);
out.push(`        // Jog above the source row's TOP edge into the row-gap area.`);
out.push(`        // Use lane label cell as a stable row-top reference (grid-relative offsetTop).`);
out.push(`        let jogY = sy - (srcRect.height / 2 + 60); // fallback`);
out.push(`        const laneLabelCells = grid.querySelectorAll('.diagram-lane-label-cell');`);
out.push(`        const srcRowIdx = edge && typeof edge.srcRowIdx === 'number' ? edge.srcRowIdx : 0;`);
out.push(`        if (laneLabelCells.length > srcRowIdx) {`);
out.push(`          jogY = laneLabelCells[srcRowIdx].offsetTop - 4; // 4px above row's top edge, into the row gap`);
out.push(`        }`);
out.push(`        const jogOut = 20; // step out horizontally before going up`);
out.push(`        return [`);
out.push(`          {x: sx, y: sy},`);
out.push(`          {x: sx + jogOut, y: sy},`);
out.push(`          {x: sx + jogOut, y: jogY},`);
out.push(`          {x: tx - jogOut, y: jogY},`);
out.push(`          {x: tx - jogOut, y: ty},`);
out.push(`          {x: tx, y: ty}`);
out.push(`        ];`);
out.push(`      }`);
out.push(`      return [{x: sx, y: sy}, {x: tx, y: ty}];`);
out.push(`    }`);
out.push(`    const midX = (sx + tx) / 2 + offset * 0.5;`);
out.push(`    return [{x: sx, y: sy}, {x: midX, y: sy}, {x: midX, y: ty}, {x: tx, y: ty}];`);
out.push(`  }`);
out.push(``);
out.push(`  function render() {`);
out.push(`    const grid = document.querySelector('.diagram-grid');`);
out.push(`    const svg = document.querySelector('.diagram-edges');`);
out.push(`    if (!grid || !svg) return;`);
out.push(`    const w = grid.offsetWidth, h = grid.offsetHeight;`);
out.push(`    svg.setAttribute('viewBox', \`0 0 \${w} \${h}\`);`);
out.push(`    svg.setAttribute('width', w);`);
out.push(`    svg.setAttribute('height', h);`);
out.push(`    // gridRect is pseudo: offset-based coords are grid-relative, so grid is at origin.`);
out.push(`    const gridRect = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };`);
out.push(``);
out.push(`    const dupCounts = new Map();`);
out.push(`    for (const e of EDGES) { const k = e.from + '->' + e.to; dupCounts.set(k, (dupCounts.get(k) || 0) + 1); }`);
out.push(`    const dupIdx = new Map();`);
out.push(``);
out.push(`    let inner = '<defs>';`);
out.push(`    inner += '<marker id="arrow-end" viewBox="0 0 14 14" refX="13" refY="7" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto" aria-hidden="true"><path d="M 0 0 L 13 7 L 0 14" fill="none" stroke="var(--color-arrow-default, #8c7c5e)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>';`);
out.push(`    inner += '<marker id="arrow-end-emphasis" viewBox="0 0 14 14" refX="13" refY="7" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto" aria-hidden="true"><path d="M 0 0 L 13 7 L 0 14" fill="none" stroke="var(--color-primary-700, #1e5149)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></marker>';`);
out.push(`    inner += '</defs>';`);
out.push(``);
out.push(`    for (const e of EDGES) {`);
out.push(`      const srcBox = grid.querySelector(\`[data-node="\${e.from}"] .diagram-box\`);`);
out.push(`      const tgtBox = grid.querySelector(\`[data-node="\${e.to}"] .diagram-box\`);`);
out.push(`      if (!srcBox || !tgtBox) continue;`);
out.push(`      const k = e.from + '->' + e.to;`);
out.push(`      const totalDup = dupCounts.get(k);`);
out.push(`      const idx = dupIdx.get(k) || 0;`);
out.push(`      dupIdx.set(k, idx + 1);`);
out.push(`      const points = routeEdge(rectFromOffsets(srcBox, grid), rectFromOffsets(tgtBox, grid), gridRect, idx, totalDup, e, grid);`);
out.push(`      const emphasis = e.style === 'emphasis';`);
out.push(`      const muted = e.style === 'muted';`);
out.push(`      const stroke = emphasis ? 'var(--color-primary-700, #1e5149)' : 'var(--color-arrow-default, #8c7c5e)';`);
out.push(`      const strokeW = muted ? 1 : (emphasis ? 1.75 : 1.5);`);
out.push(`      const dash = muted ? ' stroke-dasharray="4 4"' : '';`);
out.push(`      const marker = emphasis ? 'arrow-end-emphasis' : 'arrow-end';`);
out.push(`      const d = qCurvePath(points, CORNER_R);`);
out.push(`      inner += \`<path d="\${d}" fill="none" stroke="\${stroke}" stroke-width="\${strokeW}"\${dash} marker-end="url(#\${marker})" aria-hidden="true"/>\`;`);
out.push(`    }`);
out.push(`    svg.innerHTML = inner;`);
out.push(`  }`);
out.push(``);
out.push(`  // Initial draw after fonts/layout settle. window.resize re-runs render() because`);
out.push(`  // a wider viewport changes the grid's natural layout (1fr columns) — arrows are`);
out.push(`  // recomputed against the new offsets. Pan/zoom does NOT trigger resize and does NOT`);
out.push(`  // affect offset coords, so the arrows stay correct under any transform.`);
out.push(`  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);`);
out.push(`  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);`);
out.push(`  else render();`);
out.push(`  window.addEventListener('resize', render);`);
out.push(`})();`);
out.push(`</script>`);
out.push(``);
out.push(`<!-- Pan/zoom init: panzoom (CDN) + initial fit-to-viewport + sets --print-zoom CSS var`);
out.push(`     so @media print scales the diagram deterministically regardless of where the user`);
out.push(`     left panzoom. Graceful degrade: if panzoom didn't load, the static --print-zoom still`);
out.push(`     applies in PDF, and the diagram renders at natural size in the browser. -->`);
out.push(`<script>`);
out.push(`(function() {`);
out.push(`  // 15in x 10in landscape @ 96dpi with 0.3in margins -> 14.4in x 9.4in content -> 1382 x 902 px`);
out.push(`  const PRINT_W = 1382, PRINT_H = 902;`);
out.push(``);
out.push(`  function computeScales(grid, viewport) {`);
out.push(`    const naturalW = grid.offsetWidth;`);
out.push(`    const naturalH = grid.offsetHeight;`);
out.push(`    const printScale = Math.min(1, PRINT_W / naturalW, PRINT_H / naturalH);`);
out.push(`    const vpRect = viewport.getBoundingClientRect();`);
out.push(`    const intScale = Math.min(vpRect.width / naturalW, vpRect.height / naturalH) * 0.96;`);
out.push(`    return { naturalW, naturalH, printScale, intScale, vpW: vpRect.width, vpH: vpRect.height };`);
out.push(`  }`);
out.push(``);
out.push(`  function setExportZoom(grid, scale) {`);
out.push(`    document.documentElement.style.setProperty('--print-zoom', scale.toFixed(3));`);
out.push(`    grid.setAttribute('data-export-zoom', scale.toFixed(3));`);
out.push(`  }`);
out.push(``);
out.push(`  function init() {`);
out.push(`    const grid = document.querySelector('.diagram-grid');`);
out.push(`    const viewport = document.querySelector('.diagram-viewport');`);
out.push(`    if (!grid || !viewport) return;`);
out.push(``);
out.push(`    // Always set the print-zoom CSS var from natural dimensions, so PDF emission has a`);
out.push(`    // deterministic value even if panzoom never inits.`);
out.push(`    const { printScale, intScale, naturalW, naturalH, vpW, vpH } = computeScales(grid, viewport);`);
out.push(`    setExportZoom(grid, printScale);`);
out.push(``);
out.push(`    const indicator = document.querySelector('.diagram-zoom-indicator');`);
out.push(`    const updateIndicator = (s) => { if (indicator) indicator.textContent = (s * 100).toFixed(0) + '%'; };`);
out.push(``);
out.push(`    if (typeof panzoom === 'undefined') {`);
out.push(`      // Graceful degrade — show natural size, no interactivity.`);
out.push(`      updateIndicator(1);`);
out.push(`      return;`);
out.push(`    }`);
out.push(``);
out.push(`    const pz = panzoom(grid, {`);
out.push(`      maxZoom: 4,`);
out.push(`      minZoom: 0.1,`);
out.push(`      bounds: false,`);
out.push(`      smoothScroll: false,`);
out.push(`      zoomDoubleClickSpeed: 1,`);
out.push(`      beforeWheel: () => false,  // wheel always zooms, no modifier required`);
out.push(`    });`);
out.push(``);
out.push(`    const fit = () => {`);
out.push(`      const m = computeScales(grid, viewport);`);
out.push(`      // Reset then apply absolute zoom + center translate.`);
out.push(`      pz.zoomAbs(0, 0, 1); pz.moveTo(0, 0);`);
out.push(`      pz.zoomAbs(0, 0, m.intScale);`);
out.push(`      const tx = (m.vpW - m.naturalW * m.intScale) / 2;`);
out.push(`      const ty = (m.vpH - m.naturalH * m.intScale) / 2;`);
out.push(`      pz.moveTo(tx, ty);`);
out.push(`      updateIndicator(m.intScale);`);
out.push(`    };`);
out.push(``);
out.push(`    pz.on('zoom', () => {`);
out.push(`      const t = pz.getTransform();`);
out.push(`      updateIndicator(t.scale);`);
out.push(`      // Note: --print-zoom stays pinned to the fit-to-print scale, not the user's`);
out.push(`      // current interactive zoom. PDF export is a deterministic snapshot, not a screenshot.`);
out.push(`    });`);
out.push(``);
out.push(`    const fitBtn  = document.querySelector('.diagram-fit-btn');`);
out.push(`    const zinBtn  = document.querySelector('.diagram-zoom-in-btn');`);
out.push(`    const zoutBtn = document.querySelector('.diagram-zoom-out-btn');`);
out.push(`    if (fitBtn)  fitBtn.onclick = fit;`);
out.push(`    if (zinBtn)  zinBtn.onclick  = () => { const r = viewport.getBoundingClientRect(); pz.smoothZoom(r.width / 2, r.height / 2, 1.25); };`);
out.push(`    if (zoutBtn) zoutBtn.onclick = () => { const r = viewport.getBoundingClientRect(); pz.smoothZoom(r.width / 2, r.height / 2, 0.8); };`);
out.push(``);
out.push(`    document.addEventListener('keydown', (e) => {`);
out.push(`      const t = e.target;`);
out.push(`      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;`);
out.push(`      const r = viewport.getBoundingClientRect();`);
out.push(`      const cx = r.width / 2, cy = r.height / 2;`);
out.push(`      if (e.key === '+' || e.key === '=') { e.preventDefault(); pz.smoothZoom(cx, cy, 1.2); }`);
out.push(`      else if (e.key === '-' || e.key === '_') { e.preventDefault(); pz.smoothZoom(cx, cy, 0.85); }`);
out.push(`      else if (e.key === '0') { e.preventDefault(); fit(); }`);
out.push(`      else if (e.key === 'ArrowLeft')  { e.preventDefault(); pz.moveBy(80, 0, true); }`);
out.push(`      else if (e.key === 'ArrowRight') { e.preventDefault(); pz.moveBy(-80, 0, true); }`);
out.push(`      else if (e.key === 'ArrowUp')    { e.preventDefault(); pz.moveBy(0, 80, true); }`);
out.push(`      else if (e.key === 'ArrowDown')  { e.preventDefault(); pz.moveBy(0, -80, true); }`);
out.push(`    });`);
out.push(``);
out.push(`    // Fit after fonts have loaded + arrows have drawn (small delay covers both).`);
out.push(`    if (document.fonts && document.fonts.ready) {`);
out.push(`      document.fonts.ready.then(() => setTimeout(fit, 150));`);
out.push(`    } else {`);
out.push(`      setTimeout(fit, 250);`);
out.push(`    }`);
out.push(``);
out.push(`    // Refresh the print-zoom CSS var whenever the natural layout changes (window resize).`);
out.push(`    window.addEventListener('resize', () => {`);
out.push(`      const m = computeScales(grid, viewport);`);
out.push(`      setExportZoom(grid, m.printScale);`);
out.push(`    });`);
out.push(`  }`);
out.push(``);
out.push(`  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);`);
out.push(`  else init();`);
out.push(`})();`);
out.push(`</script>`);
out.push(``);
out.push(`</body>`);
out.push(`</html>`);

process.stdout.write(out.join('\n'));
