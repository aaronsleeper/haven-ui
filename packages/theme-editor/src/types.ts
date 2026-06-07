/**
 * Preset spec — the portable JSON shape the editor authors and emitters consume.
 *
 * v1 (Phase 2, 2026-06-07): all 11 anchors (5 color + 3 type + 3 shape),
 * shared-vs-pinned ModedValue<T> wrapper, companion pairing, signals as
 * a struct of 5 individually-mode-pinnable color anchors.
 *
 * v1.1 (Phase 3, 2026-06-07): adds `relations` field carrying per-preset
 * overrides and locks against the canonical relation registry. Additive —
 * v1 presets still load (empty `relations` object defaults).
 *
 * Stability contract: existing v1 fields keep their meaning across point
 * releases; additions are additive (existing presets remain readable).
 * Breaking changes bump `version` and require a migration in load().
 *
 * v0 → v1 migration: not provided. v0 presets were Phase 1 hello-world
 * (Surface anchor only); reseed from current theme.css as v1.
 */

// ---------------------------------------------------------------------------
// Modes + the shared-vs-pinned wrapper
// ---------------------------------------------------------------------------

export type ModeKey = 'light' | 'dark';

/**
 * Shared-vs-pinned wrapper. Used uniformly across every anchor (color, type,
 * shape) so anchor values can be authored once for both modes (`shared`) or
 * authored independently per mode (`pinned`).
 *
 * Phase 2 UX: anchors default to `shared`. Editing while in one mode applies
 * optimistically as "Apply to both modes"; an undo chip appears for ~6s and
 * converts to `pinned` if clicked. (Q3 decision 2026-06-07.)
 */
export type ModedValue<T> =
  | { kind: 'shared'; value: T }
  | { kind: 'pinned'; light: T; dark: T };

// ---------------------------------------------------------------------------
// Color anchor values
// ---------------------------------------------------------------------------

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
  | 'yellow'
  | 'lime'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

/**
 * A point on a hue family's OKLCH line. Stop position is 0–100:
 * 0 = min anchor (darkest), 50 = root, 100 = max anchor (lightest).
 * Canonical stops snap at every 10% interval.
 */
export interface ColorAnchorValue {
  family: FamilySlug;
  stop: number;
}

// ---------------------------------------------------------------------------
// Type anchor values
// ---------------------------------------------------------------------------

/**
 * Type face — a font family identifier. v1 has no font registry; the
 * string is taken verbatim by the emitter (must match a font available in
 * the target environment). Future: weight, OpenType features, fallback stack.
 */
export interface TypeFaceValue {
  family: string;
}

/**
 * Type scale — base size + multiplicative ratio. Every heading size is
 * derived: h1 = basePx * ratio^5, h6 = basePx (approximate; emitter owns
 * the exact mapping).
 */
export interface TypeScaleValue {
  basePx: number;
  ratio: number;
}

// ---------------------------------------------------------------------------
// Shape anchor values
// ---------------------------------------------------------------------------

/**
 * Spacing — base + scale kind. v1 supports `linear` only (every spacing
 * token is `basePx * n`). Geometric (`basePx * ratio^n`) deferred to v1.x
 * if a designer needs it.
 */
export interface SpacingValue {
  basePx: number;
  kind: 'linear';
}

/**
 * Corner anchor — discrete stops (canonical, per Q D2.3 decision).
 * `derivedFrom` is an optional cache when the four stops happen to fit a
 * `{ base, ratio }` ladder. The cache clears on hand-edit of any stop:
 * the editor recomputes whether the stops still match `derivedFrom` and
 * removes the field if not. (Same derivable-cache pattern as views.md.)
 */
export interface CornerValue {
  s: number;
  m: number;
  l: number;
  xl: number;
  derivedFrom?: { base: number; ratio: number };
}

/**
 * Elevation — coordinated border-weight + shadow-intensity dial. Per the
 * UX proposal (§1 Shape anchors), Cena treats borders and shadows as the
 * same lever at different intensities — never two independent decisions.
 * The emitter resolves `shadowIntensity` (0..1) into the actual shadow
 * box-shadow definitions.
 */
export interface ElevationValue {
  borderWeight: number;     // px
  shadowIntensity: number;  // 0..1 abstract dial
}

// ---------------------------------------------------------------------------
// Signals — 5 individually-mode-pinnable color anchors under one top-level
// ---------------------------------------------------------------------------

/**
 * The 5 signal sub-anchors. Each is independently mode-pinnable, so a
 * designer can pin warning-amber for dark mode while leaving error-red
 * shared. (Q D2.1 decision 2026-06-07.)
 */
