/**
 * Relations section UI (Phase 3, UX proposal §3).
 *
 * Renders the canonical registry as a single-scroll list filtered by anchor
 * + free-text search. Each row shows the formula (primary) + plain-language
 * description (tooltip), the resolved value for the current mode, and a
 * lock toggle.
 *
 * Local UI state (filter, search) lives in this module; clicking the lock
 * toggle calls store mutators (lockRelation / unlockRelation) which trigger
 * a global re-render.
 */

import type { Preset, ModeKey, AnchorKey, RegisteredRelation } from './types';
import { isColorRelation } from './relations';
import {
  resolveColorRelation,
  resolveNonColorRelation,
  formatColorRelation,
  formatNonColorRelation,
  describeColorRelation,
  describeNonColorRelation,
} from './relations';
import { REGISTERED_RELATIONS } from './relation-registry';
import { lockRelation, unlockRelation, isRelationLocked, getState } from './store';
import { ANCHOR_LIST } from './anchors';

// ---------------------------------------------------------------------------
// Local UI state
// ---------------------------------------------------------------------------

let filterAnchor: AnchorKey | 'all' = 'all';
let searchTerm = '';

// ---------------------------------------------------------------------------
// Filter + sort
// ---------------------------------------------------------------------------

function visible(reg: RegisteredRelation): boolean {
  if (filterAnchor !== 'all' && reg.anchorKey !== filterAnchor) return false;
  if (!searchTerm) return true;
  const q = searchTerm.toLowerCase();
  return reg.cssVar.toLowerCase().includes(q) || reg.description.toLowerCase().includes(q);
}

// ---------------------------------------------------------------------------
// Resolution helpers (for the row's value readout)
// ---------------------------------------------------------------------------

function resolveForReadout(
  reg: RegisteredRelation,
  preset: Preset,
  mode: ModeKey,
): { value: string; isColor: boolean } {
  const override = preset.relations?.[reg.cssVar];
  if (override && (override.kind === 'lock' || override.kind === 'override+lock')) {
    return { value: override.frozenValue, isColor: isColorRelation(reg.expr) };
  }
  const expr = override?.kind === 'override' ? override.expr : reg.expr;
  if (isColorRelation(expr)) {
    return { value: resolveColorRelation(expr, preset, mode), isColor: true };
  }
  const numeric = resolveNonColorRelation(expr, preset, mode);
  return { value: `${Math.round(numeric * 100) / 100}px`, isColor: false };
}

function formulaFor(reg: RegisteredRelation, preset: Preset): string {
  const override = preset.relations?.[reg.cssVar];
  const expr = override?.kind === 'override' || override?.kind === 'override+lock' ? override.expr : reg.expr;
  return isColorRelation(expr) ? formatColorRelation(expr) : formatNonColorRelation(expr);
}

