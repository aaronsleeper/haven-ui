/**
 * Reactive state — minimal pub/sub for the editor.
 *
 * Phase 2 (2026-06-07): grows the Phase 1 surface-only mutator into a
 * generic per-anchor update path. Anchor values are addressed by key
 * (e.g. 'surface', 'signals.error', 'companion.value') and the mutator
 * respects the current mode + shared/pinned distinction.
 */

import {
  type Preset,
  type ModeKey,
  type AnchorKey,
  type ColorAnchorValue,
  type ModedValue,
  type TypeFaceValue,
  type TypeScaleValue,
  type SpacingValue,
  type CornerValue,
  type ElevationValue,
  type SignalsAnchorValue,
  valueForMode,
  pinToMode,
  cornersMatchDerivation,
} from './types';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface EditorState {
  preset: Preset | null;
  presetName: string | null;
  presetList: string[];
  mode: ModeKey;
  /** Anchor keys currently expanded (UX proposal §3 — one default, meta-click pins multiple). */
  expanded: Set<string>;
  saveStatus: SaveStatus;
  saveError: string | null;
}

type Listener = (s: EditorState) => void;

const state: EditorState = {
  preset: null,
  presetName: null,
  presetList: [],
  mode: 'light',
  expanded: new Set(['surface']),
  saveStatus: 'idle',
  saveError: null,
};

const listeners = new Set<Listener>();

export function getState(): EditorState {
  return state;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(state);
}

// ---------------------------------------------------------------------------
// Top-level mutators
// ---------------------------------------------------------------------------

export function setMode(mode: ModeKey) {
  state.mode = mode;
  emit();
}

export function setPresetList(names: string[]) {
  state.presetList = names;
  emit();
}

export function setPreset(name: string, preset: Preset) {
  state.preset = preset;
  state.presetName = name;
  emit();
}

export function setSaveStatus(status: SaveStatus, error: string | null = null) {
  state.saveStatus = status;
  state.saveError = error;
  emit();
}

export function toggleExpanded(key: string, additive: boolean) {
  if (additive) {
    if (state.expanded.has(key)) state.expanded.delete(key);
    else state.expanded.add(key);
  } else {
    if (state.expanded.has(key) && state.expanded.size === 1) {
      state.expanded.delete(key);
    } else {
      state.expanded.clear();
      state.expanded.add(key);
    }
  }
  emit();
}

// ---------------------------------------------------------------------------
// Per-anchor mutators — apply to current mode optimistically as "shared"
// (the undo chip then offers a pin-to-this-mode demotion). See main.ts.
// ---------------------------------------------------------------------------

/**
 * Anchor address — kebab-form key the row factories pass back to the store.
 * For plain anchors it's just the AnchorKey; for nested anchors (signals.*,
 * companion.value) the key carries a dot path.
 */
export type AnchorAddress =
  | AnchorKey
  | `signals.${keyof SignalsAnchorValue}`
  | 'companion.value';

/**
 * The "shared edit applied optimistically" result a mutator returns —
 * carries the previous shape so the undo chip can flip the change to a
 * mode-pinned form. v1 keeps the prior moded-value verbatim so the undo
 * is a straight assignment.
 */
export interface OptimisticEdit<T> {
  address: AnchorAddress;
  /** The pre-edit moded value (used by the undo chip to demote to pinned). */
  before: ModedValue<T>;
  /** The new (now-shared) moded value after the optimistic edit. */
  after: ModedValue<T>;
  mode: ModeKey;
}

function applySharedColor(
  address: AnchorAddress,
  next: ColorAnchorValue,
): OptimisticEdit<ColorAnchorValue> | null {
  if (!state.preset) return null;
  const before = readModedColor(address);
  if (!before) return null;
  const after: ModedValue<ColorAnchorValue> = { kind: 'shared', value: next };
  writeModedColor(address, after);
  emit();
  return { address, before, after, mode: state.mode };
}

function applySharedTypeFace(
  address: AnchorAddress,
  next: TypeFaceValue,
): OptimisticEdit<TypeFaceValue> | null {
  if (!state.preset || (address !== 'displayFace' && address !== 'readingFace')) return null;
  const before = state.preset.anchors[address];
  const after: ModedValue<TypeFaceValue> = { kind: 'shared', value: next };
  state.preset.anchors[address] = after;
  emit();
  return { address, before, after, mode: state.mode };
}

function applySharedTypeScale(next: TypeScaleValue): OptimisticEdit<TypeScaleValue> | null {
  if (!state.preset) return null;
  const before = state.preset.anchors.typeScale;
  const after: ModedValue<TypeScaleValue> = { kind: 'shared', value: next };
  state.preset.anchors.typeScale = after;
  emit();
  return { address: 'typeScale', before, after, mode: state.mode };
}

function applySharedSpacing(next: SpacingValue): OptimisticEdit<SpacingValue> | null {
  if (!state.preset) return null;
  const before = state.preset.anchors.spacing;
  const after: ModedValue<SpacingValue> = { kind: 'shared', value: next };
  state.preset.anchors.spacing = after;
  emit();
  return { address: 'spacing', before, after, mode: state.mode };
}

