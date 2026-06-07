/**
 * Reactive state — minimal pub/sub for the editor.
 *
 * Phase 1 holds the loaded preset, the active mode, and the auto-save
 * status. Subscribers re-render UI fragments when state changes. Plain
 * functions over a class for ergonomics; one global instance per session.
 */

import type { Preset, ModeKey } from './types';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface EditorState {
  preset: Preset | null;
  presetName: string | null;
  presetList: string[];
  mode: ModeKey;
  saveStatus: SaveStatus;
  saveError: string | null;
}

type Listener = (s: EditorState) => void;

const state: EditorState = {
  preset: null,
  presetName: null,
  presetList: [],
  mode: 'light',
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

/**
 * Update the surface anchor's stop for the active mode.
 * Phase 2 generalizes this into a per-anchor mutator family.
 */
export function setSurfaceStop(stop: number) {
  if (!state.preset) return;
  const surface = state.preset.anchors.surface;
  if (!surface) return;
  surface.modes[state.mode].stop = stop;
  emit();
}
