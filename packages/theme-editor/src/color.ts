/**
 * Color math — OKLCH interpolation along a family line.
 *
 * Phase 1 uses culori the same way the shipped hue-family-picker does:
 * linear-in-L between the family's three anchors (min → root → max),
 * then convert to sRGB hex for emission. Gamut detection inherited from
 * culori's displayable() check.
 */

import { parse, formatHex, formatCss, displayable, type Color } from 'culori';
import type { FamilySlug, ResolvedColor } from './types';
import { FAMILIES, stopNameFor } from './families';

function parseOklch(input: string): Color {
  const c = parse(input);
  if (!c) throw new Error(`bad OKLCH: ${input}`);
  return c;
}

interface OklchTriple {
  l: number;
  c: number;
  h: number;
}

function toLCH(c: Color): OklchTriple {
  // culori parse('oklch(...)') yields {mode:'oklch', l, c, h}.
  // Defensive: coerce missing components.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const any = c as any;
  return {
    l: any.l ?? 0,
    c: any.c ?? 0,
    h: any.h ?? 0,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Resolve a family + position (0–100) to a concrete OKLCH and hex.
 *
 * Position 0 → min anchor (darkest). 50 → root. 100 → max (lightest).
 * Two-segment linear interpolation through the three anchors (min/root/max),
 * matching the family-generator's behavior.
 */
export function resolveStop(family: FamilySlug, position: number): ResolvedColor {
  const anchors = FAMILIES[family];
  if (!anchors) throw new Error(`unknown family: ${family}`);
  const min = toLCH(parseOklch(anchors.min));
  const root = toLCH(parseOklch(anchors.root));
  const max = toLCH(parseOklch(anchors.max));

  const p = Math.max(0, Math.min(100, position));
  let lch: OklchTriple;
  if (p <= 50) {
    const t = p / 50;
    lch = { l: lerp(min.l, root.l, t), c: lerp(min.c, root.c, t), h: lerp(min.h, root.h, t) };
  } else {
    const t = (p - 50) / 50;
    lch = { l: lerp(root.l, max.l, t), c: lerp(root.c, max.c, t), h: lerp(root.h, max.h, t) };
  }

  const oklchColor: Color = { mode: 'oklch', l: lch.l, c: lch.c, h: lch.h };
  const inGamut = displayable(oklchColor);
  const hex = formatHex(oklchColor) ?? '#000000';
  const oklch = formatCss(oklchColor) ?? '';

  return {
    hex,
    oklch,
    stopName: stopNameFor(family, position),
    inGamut,
  };
}
