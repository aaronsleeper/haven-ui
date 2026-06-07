/**
 * Hue family anchors — Phase 1 vendored subset.
 *
 * Mirrors a subset of Lab/cena-health-brand/tools/color-generator/family-source.json.
 * Phase 2 replaces this with a load of the full file via the fs-client (define-once);
 * the picker JS in haven-ui already mirrors family-source.json the same way and is
 * a 3-use trigger candidate for promoting the canon to a brand-toolchain JSON-emit
 * (see hue-family-picker plan's completion note #3).
 */

import type { FamilySlug } from './types';

export interface FamilyAnchors {
  root: string;
  max: string;
  min: string;
}

export const FAMILIES: Partial<Record<FamilySlug, FamilyAnchors>> = {
  teal: {
    root: 'oklch(56.3% 0.0762 181.3)',
    max: 'oklch(96% 0.013 181)',
    min: 'oklch(15% 0.025 183)',
  },
  sage: {
    root: 'oklch(55% 0.085 145.5)',
    max: 'oklch(95% 0.018 148)',
    min: 'oklch(15% 0.020 148)',
  },
  sand: {
    root: 'oklch(65% 0.016 75)',
    max: 'oklch(96.8% 0.011 82)',
    min: 'oklch(15% 0.008 60)',
  },
};

/**
 * Canonical-stop name for a slider position 0–100.
 *
 * Convention: slider 0 = stop-950 (min/darkest), 50 = stop-500 (root),
 * 100 = stop-50 (max/lightest). Stops sit at every 10% of the slider.
 * Off-tick values produce a derived stop number (e.g. 35 → "650").
 */
export function stopNameFor(family: FamilySlug, position: number): string {
  const stops = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50];
  const idx = position / 10;
  if (Number.isInteger(idx) && idx >= 0 && idx <= 10) {
    return `${family}-${stops[idx]}`;
  }
  // Derived (between ticks). Interpolate the stop-number linearly between
  // the surrounding canonical stops for the readout.
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  const lowerStop = stops[lower];
  const upperStop = stops[upper];
  const t = idx - lower;
  const derived = Math.round(lowerStop + (upperStop - lowerStop) * t);
  return `${family}-${derived}`;
}
