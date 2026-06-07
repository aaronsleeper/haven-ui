/**
 * Relation operators + resolver (Phase 3).
 *
 * Pure functions over the typed Relation AST. Color operators resolve to
 * `{ hex }`; non-color operators resolve to `{ px }` (dimensions) or
 * `{ value }` (strings — font families, named stops, etc.).
 *
 * Stop-name convention:
 *   The AST stores Haven canonical stop NAMES (50, 100, 200, ..., 950) per
 *   UX proposal §2 examples. The slider-position used by the picker + family
 *   resolution is the INVERSE (slider 0 = stop 950, slider 100 = stop 50).
 *   `stopNameToSlider()` converts between the two so the AST stays readable.
 */

import type {
  Preset,
  ModeKey,
  ColorRelation,
  NonColorRelation,
  ColorAnchorRef,
  ColorAnchorValue,
  FamilySlug,
  TypeAnchorRef,
  ShapeAnchorRef,
} from './types';
import { valueForMode } from './types';
import { resolveStop } from './color';

// ---------------------------------------------------------------------------
// Stop-name ↔ slider-position conversion
// ---------------------------------------------------------------------------

const CANONICAL_STOPS: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Convert a Haven canonical stop name (50–950) into the picker's 0–100
 * slider position. Stop 50 = slider 100 (lightest), stop 950 = slider 0
 * (darkest), stop 500 = slider 50 (root).
 */
export function stopNameToSlider(stopName: number): number {
  if (stopName === 50) return 100;
  if (stopName === 950) return 0;
  return 100 - stopName / 10;
}

/** Inverse — slider position to canonical stop name (rounded to nearest). */
export function sliderToStopName(slider: number): number {
  if (slider >= 100) return 50;
  if (slider <= 0) return 950;
  const stop = (100 - slider) * 10;
  // Snap to nearest canonical stop.
  let nearest = CANONICAL_STOPS[0];
  let dist = Math.abs(stop - nearest);
  for (const s of CANONICAL_STOPS) {
    const d = Math.abs(stop - s);
    if (d < dist) { dist = d; nearest = s; }
  }
  return nearest;
}

// ---------------------------------------------------------------------------
// Color anchor resolution — read the family + current stop for a mode
// ---------------------------------------------------------------------------

/** Resolve a ColorAnchorRef to its current ColorAnchorValue for the given mode. */
export function resolveColorAnchor(
  ref: ColorAnchorRef,
  preset: Preset,
  mode: ModeKey,
): ColorAnchorValue {
  const a = preset.anchors;
  if (ref === 'surface') return valueForMode(a.surface, mode);
  if (ref === 'ink') return valueForMode(a.ink, mode);
  if (ref === 'accent') return valueForMode(a.accent, mode);
  if (ref === 'companion') return valueForMode(a.companion.value, mode);
  if (ref.startsWith('signals.')) {
    const key = ref.slice('signals.'.length) as keyof typeof a.signals;
    return valueForMode(a.signals[key], mode);
  }
  throw new Error(`unknown color anchor ref: ${ref}`);
}

// ---------------------------------------------------------------------------
// Color operators — pure functions over the Relation AST
// ---------------------------------------------------------------------------

/**
 * ref(anchor, stop) — Pick a specific named stop of an anchor's family.
 * Stop name is converted to slider position for OKLCH resolution.
 */
function opRef(
  anchorRef: ColorAnchorRef,
  stopName: number,
  preset: Preset,
  mode: ModeKey,
): string {
  const anchor = resolveColorAnchor(anchorRef, preset, mode);
  return resolveStop(anchor.family, stopNameToSlider(stopName)).hex;
}

/**
 * traverse(anchor, ±Δ) — Walk Δ canonical stops from the anchor's current
 * stop. delta=+1 → one stop lighter; delta=-1 → one stop darker.
 */