function descriptionFor(reg: RegisteredRelation, preset: Preset): string {
  const override = preset.relations?.[reg.cssVar];
  const expr = override?.kind === 'override' || override?.kind === 'override+lock' ? override.expr : reg.expr;
  const stem = isColorRelation(expr) ? describeColorRelation(expr) : describeNonColorRelation(expr);
  return `${stem} ${reg.description}`;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderHeader(filtered: RegisteredRelation[]): string {
  const total = REGISTERED_RELATIONS.length;
  const anchorOptions = (['all', ...ANCHOR_LIST.map((a) => a.key)] as string[])
    .map((k) => `<option value="${k}" ${filterAnchor === k ? 'selected' : ''}>${
      k === 'all' ? 'All anchors' : ANCHOR_LIST.find((a) => a.key === k)?.label ?? k
    }</option>`)
    .join('');

  const summary = filterAnchor === 'all'
    ? `Showing all ${filtered.length} of ${total} canonical relations`
    : `Showing ${filtered.length} of ${total} — derived from ${
        ANCHOR_LIST.find((a) => a.key === filterAnchor)?.label ?? filterAnchor
      }`;

  return `
<div class="te-relations-header">
  <p class="te-relations-summary">${summary}</p>
  <div class="te-relations-controls">
    <label class="te-control-label">Filter
      <select class="te-select" data-relations-filter>${anchorOptions}</select>
    </label>
    <label class="te-control-label">Search
      <input type="search" class="te-input te-input--wide" data-relations-search
             value="${escapeAttr(searchTerm)}" placeholder="--var name or description"
             autocomplete="off">
    </label>
  </div>
</div>`;
}

function renderRow(reg: RegisteredRelation, preset: Preset, mode: ModeKey): string {
  const { value, isColor } = resolveForReadout(reg, preset, mode);
  const formula = formulaFor(reg, preset);
  const description = descriptionFor(reg, preset);
  const locked = isRelationLocked(reg.cssVar);
  const swatch = isColor
    ? `<span class="te-relation-swatch" style="background:${value}"></span>`
    : `<span class="te-relation-dimension">${escapeHtml(value)}</span>`;
  return `
<div class="te-relation-row${locked ? ' te-relation-row--locked' : ''}" data-relation-row="${escapeAttr(reg.cssVar)}">
  ${swatch}
  <div class="te-relation-cell te-relation-cell--var">
    <code class="te-relation-var">${escapeHtml(reg.cssVar)}</code>
  </div>
  <div class="te-relation-cell te-relation-cell--formula" title="${escapeAttr(description)}">
    <code class="te-relation-formula">${escapeHtml(formula)}</code>
  </div>
  <div class="te-relation-cell te-relation-cell--value">
    <code class="te-relation-value">${isColor ? escapeHtml(value) : ''}</code>
  </div>
  <button type="button" class="te-relation-lock${locked ? ' is-locked' : ''}"
          data-relation-lock-toggle="${escapeAttr(reg.cssVar)}"
          aria-pressed="${locked}"
          title="${locked ? 'Unlock — restore live derivation' : 'Lock — freeze resolved value'}">
    ${locked ? '🔒' : '🔓'}
  </button>
</div>`;
}

export function renderRelationsSection(preset: Preset, mode: ModeKey): string {
  const filtered = REGISTERED_RELATIONS.filter(visible);
  const rows = filtered.map((r) => renderRow(r, preset, mode)).join('');
  return `
${renderHeader(filtered)}
<div class="te-relations-list">
  ${rows || '<p class="te-section-placeholder">No relations match the current filter.</p>'}
</div>`;
}

// ---------------------------------------------------------------------------
// Event wiring (called after each render)
// ---------------------------------------------------------------------------

interface WireRelationsOpts {
  scheduleWrite: () => void;
  rerender: () => void;
}

export function wireRelationsEvents(root: HTMLElement, opts: WireRelationsOpts): void {
  const filterEl = root.querySelector<HTMLSelectElement>('[data-relations-filter]');
  if (filterEl) {
    filterEl.addEventListener('change', () => {
      filterAnchor = filterEl.value as AnchorKey | 'all';
      opts.rerender();
    });
  }

  const searchEl = root.querySelector<HTMLInputElement>('[data-relations-search]');
  if (searchEl) {
    let debounceTimer: number | null = null;
    searchEl.addEventListener('input', () => {
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        searchTerm = searchEl.value.trim();
        opts.rerender();
      }, 120);
    });
  }

  root.querySelectorAll<HTMLButtonElement>('[data-relation-lock-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cssVar = btn.dataset.relationLockToggle!;
      if (isRelationLocked(cssVar)) {
        unlockRelation(cssVar);
      } else {
        const s = getState();
        if (!s.preset) return;
        const reg = REGISTERED_RELATIONS.find((r) => r.cssVar === cssVar);
        if (!reg) return;
        const { value } = resolveForReadout(reg, s.preset, s.mode);
        lockRelation(cssVar, value);
      }
      opts.scheduleWrite();
    });
  });
}

// ---------------------------------------------------------------------------
// HTML escape helpers
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