function applySharedCorners(next: CornerValue): OptimisticEdit<CornerValue> | null {
  if (!state.preset) return null;
  // Clear stale derivedFrom cache if the new stops don't match (per types.ts
  // CornerValue contract — same derivable-cache pattern as views.md).
  const cleaned = { ...next };
  if (cleaned.derivedFrom && !cornersMatchDerivation(cleaned)) {
    delete cleaned.derivedFrom;
  }
  const before = state.preset.anchors.corners;
  const after: ModedValue<CornerValue> = { kind: 'shared', value: cleaned };
  state.preset.anchors.corners = after;
  emit();
  return { address: 'corners', before, after, mode: state.mode };
}

function applySharedElevation(next: ElevationValue): OptimisticEdit<ElevationValue> | null {
  if (!state.preset) return null;
  const before = state.preset.anchors.elevation;
  const after: ModedValue<ElevationValue> = { kind: 'shared', value: next };
  state.preset.anchors.elevation = after;
  emit();
  return { address: 'elevation', before, after, mode: state.mode };
}

// ---------------------------------------------------------------------------
// Pinned-mode mutator (used by the undo chip)
// ---------------------------------------------------------------------------

/**
 * Convert a recently-edited shared value to pinned, where the current mode
 * carries the new value and the OTHER mode carries the pre-edit value. This
 * is the undo-chip path: optimistic shared edit → user clicks "pin to this
 * mode only" → both modes diverge.
 */
export function demoteToPinned<T>(edit: OptimisticEdit<T>): void {
  if (!state.preset) return;
  const beforeValue = readSharedOrCurrent(edit.before, edit.mode);
  const newValue = readSharedOrCurrent(edit.after, edit.mode);
  const pinned = pinToMode(edit.before, edit.mode, newValue);
  // Write back at the address.
  writeModedAny(edit.address, pinned);
  // The other mode keeps the pre-edit `before` value because pinToMode
  // builds the pinned wrapper from `before`'s mode value, not `after`'s.
  void beforeValue;
  emit();
}

function readSharedOrCurrent<T>(m: ModedValue<T>, mode: ModeKey): T {
  return valueForMode(m, mode);
}

// ---------------------------------------------------------------------------
// Companion pairing toggle
// ---------------------------------------------------------------------------

export function setCompanionPaired(paired: boolean) {
  if (!state.preset) return;
  state.preset.anchors.companion.pairedToAccent = paired;
  emit();
}

export function refreshCompanionFromAccent(next: ColorAnchorValue) {
  if (!state.preset) return;
  if (!state.preset.anchors.companion.pairedToAccent) return;
  state.preset.anchors.companion.value = { kind: 'shared', value: next };
  emit();
}

// ---------------------------------------------------------------------------
// Address resolution helpers
// ---------------------------------------------------------------------------

function readModedColor(address: AnchorAddress): ModedValue<ColorAnchorValue> | null {
  if (!state.preset) return null;
  const a = state.preset.anchors;
  if (address === 'surface') return a.surface;
  if (address === 'ink') return a.ink;
  if (address === 'accent') return a.accent;
  if (address === 'companion.value') return a.companion.value;
  if (address.startsWith('signals.')) {
    const key = address.slice('signals.'.length) as keyof SignalsAnchorValue;
    return a.signals[key];
  }
  return null;
}

function writeModedColor(
  address: AnchorAddress,
  next: ModedValue<ColorAnchorValue>,
): void {
  if (!state.preset) return;
  const a = state.preset.anchors;
  if (address === 'surface') { a.surface = next; return; }
  if (address === 'ink') { a.ink = next; return; }
  if (address === 'accent') { a.accent = next; return; }
  if (address === 'companion.value') { a.companion.value = next; return; }
  if (address.startsWith('signals.')) {
    const key = address.slice('signals.'.length) as keyof SignalsAnchorValue;
    a.signals[key] = next;
    return;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeModedAny(address: AnchorAddress, next: ModedValue<any>): void {
  if (!state.preset) return;
  const a = state.preset.anchors;
  if (address === 'surface' || address === 'ink' || address === 'accent') {
    a[address] = next;
    return;
  }
  if (address === 'companion.value') { a.companion.value = next; return; }
  if (address.startsWith('signals.')) {
    const key = address.slice('signals.'.length) as keyof SignalsAnchorValue;
    a.signals[key] = next;
    return;
  }
  if (address === 'displayFace' || address === 'readingFace') {
    a[address] = next;
    return;
  }
  if (address === 'typeScale') { a.typeScale = next; return; }
  if (address === 'spacing') { a.spacing = next; return; }
  if (address === 'corners') { a.corners = next; return; }
  if (address === 'elevation') { a.elevation = next; return; }
}

// ---------------------------------------------------------------------------
// Exported per-anchor entry points (used by anchor row factories)
// ---------------------------------------------------------------------------

export const editAnchor = {
  color: applySharedColor,
  typeFace: applySharedTypeFace,
  typeScale: applySharedTypeScale,
  spacing: applySharedSpacing,
  corners: applySharedCorners,
  elevation: applySharedElevation,
};