export interface SignalsAnchorValue {
  error:      ModedValue<ColorAnchorValue>;
  warning:    ModedValue<ColorAnchorValue>;
  success:    ModedValue<ColorAnchorValue>;
  info:       ModedValue<ColorAnchorValue>;
  accentInfo: ModedValue<ColorAnchorValue>;
}

// ---------------------------------------------------------------------------
// Companion — paired-to-accent semantics
// ---------------------------------------------------------------------------

/**
 * Companion anchor — Cena's hue-shift partner (sage to teal's primary).
 *
 * When `pairedToAccent` is true, `value` is a cached derivation from the
 * accent anchor via cross-family hue+325° at stop 500 (per UX proposal
 * Tension 3). The chain glyph ⚭ appears in the row. The emitter consumes
 * `value` directly; the cache is refreshed whenever accent changes.
 *
 * When `pairedToAccent` is false, `value` is independently authored.
 *
 * Pairing is global to the anchor (not per-mode), so the chain either
 * binds across both modes or doesn't bind. (Q D2.2 decision 2026-06-07.)
 */
export interface CompanionAnchor {
  pairedToAccent: boolean;
  value: ModedValue<ColorAnchorValue>;
}

// ---------------------------------------------------------------------------
// The 11 anchors
// ---------------------------------------------------------------------------

export interface PresetAnchors {
  surface:     ModedValue<ColorAnchorValue>;
  ink:         ModedValue<ColorAnchorValue>;
  accent:      ModedValue<ColorAnchorValue>;
  companion:   CompanionAnchor;
  signals:     SignalsAnchorValue;

  displayFace: ModedValue<TypeFaceValue>;
  readingFace: ModedValue<TypeFaceValue>;
  typeScale:   ModedValue<TypeScaleValue>;

  spacing:     ModedValue<SpacingValue>;
  corners:     ModedValue<CornerValue>;
  elevation:   ModedValue<ElevationValue>;
}

export type AnchorKey = keyof PresetAnchors;

// ---------------------------------------------------------------------------
// Top-level preset
// ---------------------------------------------------------------------------

export interface PresetMeta {
  /** Human-readable name shown in the preset selector. */
  name: string;
  /** ISO timestamp the preset was last authored. */
  updated?: string;
  /** Optional one-line description. */
  description?: string;
}

/** v1.x preset — Phase 2/3 contract. */
export interface Preset {
  /**
   * 1 = Phase 2 (anchors only; relations field optional).
   * 1.1 = Phase 3 (relations field carries override/lock entries).
   * Backwards compatible — loader treats missing `relations` as empty.
   */
  version: 1 | 1.1;
  meta: PresetMeta;
  anchors: PresetAnchors;
  /**
   * Per-preset relation overrides + locks, keyed by Obsidian CSS variable
   * name (e.g. `--interactive-accent`). Entries override the canonical
   * registry; missing entries inherit the registry default.
   */
  relations: Record<string, RelationOverride>;
  /** Phase 4 — raw token overrides; empty placeholder. */
  overrides: Record<string, never>;
}

// ---------------------------------------------------------------------------
// Relation language (Phase 3)
// ---------------------------------------------------------------------------

/**
 * Anchor identifiers a relation can reference. Color relations use the
 * 5 color anchor keys (surface, ink, accent, companion, signals.*) plus
 * signal sub-anchors. Non-color relations reference type/shape anchors.
 */
export type ColorAnchorRef =
  | 'surface'
  | 'ink'
  | 'accent'
  | 'companion'
  | `signals.${keyof SignalsAnchorValue}`;

export type TypeAnchorRef = 'typeScale';
export type ShapeAnchorRef = 'spacing' | 'corners' | 'elevation';

/**
 * Color relation operators (UX proposal §2):
 * - ref(anchor, stop)              Pick a specific stop of an anchor's family.
 * - traverse(anchor, ±Δ)           Walk Δ stops up (lighter) or down from anchor.
 * - sib(anchor, [±Δ])              Sibling stop — convenience for traverse ±1.
 * - cross(other-anchor, stop)      Pull a stop from a DIFFERENT anchor's family.
 * - alpha(inner, 0..1)             Mix `inner` with surface at given opacity.
 * - mix(a, b, 0..1)                Linear OKLCH blend of two resolved values.
 *
 * Non-color (UX proposal §2):
 * - ratio(anchor, base, step)      Geometric: basePx * ratio^step
 * - multiple(anchor, n)            Linear multiple: basePx * n
 * - stop(anchor, name)             Named-stop reference (corners s/m/l/xl).
 */
