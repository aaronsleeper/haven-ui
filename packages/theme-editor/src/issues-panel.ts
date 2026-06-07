/**
 * Issues panel — slide-in detail surface for contrast + gamut warnings.
 *
 * UX proposal §5: "Clicking the indicator (or the status bar count) slides
 * in the Issues panel — a focused list of every broken pair, each with:
 * which two variables, the computed ratio, the failing bar, and the
 * upstream anchor the user could move to fix it."
 *
 * Inform-don't-enforce: no auto-fix button. The panel names the chain,
 * the designer acts or accepts.
 *
 * Local UI state (open/closed) lives in this module — the toggle is the
 * only mutation, and the panel rerenders on every global render so its
 * content stays in sync with the live preset.
 */

import type { IssueSet } from './issues';
import { formatRatio } from './contrast';

let isOpen = false;

export function isIssuesPanelOpen(): boolean {
  return isOpen;
}

export function toggleIssuesPanel(): void {
  isOpen = !isOpen;
}

export function setIssuesPanelOpen(next: boolean): void {
  isOpen = next;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderContrastEntry(c: IssueSet['contrast'][number]): string {
  return `
<li class="te-issue te-issue--contrast">
  <div class="te-issue-head">
    <span class="te-issue-icon">⚠</span>
    <span class="te-issue-title">${escapeHtml(c.context)}</span>
    <span class="te-issue-ratio">${escapeHtml(formatRatio(c.ratio))} : 1</span>
  </div>
  <div class="te-issue-body">
    <code class="te-issue-var">${escapeHtml(c.fgVar)}</code>
    on
    <code class="te-issue-var">${escapeHtml(c.bgVar)}</code>
    — below AA (4.5). Move <strong>${escapeHtml(c.upstreamHint)}</strong> to lift the ratio.
  </div>
</li>`;
}

function renderGamutEntry(g: IssueSet['gamut'][number]): string {
  return `
<li class="te-issue te-issue--gamut">
  <div class="te-issue-head">
    <span class="te-issue-icon">◐</span>
    <span class="te-issue-title">${escapeHtml(g.context)}</span>
  </div>
  <div class="te-issue-body">
    <code class="te-issue-var">${escapeHtml(g.cssVar)}</code>
    — OKLCH point outside displayable sRGB; shown clamped.
  </div>
</li>`;
}

export function renderIssuesPanel(issues: IssueSet): string {
  if (!isOpen) return '';
  const total = issues.contrast.length + issues.gamut.length;
  const empty = total === 0
    ? '<p class="te-issues-empty">No contrast or gamut warnings on the current preset.</p>'
    : '';
  const contrastList = issues.contrast.length === 0
    ? ''
    : `<h3 class="te-issues-subhead">Contrast (${issues.contrast.length})</h3>
       <ul class="te-issues-list">${issues.contrast.map(renderContrastEntry).join('')}</ul>`;
  const gamutList = issues.gamut.length === 0
    ? ''
    : `<h3 class="te-issues-subhead">Gamut (${issues.gamut.length})</h3>
       <ul class="te-issues-list">${issues.gamut.map(renderGamutEntry).join('')}</ul>`;
  return `
<aside class="te-issues-panel" aria-label="Issues panel">
  <header class="te-issues-header">
    <h2 class="te-issues-title">Issues</h2>
    <button type="button" class="te-issues-close" data-issues-close aria-label="Close">×</button>
  </header>
  <div class="te-issues-body">
    ${empty}
    ${contrastList}
    ${gamutList}
  </div>
</aside>`;
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

export function wireIssuesPanelEvents(root: HTMLElement, rerender: () => void): void {
  const close = root.querySelector<HTMLButtonElement>('[data-issues-close]');
  if (close) {
    close.addEventListener('click', () => {
      setIssuesPanelOpen(false);
      rerender();
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