function opTraverse(
  anchorRef: ColorAnchorRef,
  delta: number,
  preset: Preset,
  mode: ModeKey,
): string {
  const anchor = resolveColorAnchor(anchorRef, preset, mode);
  const nextSlider = Math.max(0, Math.min(100, anchor.stop + delta * 10));
  return resolveStop(anchor.family, nextSlider).hex;
}

/** sib(anchor, [±Δ]) — convenience for traverse with default delta=+1. */
function opSib(
  anchorRef: ColorAnchorRef,
  delta: number | undefined,
  preset: Preset,
  mode: ModeKey,
): string {
  return opTraverse(anchorRef, delta ?? 1, preset, mode);
}

/**
 * cross(other-anchor, stop) — Pull a specific named stop from a different
 * anchor's family. The function name advertises the family-change at the
 * call site (UX proposal §2).
 */
function opCross(
  anchorRef: ColorAnchorRef,
  stopName: number,
  preset: Preset,
  mode: ModeKey,
): string {
  // Same shape as ref but semantically advertises cross-family. The
  // resolution mechanics are identical.
  return opRef(anchorRef, stopName, preset, mode);
}

/**
 * alpha(inner, 0..1) — Apply an opacity overlay. Returns an `rgba()` string
 * that the emitter can use directly in the CSS variable value.
 */
function opAlpha(
  inner: ColorRelation,
  opacity: number,
  preset: Preset,
  mode: ModeKey,
): string {
  const hex = resolveColorRelation(inner, preset, mode);
  return hexToRgba(hex, Math.max(0, Math.min(1, opacity)));
}

/**
 * mix(a, b, t) — Linear interpolation in OKLCH between two resolved colors.
 * t=0 returns a, t=1 returns b. v1 implementation: linear in sRGB hex
 * (cheaper, close-enough for v1; OKLCH-correct mix lands when culori's
 * `interpolate` helper gets wired in Phase 3.x).
 */
