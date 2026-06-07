/**
 * Haven theme editor — Phase 2 wiring.
 *
 * Boot order:
 *   1. fetch /api/target (display target path in status bar)
 *   2. fetch /api/families and cache the canon for the session
 *   3. fetch /api/presets, pick the first, load it
 *   4. render the 11-anchor list, mode selector, status bar
 *   5. dynamic-import the picker module — auto-inits all picker DOM elements
 *
 * On preset/mode change: rerender the anchor list, then re-call
 * `initHueFamilyPickers()` (idempotent — skips already-inited pickers).
 *
 * On user picker change ('hue-pick' event): apply optimistically as `shared`,
 * surface the undo chip, schedule the debounced write.
 */

import { initHueFamilyPickers } from '@haven/design-system/scripts/components/hue-family-picker.js';
import { loadFamilies } from './families';
import { renderAnchorList, wireAnchorEvents, type OnEdit } from './anchors';
import { renderRelationsSection, wireRelationsEvents } from './relations-ui';
import { renderTokensSection, wireTokensEvents } from './tokens-ui';
import { computeIssues, type IssueSet } from './issues';
import {
  renderIssuesPanel,
  wireIssuesPanelEvents,
  toggleIssuesPanel,
  isIssuesPanelOpen,
  setIssuesPanelOpen,
} from './issues-panel';
import { emitObsidian } from './emitter-obsidian';
import {
  fetchTarget,
  listPresets,
  loadPreset,
  savePreset,
  deletePreset,
  writeThemeBlock,
} from './fs-client';
import {
  getState,
  setMode,
  setPreset,
  setPresetList,
  setSaveStatus,
  subscribe,
} from './store';
import { showUndoChip } from './mode-pin-chip';
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
const presetSaveAs = $<HTMLButtonElement>('#te-preset-save-as');
const presetDuplicate = $<HTMLButtonElement>('#te-preset-duplicate');
const presetDelete = $<HTMLButtonElement>('#te-preset-delete');
const anchorList = $<HTMLElement>('#te-anchor-list');
const relationsSection = $<HTMLElement>('#te-relations-body');
const tokensSection = $<HTMLElement>('#te-tokens-body');
const issuesMount = $<HTMLElement>('#te-issues-mount');
const statusSave = $('#te-status-save');
const statusTarget = $('#te-status-target');
const statusIssues = $<HTMLButtonElement>('#te-status-issues');
const statusIssuesCount = $('#te-status-issues-count');

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

// ============================================================ Edit handler

const onEdit: OnEdit = (edit) => {
  showUndoChip(edit);
};

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

function currentIssues(): IssueSet {
  const s = getState();
  if (!s.preset) {
    return { contrast: [], gamut: [], byVar: new Map() };
  }
  return computeIssues(s.preset, s.mode);
}

function renderAnchors() {
  const s = getState();
  if (!s.preset) {
    anchorList.innerHTML = '<p class="te-section-placeholder">— no preset loaded —</p>';
    return;
  }
  anchorList.innerHTML = renderAnchorList(s.preset, s.mode, s.expanded);
  wireAnchorEvents(anchorList, { onEdit, scheduleWrite });
  // Re-init any newly-mounted pickers. Idempotent.
  initHueFamilyPickers();
}

function renderRelations(issues: IssueSet) {
  const s = getState();
  if (!s.preset) {
    relationsSection.innerHTML = '<p class="te-section-placeholder">— no preset loaded —</p>';
    return;
  }
  relationsSection.innerHTML = renderRelationsSection(s.preset, s.mode, issues);
  wireRelationsEvents(relationsSection, {
    scheduleWrite,
    rerender: () => renderRelations(currentIssues()),
  });
}

function renderTokens(issues: IssueSet) {
  const s = getState();
  if (!s.preset) {
    tokensSection.innerHTML = '<p class="te-section-placeholder">— no preset loaded —</p>';
    return;
  }
  tokensSection.innerHTML = renderTokensSection(s.preset, s.mode, issues);
  wireTokensEvents(tokensSection, {
    rerender: () => renderTokens(currentIssues()),
  });
}

function renderIssues(issues: IssueSet) {
  const total = issues.contrast.length + issues.gamut.length;
  if (total > 0) {
    statusIssues.hidden = false;
    statusIssuesCount.textContent = String(total);
  } else {
    statusIssues.hidden = true;
    statusIssuesCount.textContent = '0';
    // Auto-close the panel when no issues remain.
    setIssuesPanelOpen(false);
  }
  issuesMount.innerHTML = renderIssuesPanel(issues);
  if (isIssuesPanelOpen()) {
    wireIssuesPanelEvents(issuesMount, render);
  }
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
  const issues = s.preset ? computeIssues(s.preset, s.mode) : { contrast: [], gamut: [], byVar: new Map() };
  renderModeSelector(s.mode);
  renderPresetSelect(s.presetList, s.presetName);
  renderAnchors();
  renderRelations(issues);
  renderTokens(issues);
  renderIssues(issues);
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

statusIssues.addEventListener('click', () => {
  toggleIssuesPanel();
  render();
});

// ============================================================ Preset CRUD

function safePresetSlug(input: string): string | null {
  const slug = input.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(slug)) return null;
  return slug;
}

