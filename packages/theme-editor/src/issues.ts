/**
 * Issues computation — contrast + gamut warnings per preset/mode.
 *
 * Pure function: takes a preset + mode, walks the contrast-pair registry
 * and the relation registry, and produces a list of issues. Consumed by
 * the Relations row indicators, the Tokens layer's "broken" filter, the
 * status bar count, and the Issues panel slide-in.
 *
 * Phase 4 (2026-06-07) — inform-don't-enforce per UX proposal §5.
 */

import type { Preset, ModeKey, Relation } from './types';
import { REGISTERED_RELATIONS, RELATION_REGISTRY } from './relation-registry';
import {
  resolveColorRelationWithGamut,
  isColorRelation,
} from './relations';
import { CONTRAST_PAIRS } from './contrast-pairs';
import { contrastRatio, failsContrastFloor, formatRatio } from './contrast';

export interface ContrastIssue {
  kind: 'contrast';
  fgVar: string;
  bgVar: string;
  ratio: number;
  context: string;
  /** Upstream anchor key the designer could move to fix the pair. */
  upstreamHint: string;
}

export interface GamutIssue {
  kind: 'gamut';
  cssVar: string;
  context: string;
}

export type Issue = ContrastIssue | GamutIssue;

export interface IssueSet {
  contrast: ContrastIssue[];
  gamut: GamutIssue[];
  /** Quick lookup: cssVar → issues that touch it. */
  byVar: Map<string, Issue[]>;
}

// ---------------------------------------------------------------------------
// Per-var resolution that respects overrides + locks
// ---------------------------------------------------------------------------

function effectiveExpr(cssVar: string, preset: Preset): Relation | null {
  const reg = RELATION_REGISTRY[cssVar];
  if (!reg) return null;
  const override = preset.relations?.[cssVar];
  if (override?.kind === 'override' || override?.kind === 'override+lock') {
    return override.expr;
  }
  return reg.expr;
}

/**
 * Resolve a registered cssVar to its effective color value for the mode,
 * honoring overrides + locks. Returns null when the var is not a color
 * relation OR when the registration is missing.
 */
function resolveColorVar(
  cssVar: string,
  preset: Preset,
  mode: ModeKey,
): { value: string; inGamut: boolean } | null {
  const override = preset.relations?.[cssVar];
  if (override && (override.kind === 'lock' || override.kind === 'override+lock')) {
    // A frozen value is a literal string — we can't know its underlying gamut.
    // Treat locked values as in-gamut for v1; the lock acted as the designer's
    // explicit acceptance of the resolved point.
    return { value: override.frozenValue, inGamut: true };
  }
  const expr = effectiveExpr(cssVar, preset);
  if (!expr || !isColorRelation(expr)) return null;
  return resolveColorRelationWithGamut(expr, preset, mode);
}

// ---------------------------------------------------------------------------
// Upstream-anchor hint — what the designer could move to fix the pair
// ---------------------------------------------------------------------------

function upstreamFor(cssVar: string, preset: Preset): string {
  const expr = effectiveExpr(cssVar, preset);
  if (!expr || !isColorRelation(expr)) return '—';
  // Walk to find an anchor reference. For simple ops the anchor IS in scope;
  // for alpha/mix we name the inner's anchor recursively.
  switch (expr.op) {
    case 'ref':
    case 'traverse':
    case 'sib':
    case 'cross':
      return expr.anchor;
    case 'alpha':
      return innerAnchor(expr.inner);
    case 'mix':
      return `${innerAnchor(expr.a)} / ${innerAnchor(expr.b)}`;
  }
}

function innerAnchor(rel: Relation): string {
  if (!isColorRelation(rel)) return '—';
  switch (rel.op) {
    case 'ref':
    case 'traverse':
    case 'sib':
    case 'cross':
      return rel.anchor;
    case 'alpha':
      return innerAnchor(rel.inner);
    case 'mix':
      return `${innerAnchor(rel.a)} / ${innerAnchor(rel.b)}`;
  }
}

// ---------------------------------------------------------------------------
// Top-level computation
// ---------------------------------------------------------------------------

export function computeIssues(preset: Preset, mode: ModeKey): IssueSet {
  const contrast: ContrastIssue[] = [];
  const gamut: GamutIssue[] = [];

  // Contrast — walk the curated pair registry.
  for (const pair of CONTRAST_PAIRS) {
    const fg = resolveColorVar(pair.fg, preset, mode);
    const bg = resolveColorVar(pair.bg, preset, mode);
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg.value, bg.value);
    if (failsContrastFloor(ratio)) {
      contrast.push({
        kind: 'contrast',
        fgVar: pair.fg,
        bgVar: pair.bg,
        ratio,
        context: pair.context,
        upstreamHint: upstreamFor(pair.fg, preset),
      });
    }
  }

  // Gamut — walk every registered color relation; flag any whose underlying
  // OKLCH falls outside displayable sRGB.
  for (const reg of REGISTERED_RELATIONS) {
    if (!isColorRelation(reg.expr)) continue;
    const r = resolveColorVar(reg.cssVar, preset, mode);
    if (r && !r.inGamut) {
      gamut.push({
        kind: 'gamut',
        cssVar: reg.cssVar,
        context: reg.description,
      });
    }
  }

  // Index for quick "does this var have any issues?" lookups.
  const byVar = new Map<string, Issue[]>();
  const push = (key: string, issue: Issue) => {
    const list = byVar.get(key) ?? [];
    list.push(issue);
    byVar.set(key, list);
  };
  for (const c of contrast) {
    push(c.fgVar, c);
    push(c.bgVar, c);
  }
  for (const g of gamut) push(g.cssVar, g);

  return { contrast, gamut, byVar };
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

export function formatContrastTooltip(c: ContrastIssue): string {
  return `Contrast ${formatRatio(c.ratio)} — ${c.context}. Move ${c.upstreamHint} to clear AA (4.5).`;
}

export function formatGamutTooltip(g: GamutIssue): string {
  return `OKLCH point falls outside displayable sRGB — shown clamped. ${g.context}.`;
}

// ---------------------------------------------------------------------------
// Pull issue list for a single cssVar (used by row indicators).
// ---------------------------------------------------------------------------

export function issuesForVar(issues: IssueSet, cssVar: string): Issue[] {
  return issues.byVar.get(cssVar) ?? [];
}