export type ColorRelation =
  | { op: 'ref'; anchor: ColorAnchorRef; stop: number }
  | { op: 'traverse'; anchor: ColorAnchorRef; delta: number }
  | { op: 'sib'; anchor: ColorAnchorRef; delta?: number }
  | { op: 'cross'; anchor: ColorAnchorRef; stop: number }
  | { op: 'alpha'; inner: ColorRelation; opacity: number }
  | { op: 'mix'; a: ColorRelation; b: ColorRelation; t: number };

export type NonColorRelation =
  | { op: 'ratio'; anchor: TypeAnchorRef; baseOverride?: number; step: number }
  | { op: 'multiple'; anchor: ShapeAnchorRef; n: number }
  | { op: 'stop'; anchor: ShapeAnchorRef; name: 'hairline' | 's' | 'm' | 'l' | 'xl' };

export type Relation = ColorRelation | NonColorRelation;

/**
 * A registered relation in the canonical registry. The `kind` flag tells the
 * emitter which resolver path to take (color hex vs. dimension/string).
 */
export interface RegisteredRelation {
  /** The Obsidian CSS variable this relation populates (e.g. "--interactive-accent"). */
  cssVar: string;
  /** Plain-language description for the row tooltip. */
  description: string;
  /** Expression — color or non-color. */
  expr: Relation;
  /** Which top-level anchor this relation reads from (for the Relations filter). */
  anchorKey: AnchorKey;
}

/**
 * Per-preset override against the canonical registry. Two flavors:
 * - `override` — replaces the registry's expression with a designer-authored one
 * - `lock` — freezes the resolved value as of lock time (Phase 3 lock semantics)
 *
 * A relation may have BOTH a custom expression AND a lock; the lock wins at
 * resolution time (the frozen value is emitted).
 */
export type RelationOverride =
  | { kind: 'override'; expr: Relation }
  | { kind: 'lock'; frozenValue: string }
  | { kind: 'override+lock'; expr: Relation; frozenValue: string };

// ---------------------------------------------------------------------------
// Resolved color (returned by the picker / color helpers)
// ---------------------------------------------------------------------------

export interface ResolvedColor {
  hex: string;
  oklch: string;
  /** Closest canonical stop name (e.g. "sand-50") for readout. */
  stopName: string;
  /** True if the OKLCH point falls inside the displayable sRGB gamut. */
  inGamut: boolean;
}

// ---------------------------------------------------------------------------
// Helpers — extract the active value for the current mode
// ---------------------------------------------------------------------------

/**
 * Return the value a ModedValue resolves to for the given mode.
 * - shared → the shared value
 * - pinned → the mode-specific value
 */
export function valueForMode<T>(moded: ModedValue<T>, mode: ModeKey): T {
  return moded.kind === 'shared' ? moded.value : moded[mode];
}

/**
 * Promote a shared ModedValue to pinned, with one mode's value changed.
 * The other mode keeps the prior shared value.
 */
export function pinToMode<T>(
  moded: ModedValue<T>,
  mode: ModeKey,
  newValue: T,
): ModedValue<T> {
  if (moded.kind === 'pinned') {
    return { ...moded, [mode]: newValue };
  }
  const other: ModeKey = mode === 'light' ? 'dark' : 'light';
  return {
    kind: 'pinned',
    [mode]: newValue,
    [other]: moded.value,
  } as ModedValue<T>;
}

/**
 * Set a ModedValue to a new shared value (collapsing pinned modes if needed).
 */
export function setShared<T>(_moded: ModedValue<T>, newValue: T): ModedValue<T> {
  return { kind: 'shared', value: newValue };
}

/**
 * True if a CornerValue's discrete stops still match its derivedFrom cache.
 * Used to decide whether to keep or clear the cache after a hand-edit.
 */
export function cornersMatchDerivation(c: CornerValue): boolean {
  if (!c.derivedFrom) return false;
  const { base, ratio } = c.derivedFrom;
  const expectedS = base;
  const expectedM = base * ratio;
  const expectedL = base * ratio * ratio;
  const expectedXl = base * ratio * ratio * ratio;
  const eps = 0.001;
  return (
    Math.abs(c.s - expectedS) < eps &&
    Math.abs(c.m - expectedM) < eps &&
    Math.abs(c.l - expectedL) < eps &&
    Math.abs(c.xl - expectedXl) < eps
  );
}