async function refreshPresetList(selectName: string | null): Promise<void> {
  const presets = await listPresets();
  setPresetList(presets);
  if (selectName && presets.includes(selectName)) {
    const p = await loadPreset(selectName);
    setPreset(selectName, p);
  }
}

async function saveAsNewName(seed: string): Promise<void> {
  const { preset } = getState();
  if (!preset) return;
  const input = window.prompt('Save preset as…', seed);
  if (input === null) return;
  const slug = safePresetSlug(input);
  if (!slug) {
    setSaveStatus('error', 'invalid name (use lowercase letters, numbers, dashes)');
    return;
  }
  const existing = getState().presetList;
  if (existing.includes(slug)) {
    if (!window.confirm(`Overwrite existing preset "${slug}"?`)) return;
  }
  const copy: typeof preset = JSON.parse(JSON.stringify(preset));
  copy.meta = { ...copy.meta, name: slug, updated: new Date().toISOString() };
  setSaveStatus('saving');
  try {
    await savePreset(slug, copy);
    await refreshPresetList(slug);
    // Repaint the runtime theme.css under the new preset.
    scheduleWrite();
    setSaveStatus('saved');
  } catch (e) {
    setSaveStatus('error', e instanceof Error ? e.message : String(e));
  }
}

presetSaveAs.addEventListener('click', () => {
  const { presetName } = getState();
  void saveAsNewName(presetName ?? 'new-preset');
});

presetDuplicate.addEventListener('click', () => {
  const { presetName } = getState();
  if (!presetName) return;
  void saveAsNewName(`${presetName}-copy`);
});

presetDelete.addEventListener('click', async () => {
  const { presetName, presetList } = getState();
  if (!presetName) return;
  if (!window.confirm(`Delete preset "${presetName}"? This cannot be undone.`)) return;
  setSaveStatus('saving');
  try {
    await deletePreset(presetName);
    // Pick a sibling to switch to, or none if the list emptied.
    const remaining = presetList.filter((n) => n !== presetName);
    if (remaining.length === 0) {
      setPresetList([]);
      // No preset to load — clear and let the UI render the empty state.
      // (setPreset accepts a Preset; we can't pass null without changing the
      // store contract. Leave the in-memory preset stale; the next save-as
      // will write it under a new name.)
      setSaveStatus('saved');
      return;
    }
    const next = remaining[0];
    await refreshPresetList(next);
    scheduleWrite();
    setSaveStatus('saved');
  } catch (e) {
    setSaveStatus('error', e instanceof Error ? e.message : String(e));
  }
});

// ============================================================ Drag gate
//
// Sliders (the hue-family-picker track + the elevation shadow-intensity range)
// fire `input` events continuously while the user drags. Each event mutates
// the store, which triggers render(), which `innerHTML`-swaps the anchor list
// and destroys the slider element mid-drag — the pointer no longer captures
// the element, and the drag dies.
//
// Fix: gate the render while a pointer-drag is active on any range input.
// Store mutations + debounced theme.css writes continue (so Obsidian still
// previews live); only the editor's own DOM swap is suppressed. One final
// render() fires on pointerup/pointercancel to sync the DOM with truth.

let isDragging = false;

document.addEventListener('pointerdown', (e) => {
  const t = e.target as HTMLElement | null;
  if (t?.closest('input[type="range"]')) {
    isDragging = true;
  }
}, { capture: true });

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  render();
}

document.addEventListener('pointerup', endDrag, { capture: true });
document.addEventListener('pointercancel', endDrag, { capture: true });

subscribe(() => {
  if (isDragging) return;
  render();
});

// ============================================================ Boot

async function boot() {
  try {
    const target = await fetchTarget();
    statusTarget.textContent = `target: ${target.overridesCss}`;
    await loadFamilies();
    const presets = await listPresets();
    setPresetList(presets);
    if (presets.length > 0) {
      const first = presets[0];
      const p = await loadPreset(first);
      setPreset(first, p);
      // Initial paint of the overrides block so theme.css matches the loaded preset.
      scheduleWrite();
    }
  } catch (e) {
    setSaveStatus('error', e instanceof Error ? e.message : String(e));
  }
}

void boot();
