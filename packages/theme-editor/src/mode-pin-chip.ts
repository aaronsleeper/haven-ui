/**
 * Mode-pin undo chip (Q3 decision 2026-06-07).
 *
 * When a designer edits an anchor that's currently `shared` while in a single
 * mode, the edit applies optimistically as "Apply to both modes" — no friction.
 * A small chip appears in the editor's chip slot for ~6s; clicking it demotes
 * the change to `pinned`, so the other mode reverts to its pre-edit value.
 *
 * Single chip slot per editor (latest edit wins). New edits refresh the timer.
 * Per feedback_no_pseudo_stop_options: this prefers optimistic + undo over
 * an inline interrupt.
 */

import { demoteToPinned } from './store';
import type { OptimisticEdit } from './store';

const WINDOW_MS = 6000;

let currentEdit: OptimisticEdit<unknown> | null = null;
let dismissTimer: number | null = null;
let chipEl: HTMLDivElement | null = null;

function ensureChip(): HTMLDivElement {
  if (chipEl) return chipEl;
  const el = document.createElement('div');
  el.className = 'te-undo-chip';
  el.hidden = true;
  el.innerHTML = `
    <span class="te-undo-chip-label" data-undo-label></span>
    <button type="button" class="te-undo-chip-action" data-undo-action>
      Pin to this mode
    </button>
    <button type="button" class="te-undo-chip-dismiss" data-undo-dismiss
            aria-label="Dismiss">×</button>
  `;
  document.body.appendChild(el);

  el.querySelector<HTMLButtonElement>('[data-undo-action]')!
    .addEventListener('click', () => {
      if (currentEdit) {
        demoteToPinned(currentEdit);
      }
      hide();
    });

  el.querySelector<HTMLButtonElement>('[data-undo-dismiss]')!
    .addEventListener('click', () => hide());

  chipEl = el;
  return el;
}

function modeLabel(mode: 'light' | 'dark'): string {
  return mode === 'light' ? 'Light' : 'Dark';
}

function anchorReadable(address: string): string {
  if (address === 'companion.value') return 'Companion';
  if (address.startsWith('signals.')) {
    const k = address.slice('signals.'.length);
    return `Signals · ${k}`;
  }
  return address.charAt(0).toUpperCase() + address.slice(1);
}

export function showUndoChip(edit: OptimisticEdit<unknown>): void {
  const el = ensureChip();
  currentEdit = edit;
  const label = el.querySelector<HTMLElement>('[data-undo-label]')!;
  label.textContent = `${anchorReadable(edit.address)} applied to both modes — pin to ${modeLabel(edit.mode)} only?`;
  el.hidden = false;
  el.classList.add('is-visible');

  if (dismissTimer !== null) window.clearTimeout(dismissTimer);
  dismissTimer = window.setTimeout(() => hide(), WINDOW_MS);
}

function hide(): void {
  if (!chipEl) return;
  chipEl.hidden = true;
  chipEl.classList.remove('is-visible');
  currentEdit = null;
  if (dismissTimer !== null) {
    window.clearTimeout(dismissTimer);
    dismissTimer = null;
  }
}
