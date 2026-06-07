/**
 * Tokens layer — flat raw-variable surface (Phase 4).
 *
 * Renders every registered relation as a flat row: var name, resolved value
 * for the current mode, status badges (override / lock / contrast warn /
 * gamut warn). Filters: All / Overridden / Locked / Broken. Search by
 * var name.
 *
 * The "raw 422-var surface" in the brief refers to Obsidian's full theme
 * variable count; the editor controls the registered subset (~95). Vars
 * outside the registry stay at Obsidian defaults — a footer note names
 * the gap honestly so the user isn't misled into thinking 95 is all
 * Obsidian has.
 */

import type { Preset, ModeKey, RegisteredRelation } from './types';
import { REGISTERED_RELATIONS } from './relation-registry';
import { isColorRelation } from './relations';
import {
  resolveColorRelation,
  resolveNonColorRelation,
  formatColorRelation,
  formatNonColorRelation,
} from './relations';
import { type IssueSet, issuesForVar, formatContrastTooltip, formatGamutTooltip } from './issues';

// Total Obsidian theme variable count per the brief. The registry covers
// the ~95 the UX proposal §1 explicitly names; the remainder stay at
// Obsidian's built-in defaults.
const OBSIDIAN_TOTAL_VARS = 422;

// ---------------------------------------------------------------------------
// Local UI state
// ---------------------------------------------------------------------------

export type TokensFilter = 'all' | 'overridden' | 'locked' | 'broken';

let filter: TokensFilter = 'all';
let searchTerm = '';

// ---------------------------------------------------------------------------
// Per-row resolution (mirrors relations-ui's shape)
// ---------------------------------------------------------------------------

interface TokenRowData {
  reg: RegisteredRelation;
  value: string;
  isColor: boolean;
  formula: string;
  isOverridden: boolean;
  isLocked: boolean;
  hasIssues: boolean;
}

function buildRowData(
  reg: RegisteredRelation,
  preset: Preset,
  mode: ModeKey,
  issues: IssueSet,
): TokenRowData {
  const override = preset.relations?.[reg.cssVar];
  const isOverridden = override?.kind === 'override' || override?.kind === 'override+lock';
  const isLocked = override?.kind === 'lock' || override?.kind === 'override+lock';

  let value: string;
  let isColor: boolean;
  let formula: string;

  if (override?.kind === 'lock' || override?.kind === 'override+lock') {
    value = override.frozenValue;
    isColor = isColorRelation(reg.expr);
    const expr = override.kind === 'override+lock' ? override.expr : reg.expr;
    formula = isColorRelation(expr) ? formatColorRelation(expr) : formatNonColorRelation(expr);
  } else {
    const expr = override?.kind === 'override' ? override.expr : reg.expr;
    if (isColorRelation(expr)) {
      value = resolveColorRelation(expr, preset, mode);
      isColor = true;
      formula = formatColorRelation(expr);
    } else {
      const numeric = resolveNonColorRelation(expr, preset, mode);
      value = `${Math.round(numeric * 100) / 100}px`;
      isColor = false;
      formula = formatNonColorRelation(expr);
    }
  }

  const hasIssues = issuesForVar(issues, reg.cssVar).length > 0;
  return { reg, value, isColor, formula, isOverridden, isLocked, hasIssues };
}

// ---------------------------------------------------------------------------
// Filter + search
// ---------------------------------------------------------------------------

