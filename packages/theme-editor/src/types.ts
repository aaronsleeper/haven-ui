/**
 * Preset spec — the portable JSON shape the editor authors and emitters consume.
 *
 * v0 (Phase 1 hello-world): one anchor (Surface), one mode pin per anchor,
 * no relations, no overrides, no signal family set. Schema will grow through
 * Phase 2–5 to cover all 11 anchors, the 6 color + 3 non-color operators,
 * and the tokens-layer override surface.
 *
 * Stability contract: existing fields keep their meaning across versions;
 * additions are additive (existing presets remain readable). Breaking
 * changes bump `version` and require a migration in load().
 */

export type ModeKey = 'light' | 'dark';

/** Reference to a hue family by slug — must match family-source.json. */
export type FamilySlug =
  | 'teal'
  | 'sage'
  | 'sand'
  | 'red'
  | 'amber'
  | 'green'
  | 'cyan'
  | 'orange'
  | 'rose'
  | 'pink'
  | 'fuchsia'
  | 'purple'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'lime'
  | 'yellow'
  | 'emerald';

/**
 * Per-mode anchor value: a family slug + a stop position 0–100 on that family's
 * OKLCH line. Stop 0 = min (darkest), 50 = root, 100 = max (lightest).
 * Phase 2 grows this to relation-typed values (ref/traverse/cross/...).
 */
export interface AnchorModeValue {
  family: FamilySlug;
  stop: number;
}

/** v0 anchor shape: per-mode value. No shared-vs-pinned distinction yet (Phase 2). */
export interface Anchor {
  modes: Record<ModeKey, AnchorModeValue>;
}

export type AnchorKey = 'surface' | 'ink' | 'accent' | 'companion';
// Future anchors: 'signals', 'display-face', 'reading-face', 'type-scale',
// 'spacing', 'corners', 'elevation' — added in Phase 2.

export interface PresetMeta {
  /** Human-readable name shown in the preset selector. */
  name: string;
  /** ISO timestamp the preset was last authored. */
  updated?: string;
  /** Optional one-line description. */
  description?: string;
}

export interface Preset {
  /** Schema version. v0 = Phase 1 hello-world. */
  version: 0;
  meta: PresetMeta;
  anchors: Partial<Record<AnchorKey, Anchor>>;
}

export interface ResolvedColor {
  hex: string;
  oklch: string;
  /** Closest canonical stop name (e.g. "sand-50") for readout. */
  stopName: string;
  /** True if the OKLCH point falls inside the displayable sRGB gamut. */
  inGamut: boolean;
}
