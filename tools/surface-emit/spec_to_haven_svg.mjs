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

const spec = JSON.parse(readFileSync(0, 'utf8'));

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
out.push(`        // Use lane label cell as a stable row-top reference.`);
out.push(`        let jogY = sy - (srcRect.height / 2 + 60); // fallback`);
out.push(`        const laneLabelCells = grid.querySelectorAll('.diagram-lane-label-cell');`);
out.push(`        const srcRowIdx = edge && typeof edge.srcRowIdx === 'number' ? edge.srcRowIdx : 0;`);
out.push(`        if (laneLabelCells.length > srcRowIdx) {`);
out.push(`          const cellTop = laneLabelCells[srcRowIdx].getBoundingClientRect().top - gridRect.top;`);
out.push(`          jogY = cellTop - 4; // 4px above row's top edge, into the row gap`);
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
out.push(`    const gridRect = grid.getBoundingClientRect();`);
out.push(`    const w = grid.offsetWidth, h = grid.offsetHeight;`);
out.push(`    svg.setAttribute('viewBox', \`0 0 \${w} \${h}\`);`);
out.push(`    svg.setAttribute('width', w);`);
out.push(`    svg.setAttribute('height', h);`);
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
out.push(`      const points = routeEdge(srcBox.getBoundingClientRect(), tgtBox.getBoundingClientRect(), gridRect, idx, totalDup, e, grid);`);
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
out.push(`  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);`);
out.push(`  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);`);
out.push(`  else render();`);
out.push(`  window.addEventListener('resize', render);`);
out.push(`  if (window.ResizeObserver) {`);
out.push(`    const grid = document.querySelector('.diagram-grid');`);
out.push(`    if (grid) new ResizeObserver(render).observe(grid);`);
out.push(`  }`);
out.push(`})();`);
out.push(`</script>`);
out.push(``);
out.push(`</body>`);
out.push(`</html>`);

process.stdout.write(out.join('\n'));