function visible(row: TokenRowData): boolean {
  if (filter === 'overridden' && !row.isOverridden) return false;
  if (filter === 'locked' && !row.isLocked) return false;
  if (filter === 'broken' && !row.hasIssues) return false;
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    if (!row.reg.cssVar.toLowerCase().includes(q) && !row.value.toLowerCase().includes(q)) {
      return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderHeader(
  filteredCount: number,
  totalRegistered: number,
  issues: IssueSet,
): string {
  const brokenCount = REGISTERED_RELATIONS.filter((r) => issuesForVar(issues, r.cssVar).length > 0).length;
  const unregistered = OBSIDIAN_TOTAL_VARS - totalRegistered;
  const filterOptions: Array<[TokensFilter, string]> = [
    ['all', `All (${totalRegistered})`],
    ['overridden', 'Overridden'],
    ['locked', 'Locked'],
    ['broken', `Broken (${brokenCount})`],
  ];
  const opts = filterOptions
    .map(([k, label]) =>
      `<option value="${k}" ${filter === k ? 'selected' : ''}>${escapeHtml(label)}</option>`,
    )
    .join('');
  return `
<div class="te-tokens-header">
  <p class="te-tokens-summary">Showing ${filteredCount} of ${totalRegistered} editor-controlled variables · ${unregistered} more at Obsidian defaults</p>
  <div class="te-tokens-controls">
    <label class="te-control-label">Filter
      <select class="te-select" data-tokens-filter>${opts}</select>
    </label>
    <label class="te-control-label">Search
      <input type="search" class="te-input te-input--wide" data-tokens-search
             value="${escapeAttr(searchTerm)}" placeholder="--var name or value" autocomplete="off">
    </label>
  </div>
</div>`;
}

function renderRow(row: TokenRowData, issues: IssueSet): string {
  const swatch = row.isColor
    ? `<span class="te-token-swatch" style="background:${row.value}"></span>`
    : `<span class="te-token-dimension">${escapeHtml(row.value)}</span>`;

  const badges: string[] = [];
  if (row.isOverridden) badges.push(`<span class="te-badge te-badge--overridden" title="Override expression authored on this preset">override</span>`);
  if (row.isLocked) badges.push(`<span class="te-badge te-badge--locked" title="Frozen value — upstream anchors no longer drive">locked</span>`);

  const indicatorBadges: string[] = [];
  for (const i of issuesForVar(issues, row.reg.cssVar)) {
    if (i.kind === 'contrast') {
      indicatorBadges.push(`<span class="te-indicator te-indicator--contrast" title="${escapeAttr(formatContrastTooltip(i))}">⚠</span>`);
    } else {
      indicatorBadges.push(`<span class="te-indicator te-indicator--gamut" title="${escapeAttr(formatGamutTooltip(i))}">◐</span>`);
    }
  }

  return `
<div class="te-token-row${row.hasIssues ? ' te-token-row--broken' : ''}" data-token-row="${escapeAttr(row.reg.cssVar)}">
  ${swatch}
  <div class="te-token-cell te-token-cell--var">
    <code class="te-token-var">${escapeHtml(row.reg.cssVar)}</code>
  </div>
  <div class="te-token-cell te-token-cell--value">
    <code class="te-token-value">${escapeHtml(row.value)}</code>
  </div>
  <div class="te-token-cell te-token-cell--formula" title="${escapeAttr(row.reg.description)}">
    <code class="te-token-formula">${escapeHtml(row.formula)}</code>
  </div>
  <div class="te-token-badges">${badges.join('')}${indicatorBadges.join('')}</div>
</div>`;
}

export function renderTokensSection(
  preset: Preset,
  mode: ModeKey,
  issues: IssueSet,
): string {
  const rows = REGISTERED_RELATIONS.map((r) => buildRowData(r, preset, mode, issues));
  const filtered = rows.filter(visible);
  const body = filtered.length === 0
    ? '<p class="te-section-placeholder">No tokens match the current filter.</p>'
    : filtered.map((r) => renderRow(r, issues)).join('');
  return `
${renderHeader(filtered.length, REGISTERED_RELATIONS.length, issues)}
<div class="te-tokens-list">
  ${body}
</div>`;
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

interface WireTokensOpts {
  rerender: () => void;
}

export function wireTokensEvents(root: HTMLElement, opts: WireTokensOpts): void {
  const filterEl = root.querySelector<HTMLSelectElement>('[data-tokens-filter]');
  if (filterEl) {
    filterEl.addEventListener('change', () => {
      filter = filterEl.value as TokensFilter;
      opts.rerender();
    });
  }

  const searchEl = root.querySelector<HTMLInputElement>('[data-tokens-search]');
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
