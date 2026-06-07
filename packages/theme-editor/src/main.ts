/**
 * Haven theme editor — Phase 1 wiring.
 *
 * Boots the editor: fetches target info, loads the first preset in the list,
 * binds DOM inputs to state, and on every state change debounces an emit →
 * filesystem write. Phase 2 swaps the single hand-rolled control for the
 * shipped hue-family-picker and grows to all 11 anchors.
 */

import { resolveStop } from './color';
import { emitObsidian } from './emitter-obsidian';
import {
  fetchTarget,
  listPresets,
  loadPreset,
  savePreset,
  writeThemeBlock,
} from './fs-client';
import {
  getState,
  setMode,
  setPreset,
  setPresetList,
  setSaveStatus,
  setSurfaceStop,
  subscribe,
} from './store';
import type { ModeKey } from './types';

const DEBOUNCE_MS = 250;

// ============================================================ DOM refs

const $ = <T extends Element = HTMLElement>(sel: string): T => {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el as T;
};

const modeButtons = document.querySelectorAll<HTMLButtonElement>('.te-mode');
const presetSelect = $<HTMLSelectElement>('#te-preset');
const surfaceStop = $<HTMLInputElement>('#te-surface-stop');
const surfaceStopOutput = $<HTMLOutputElement>('#te-surface-stop-output');
const surfaceReadout = $('#te-anchor-surface-readout');
const surfaceResolved = $('#te-anchor-surface-resolved');
const statusSave = $('#te-status-save');
const statusTarget = $('#te-status-target');

// ============================================================ Debounce / write

let writeTimer: number | null = null;

function scheduleWrite() {
  if (writeTimer !== null) {
    window.clearTimeout(writeTimer);
  }
  setSaveStatus('pending');
  writeTimer = window.setTimeout(() => {
    writeTimer = null;
    void performWrite();
  }, DEBOUNCE_MS);
}

async function performWrite() {
  const { preset, presetName } = getState();
  if (!preset || !presetName) return;
  setSaveStatus('saving');
  try {
    const css = emitObsidian(preset);
    await writeThemeBlock(css);
    preset.meta.updated = new Date().toISOString();
    await savePreset(presetName, preset);
    setSaveStatus('saved');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    setSaveStatus('error', msg);
  }
}

// ============================================================ Render

function renderModeSelector(mode: ModeKey) {
  for (const btn of modeButtons) {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('te-mode--active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  }
}

function renderPresetSelect(names: string[], current: string | null) {
  presetSelect.innerHTML = '';
  if (names.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '— no presets —';
    presetSelect.appendChild(opt);
    return;
  }
  for (const name of names) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === current) opt.selected = true;
    presetSelect.appendChild(opt);
  }
}

function renderSurfaceAnchor() {
  const s = getState();
  if (!s.preset) {
    surfaceReadout.textContent = '— no preset loaded —';
    surfaceResolved.textContent = '—';
    return;
  }
  const surface = s.preset.anchors.surface;
  if (!surface) {
    surfaceReadout.textContent = '— anchor not in preset —';
    surfaceResolved.textContent = '—';
    return;
  }
  const value = surface.modes[s.mode];
  const resolved = resolveStop(value.family, value.stop);
  surfaceReadout.textContent = `${value.family} · ${resolved.stopName}`;
  surfaceResolved.textContent = `${resolved.hex} · ${resolved.oklch}${resolved.inGamut ? '' : ' · sRGB clamped'}`;
  surfaceStop.value = String(value.stop);
  surfaceStopOutput.value = String(value.stop);
}

function renderStatus() {
  const s = getState();
  switch (s.saveStatus) {
    case 'idle':
      statusSave.textContent = 'Idle';
      break;
    case 'pending':
      statusSave.textContent = 'Pending…';
      break;
    case 'saving':
      statusSave.textContent = 'Saving…';
      break;
    case 'saved':
      statusSave.textContent = `Saved · ${new Date().toLocaleTimeString()}`;
      break;
    case 'error':
      statusSave.textContent = `Error · ${s.saveError ?? 'unknown'}`;
      break;
  }
}

function render() {
  const s = getState();
  renderModeSelector(s.mode);
  renderPresetSelect(s.presetList, s.presetName);
  renderSurfaceAnchor();
  renderStatus();
}

// ============================================================ Events

for (const btn of modeButtons) {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode as ModeKey;
    setMode(mode);
  });
}

presetSelect.addEventListener('change', async () => {
  const name = presetSelect.value;
  if (!name) return;
  try {
    const p = await loadPreset(name);
    setPreset(name, p);
    setSaveStatus('idle');
    scheduleWrite();
  } catch (e) {
    setSaveStatus('error', e instanceof Error ? e.message : String(e));
  }
});

surfaceStop.addEventListener('input', () => {
  const stop = Number(surfaceStop.value);
  surfaceStopOutput.value = String(stop);
  setSurfaceStop(stop);
  scheduleWrite();
});

subscribe(render);

// ============================================================ Boot

async function boot() {
  try {
    const target = await fetchTarget();
    statusTarget.textContent = `target: ${target.overridesCss}`;
    const presets = await listPresets();
    setPresetList(presets);
    if (presets.length > 0) {
      const first = presets[0];
      const p = await loadPreset(first);
      setPreset(first, p);
      // Initial paint of the managed block so theme.css matches the loaded preset.
      scheduleWrite();
    }
  } catch (e) {
    setSaveStatus('error', e instanceof Error ? e.message : String(e));
  }
}

void boot();
