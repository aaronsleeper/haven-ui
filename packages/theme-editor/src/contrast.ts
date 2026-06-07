/**
 * Contrast math — WCAG 2.x relative-luminance ratio.
 *
 * Pure functions over hex strings. No culori dependency — the math is
 * cheap enough to inline. Inputs may be `#rrggbb` (relations output) or
 * `rgba(r, g, b, a)` (alpha-overlay output); the latter is flattened
 * against an assumed background via the optional `over` arg.
 *
 * WCAG ratio is the (L1 + 0.05) / (L2 + 0.05) form (L1 = lighter).
 * Range: 1.0 (identical) to 21.0 (white on black).
 *
 * Threshold convention used by the editor (inform-don't-enforce):
 *   AAA (7.0)  — body text floor, per brand spec
 *   AA  (4.5)  — UI text floor, per brand spec
 *   AA-large (3.0) — large display text + UI controls
 *
 * v1 ships a single floor at AA (4.5) for all flagged pairs. The brand
 * spec calls for AAA on body text but several Obsidian-default pairs are
 * intentionally below it; surfacing AA breaks is the right starting bar.
 */

const HEX = /^#([0-9a-f]{6})$/i;
const RGBA = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)$/i;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse `#rrggbb` or `rgba(...)` to 0..255 RGB. */
function parseToRgb(value: string): Rgb | null {
  const hex = HEX.exec(value);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
  }
  return null;
}

/** Parse `rgba(r, g, b, a)` to {rgb, alpha}; returns null on other shapes. */
function parseRgba(value: string): { rgb: Rgb; alpha: number } | null {
  const m = RGBA.exec(value);
  if (!m) return null;
  return {
    rgb: { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10) },
    alpha: parseFloat(m[4]),
  };
}

/**
 * Flatten an `rgba(...)` over an opaque background hex. Returns the
 * effective opaque RGB. If `value` is already opaque hex, returns it as-is.
 */
function flatten(value: string, bg: Rgb): Rgb | null {
  const rgb = parseToRgb(value);
  if (rgb) return rgb;
  const rgba = parseRgba(value);
  if (!rgba) return null;
  const a = Math.max(0, Math.min(1, rgba.alpha));
  return {
    r: Math.round(rgba.rgb.r * a + bg.r * (1 - a)),
    g: Math.round(rgba.rgb.g * a + bg.g * (1 - a)),
    b: Math.round(rgba.rgb.b * a + bg.b * (1 - a)),
  };
}

/** sRGB channel → linear-light per WCAG. */
function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance per WCAG 2.x. */
function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/**
 * Compute the WCAG contrast ratio between two color values.
 * `fg` may be `#rrggbb` or `rgba(...)`; the alpha case flattens over `bg`.
 * `bg` must be opaque `#rrggbb`.
 *
 * Returns NaN when either input cannot be parsed — caller treats NaN as
 * "skip this pair" rather than as a low ratio.
 */
export function contrastRatio(fg: string, bg: string): number {
  const bgRgb = parseToRgb(bg);
  if (!bgRgb) return NaN;
  const fgRgb = flatten(fg, bgRgb);
  if (!fgRgb) return NaN;
  const l1 = luminance(bgRgb);
  const l2 = luminance(fgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Floor used by the editor's v1 contrast badge. */
export const CONTRAST_FLOOR_AA = 4.5;

/** Round a ratio to 2 decimals for display. */
export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '—';
  return ratio.toFixed(2);
}

/** True if the ratio is below the editor's v1 floor (AA = 4.5). */
export function failsContrastFloor(ratio: number): boolean {
  return Number.isFinite(ratio) && ratio < CONTRAST_FLOOR_AA;
}
