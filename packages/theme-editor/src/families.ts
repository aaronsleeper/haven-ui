/**
 * Hue family canon — fetched live from cena-health-brand on editor boot.
 *
 * Phase 2 (2026-06-07) replaces the Phase 1 vendored 3-family subset with
 * a runtime fetch via GET /api/families (served by server-middleware.ts).
 * The middleware reads `Lab/cena-health-brand/tools/color-generator/family-source.json`
 * which is the machine-canonical mirror of the brand spec's family table.
 *
 * Define-once preserved: the JSON file is the single source of truth; the
 * editor holds an in-memory cache for the session. Canon updates land via
 * editor restart (deliberate — the picker JS in @haven/design-system also
 * mirrors family-source.json as a vendored copy, marked for 3-use-floor
 * promotion to a brand-toolchain JSON-emit. When that promotion lands,
 * both the picker and this editor will load via the same canonical export.)
 */

import type { FamilySlug } from './types';

export interface FamilyAnchors {
  root: string;
  max: string;
  min: string;
  role?: string;
}

/**
 * Shape returned by the brand-side family-source.json — the `families`
 * map carries one entry per family slug, each with root/max/min OKLCH
 * triplets. The full document includes additional fields (`$schema`,
 * `logo_identity`, `interpolation`, `dropped`); we keep them only as
 * untyped metadata for the editor's UI.
 */
interface FamilySourceDoc {
  $version?: string;
  families: Record<string, FamilyAnchors>;
  logo_identity?: unknown;
  interpolation?: unknown;
  dropped?: unknown;
}

let cache: Record<FamilySlug, FamilyAnchors> | null = null;
let inflight: Promise<Record<FamilySlug, FamilyAnchors>> | null = null;

/**
 * Load the full family canon from the middleware. Cached for the session.
 * Throws if the canon is unreachable — the editor cannot function without
 * family data, so failing loud is correct.
 */
export async function loadFamilies(): Promise<Record<FamilySlug, FamilyAnchors>> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const r = await fetch('/api/families');
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      throw new Error(`GET /api/families failed: ${r.status} ${detail}`);
    }
    const doc = (await r.json()) as FamilySourceDoc;
    if (!doc.families || typeof doc.families !== 'object') {
      throw new Error('family-source.json missing `families` map');
    }
    cache = doc.families as Record<FamilySlug, FamilyAnchors>;
    return cache;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/** Synchronous accessor — caller must have awaited loadFamilies() first. */
export function getFamiliesSync(): Record<FamilySlug, FamilyAnchors> {
  if (!cache) {
    throw new Error('families not loaded — call loadFamilies() first');
  }
  return cache;
}

/** Synchronous accessor for one family — caller must have loaded first. */
export function getFamilySync(slug: FamilySlug): FamilyAnchors {
  const f = getFamiliesSync()[slug];
  if (!f) throw new Error(`unknown family slug: ${slug}`);
  return f;
}

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
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  const lowerStop = stops[lower];
  const upperStop = stops[upper];
  const t = idx - lower;
  const derived = Math.round(lowerStop + (upperStop - lowerStop) * t);
  return `${family}-${derived}`;
}