function opMix(
  a: ColorRelation,
  b: ColorRelation,
  t: number,
  preset: Preset,
  mode: ModeKey,
): string {
  const hexA = resolveColorRelation(a, preset, mode);
  const hexB = resolveColorRelation(b, preset, mode);
  const tt = Math.max(0, Math.min(1, t));
  // Simple sRGB lerp for v1; replace with culori OKLCH interpolation later.
  const parseHex = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ] as [number, number, number];
  const [ra, ga, ba] = parseHex(hexA);
  const [rb, gb, bb] = parseHex(hexB);
  const mix2 = (x: number, y: number) => Math.round(x + (y - x) * tt);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix2(ra, rb))}${toHex(mix2(ga, gb))}${toHex(mix2(ba, bb))}`;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ---------------------------------------------------------------------------
// Top-level color resolver
// ---------------------------------------------------------------------------

export function resolveColorRelation(
  rel: ColorRelation,
  preset: Preset,
  mode: ModeKey,
): string {
  switch (rel.op) {
    case 'ref':      return opRef(rel.anchor, rel.stop, preset, mode);
    case 'traverse': return opTraverse(rel.anchor, rel.delta, preset, mode);
    case 'sib':      return opSib(rel.anchor, rel.delta, preset, mode);
    case 'cross':    return opCross(rel.anchor, rel.stop, preset, mode);
    case 'alpha':    return opAlpha(rel.inner, rel.opacity, preset, mode);
    case 'mix':      return opMix(rel.a, rel.b, rel.t, preset, mode);
  }
}

/**
 * Resolve a color relation AND report whether the underlying OKLCH point
 * fell inside the displayable sRGB gamut. Walks the AST so nested ops
 * propagate the worst-case (any inner out-of-gamut taints the result).
 *
 * Phase 4 (2026-06-07) — same `inGamut` signal the picker's "sRGB clamped"
 * badge uses, surfaced at the relation row.
 */
export function resolveColorRelationWithGamut(
  rel: ColorRelation,
  preset: Preset,
  mode: ModeKey,
): { value: string; inGamut: boolean } {
  switch (rel.op) {
    case 'ref': {
      const anchor = resolveColorAnchor(rel.anchor, preset, mode);
      const r = resolveStop(anchor.family, stopNameToSlider(rel.stop));
      return { value: r.hex, inGamut: r.inGamut };
    }
    case 'traverse': {
      const anchor = resolveColorAnchor(rel.anchor, preset, mode);
      const nextSlider = Math.max(0, Math.min(100, anchor.stop + rel.delta * 10));
      const r = resolveStop(anchor.family, nextSlider);
      return { value: r.hex, inGamut: r.inGamut };
    }
    case 'sib': {
      const anchor = resolveColorAnchor(rel.anchor, preset, mode);
      const delta = rel.delta ?? 1;
      const nextSlider = Math.max(0, Math.min(100, anchor.stop + delta * 10));
      const r = resolveStop(anchor.family, nextSlider);
      return { value: r.hex, inGamut: r.inGamut };
    }
    case 'cross': {
      const anchor = resolveColorAnchor(rel.anchor, preset, mode);
      const r = resolveStop(anchor.family, stopNameToSlider(rel.stop));
      return { value: r.hex, inGamut: r.inGamut };
    }
    case 'alpha': {
      const inner = resolveColorRelationWithGamut(rel.inner, preset, mode);
      const value = hexToRgba(inner.value, Math.max(0, Math.min(1, rel.opacity)));
      return { value, inGamut: inner.inGamut };
    }
    case 'mix': {
      const a = resolveColorRelationWithGamut(rel.a, preset, mode);
      const b = resolveColorRelationWithGamut(rel.b, preset, mode);
      const value = opMix(rel.a, rel.b, rel.t, preset, mode);
      return { value, inGamut: a.inGamut && b.inGamut };
    }
  }
}

// ---------------------------------------------------------------------------
// Non-color operators
// ---------------------------------------------------------------------------

/** ratio(anchor, base, step) — basePx * ratio^step, in pixels. */
function opRatio(
  anchor: TypeAnchorRef,
  baseOverride: number | undefined,
  step: number,
  preset: Preset,
  mode: ModeKey,
): number {
  const scale = valueForMode(preset.anchors[anchor], mode);
  const base = baseOverride ?? scale.basePx;
  return base * Math.pow(scale.ratio, step);
}

/** multiple(anchor, n) — basePx * n, in pixels. */
function opMultiple(
  anchor: ShapeAnchorRef,
  n: number,
  preset: Preset,
  mode: ModeKey,
): number {
  if (anchor === 'spacing') {
    return valueForMode(preset.anchors.spacing, mode).basePx * n;
  }
  if (anchor === 'corners') {
    // multiple over corners isn't canonical; fall back to s * n.
    return valueForMode(preset.anchors.corners, mode).s * n;
  }
  if (anchor === 'elevation') {
    return valueForMode(preset.anchors.elevation, mode).borderWeight * n;
  }
  throw new Error(`unknown shape anchor for multiple: ${anchor}`);
}

/** stop(anchor, name) — named stop on the corner anchor; px value. */
function opStop(
  anchor: ShapeAnchorRef,
  name: 'hairline' | 's' | 'm' | 'l' | 'xl',
  preset: Preset,
  mode: ModeKey,
): number {
  if (anchor === 'corners') {
    if (name === 'hairline') return 1;
    return valueForMode(preset.anchors.corners, mode)[name];
  }
  if (anchor === 'elevation') {
    // Elevation only has a 'hairline' named stop — borderWeight.
    return valueForMode(preset.anchors.elevation, mode).borderWeight;
  }
  if (anchor === 'spacing') {
    const v = valueForMode(preset.anchors.spacing, mode);
    if (name === 'hairline') return 1;
    const factor = { s: 1, m: 2, l: 4, xl: 8 }[name];
    return v.basePx * factor;
  }
  throw new Error(`unknown shape anchor for stop: ${anchor}`);
}

export function resolveNonColorRelation(
  rel: NonColorRelation,
  preset: Preset,
  mode: ModeKey,
): number {
  switch (rel.op) {
    case 'ratio':    return opRatio(rel.anchor, rel.baseOverride, rel.step, preset, mode);
    case 'multiple': return opMultiple(rel.anchor, rel.n, preset, mode);
    case 'stop':     return opStop(rel.anchor, rel.name, preset, mode);
  }
}

// ---------------------------------------------------------------------------
// Formula → string formatters (used in the Relations UI row readout)
// ---------------------------------------------------------------------------

export function formatColorRelation(rel: ColorRelation): string {
  switch (rel.op) {
    case 'ref':      return `ref(${rel.anchor}, ${rel.stop})`;
    case 'traverse': return `traverse(${rel.anchor}, ${signed(rel.delta)})`;
    case 'sib':      return rel.delta !== undefined ? `sib(${rel.anchor}, ${signed(rel.delta)})` : `sib(${rel.anchor})`;
    case 'cross':    return `cross(${rel.anchor}, ${rel.stop})`;
    case 'alpha':    return `alpha(${formatColorRelation(rel.inner)}, ${rel.opacity})`;
    case 'mix':      return `mix(${formatColorRelation(rel.a)}, ${formatColorRelation(rel.b)}, ${rel.t})`;
  }
}

export function formatNonColorRelation(rel: NonColorRelation): string {
  switch (rel.op) {
    case 'ratio':    return `ratio(${rel.anchor}, ${rel.baseOverride ?? 'base'}, ${signed(rel.step)})`;
    case 'multiple': return `multiple(${rel.anchor}, ${rel.n})`;
    case 'stop':     return `stop(${rel.anchor}, ${rel.name})`;
  }
}

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

// ---------------------------------------------------------------------------
// Plain-language descriptions (tooltip register, UX proposal Tension 2)
// ---------------------------------------------------------------------------

export function describeColorRelation(rel: ColorRelation): string {
  switch (rel.op) {
    case 'ref':      return `Picks stop ${rel.stop} of the ${rel.anchor} family.`;
    case 'traverse': {
      const dir = rel.delta > 0 ? 'lighter' : 'darker';
      const n = Math.abs(rel.delta);
      return `${n} stop${n === 1 ? '' : 's'} ${dir} than the ${rel.anchor} family.`;
    }
    case 'sib':      return `Sibling stop of the ${rel.anchor} family.`;
    case 'cross':    return `Pulls stop ${rel.stop} from the ${rel.anchor} family (cross-family reference).`;
    case 'alpha':    return `${describeColorRelation(rel.inner)} Mixed with surface at ${Math.round(rel.opacity * 100)}% opacity.`;
    case 'mix':      return `Blend of ${describeColorRelation(rel.a)} and ${describeColorRelation(rel.b)} at ${rel.t}.`;
  }
}

export function describeNonColorRelation(rel: NonColorRelation): string {
  switch (rel.op) {
    case 'ratio':    return `${rel.step >= 0 ? '+' : ''}${rel.step} ratio step${Math.abs(rel.step) === 1 ? '' : 's'} from the ${rel.anchor} base.`;
    case 'multiple': return `${rel.n}× the ${rel.anchor} base unit.`;
    case 'stop':     return `Named stop "${rel.name}" of the ${rel.anchor} anchor.`;
  }
}

// ---------------------------------------------------------------------------
// Type helpers — narrow Relation to color vs non-color
// ---------------------------------------------------------------------------

const COLOR_OPS = new Set(['ref', 'traverse', 'sib', 'cross', 'alpha', 'mix']);

export function isColorRelation(rel: { op: string }): rel is ColorRelation {
  return COLOR_OPS.has(rel.op);
}

// FamilySlug re-export for symmetric API surface.
export type { FamilySlug };
