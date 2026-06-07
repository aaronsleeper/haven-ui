/**
 * Anchor row factories — Phase 6 (Figma-density grouped grid, 2026-06-07).
 *
 * The Anchors section is now three labeled groups (Color · Type · Shape).
 * Every anchor is visible at rest. Color anchors render a swatch-card; the
 * hue-family-picker pops over from a click on the swatch. Type/shape anchors
 * render their controls inline at rest (no popover — the controls ARE the
 * authoring surface).
 *
 * Spec: ~/.claude/plans/haven-theme-editor-ux-proposal.md §3 (revised 2026-06-07).
 *
 * Store contract preserved: the `expanded` Set drives popover-open state for
 * color cards. Single-anchor-open by default; meta-click pins multiple open.
 * Type/shape cards ignore `expanded` (they have no popover state).
 *
 * Responsive: each group's body uses `display: flex; flex-wrap: wrap` so cards
 * reflow on narrow viewports rather than getting cut off (Aaron's narrow-window
 * Obsidian-alongside use case).
 *
 * Label discipline (Figma read):
 *   - Solo controls (Display face / Reading face / Spacing) → label above input
 *   - Paired controls (Type scale base+ratio, Corners s/m/l/xl, Elevation) →
 *     inline-leading short labels (Figma W/H pattern)
 *   - Group headers (Color / Type / Shape) name the substrate decision.
 */

import type {
  ColorAnchorValue,
  FamilySlug,
  ModedValue,
  ModeKey,
  TypeFaceValue,
  TypeScaleValue,
  SpacingValue,
  CornerValue,
  ElevationValue,
  Preset,
} from './types';
import { valueForMode } from './types';
import {
  editAnchor,
  toggleExpanded,
  setCompanionPaired,
  refreshCompanionFromAccent,
  getState,
  type AnchorAddress,
  type OptimisticEdit,
} from './store';
import { resolveStop, companionPairedToAccent } from './color';

// ANCHOR_LIST retained for the Relations filter (relations-ui imports it).
export const ANCHOR_LIST: { key: string; label: string; description: string; kind: AnchorKind }[] = [
  { key: 'surface',     label: 'Surface',      description: 'The warm ground everything sits on', kind: 'color' },
  { key: 'ink',         label: 'Ink',          description: 'The reading colour and figure on the surface', kind: 'color' },
  { key: 'accent',      label: 'Accent',       description: 'Interactive register — links, focus, active states', kind: 'color' },
  { key: 'companion',   label: 'Companion',    description: 'The second voice — blockquotes, tags, hue-shift partner', kind: 'companion' },
  { key: 'signals',     label: 'Signals',      description: 'Status colours — error, warning, success, info, note', kind: 'signals' },
  { key: 'displayFace', label: 'Display face', description: 'Headlines and section titles', kind: 'type-face' },
  { key: 'readingFace', label: 'Reading face', description: 'Body text and UI', kind: 'type-face' },
  { key: 'typeScale',   label: 'Type scale',   description: 'Base size and ratio between heading sizes', kind: 'type-scale' },
  { key: 'spacing',     label: 'Spacing',      description: 'Base unit and rhythm', kind: 'spacing' },
  { key: 'corners',     label: 'Corners',      description: 'Border-radius register', kind: 'corners' },
  { key: 'elevation',   label: 'Elevation',    description: 'Border weight and shadow intensity', kind: 'elevation' },
];

type AnchorKind =
  | 'color'
  | 'companion'
  | 'signals'
  | 'type-face'
  | 'type-scale'
  | 'spacing'
  | 'corners'
  | 'elevation';

const SIGNAL_KEYS = ['error', 'warning', 'success', 'info', 'accentInfo'] as const;

const SIGNAL_LABELS: Record<(typeof SIGNAL_KEYS)[number], string> = {
  error:      'Error',
  warning:    'Warning',
  success:    'Success',
  info:       'Info',
  accentInfo: 'Accent info',
};

const SIGNAL_SHORT: Record<(typeof SIGNAL_KEYS)[number], string> = {
  error:      'er',
  warning:    'wa',
  success:    'su',
  info:       'in',
  accentInfo: 'ai',
};

const COMMON_FONTS = [
  'Lora',
  'Source Sans 3',
  'Source Code Pro',
  'Plus Jakarta Sans',
  'Inter',
  'IBM Plex Serif',
  'IBM Plex Sans',
  'system-ui',
];

export type OnEdit = (edit: OptimisticEdit<unknown>) => void;

// ---------------------------------------------------------------------------
// Picker markup — unchanged from prior phases; rendered inside a popover
// ---------------------------------------------------------------------------

function pickerMarkup(id: string, family: FamilySlug, stop: number): string {
  return `
<div class="hue-family-picker is-compact" data-hue-family-picker
     data-family="${family}" data-value="${stop}" data-anchor-picker-id="${id}">
  <div class="hue-family-picker-header">
    <label class="hue-family-picker-family-label" for="hfp-${id}">Family</label>
    <select id="hfp-${id}" class="hue-family-picker-family-select"
            data-hfp-family-select aria-label="Hue family"></select>
    <div class="hue-family-picker-swatch" data-hfp-swatch
         aria-label="Selected color preview" role="img"></div>
    <div class="hue-family-picker-stop-readout" aria-live="polite">
      <span class="hue-family-picker-stop-label" data-hfp-stop-label>${family}-${stop * 10}</span>
      <span class="hue-family-picker-stop-role" data-hfp-stop-role></span>
      <span class="hue-family-picker-gamut-badge" data-hfp-gamut-badge hidden
            title="OKLCH outside sRGB; HEX/RGB clamped to nearest in-gamut value.">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <span class="hue-family-picker-gamut-badge-text">sRGB clamped</span>
      </span>
    </div>
  </div>
  <div class="hue-family-picker-slider-wrap" data-hfp-track>
    <input type="range" class="slider-track hue-family-picker-track" data-hfp-slider
           min="0" max="100" step="1" value="${stop}"
           aria-label="Position along family line"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stop}">
    <div class="hue-family-picker-ticks" data-hfp-ticks aria-hidden="true"></div>
  </div>
  <div class="hue-family-picker-values">
    <div class="hue-family-picker-value-row" data-hfp-value-row="hex">
      <span class="hue-family-picker-value-label">HEX</span>
      <span class="hue-family-picker-value" data-hfp-value>—</span>
      <button type="button" class="hue-family-picker-copy-btn" data-hfp-copy aria-label="Copy HEX value">
        <i class="fa-solid fa-copy" aria-hidden="true"></i>
      </button>
    </div>
    <button type="button" class="hue-family-picker-expand-toggle" data-hfp-expand-toggle
            aria-expanded="false" aria-label="Show additional color formats">
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
  </div>
  <div class="hue-family-picker-drawer">
    <div class="hue-family-picker-value-row" data-hfp-value-row="oklch">
      <span class="hue-family-picker-value-label">OKLCH</span>
      <span class="hue-family-picker-value" data-hfp-value>—</span>
      <button type="button" class="hue-family-picker-copy-btn" data-hfp-copy aria-label="Copy OKLCH value">
        <i class="fa-solid fa-copy" aria-hidden="true"></i>
      </button>
    </div>
    <div class="hue-family-picker-value-row" data-hfp-value-row="rgb">
      <span class="hue-family-picker-value-label">RGB</span>
      <span class="hue-family-picker-value" data-hfp-value>—</span>
      <button type="button" class="hue-family-picker-copy-btn" data-hfp-copy aria-label="Copy RGB value">
        <i class="fa-solid fa-copy" aria-hidden="true"></i>
      </button>
    </div>
    <div class="hue-family-picker-value-row" data-hfp-value-row="hsl">
      <span class="hue-family-picker-value-label">HSL</span>
      <span class="hue-family-picker-value" data-hfp-value>—</span>
      <button type="button" class="hue-family-picker-copy-btn" data-hfp-copy aria-label="Copy HSL value">
        <i class="fa-solid fa-copy" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// Common glyphs
// ---------------------------------------------------------------------------

function modePinGlyph<T>(m: ModedValue<T>): string {
  return m.kind === 'pinned'
    ? '<span class="te-card-modepin" title="Mode-pinned" aria-label="Mode-pinned">⌐</span>'
    : '';
}

// ---------------------------------------------------------------------------
// Color swatch-card (Surface / Ink / Accent / Companion)
// ---------------------------------------------------------------------------

function colorSwatchCard(
  key: string,
  label: string,
  description: string,
  m: ModedValue<ColorAnchorValue>,
  mode: ModeKey,
  isOpen: boolean,
  extraTopLeft = '',
): string {
  const v = valueForMode(m, mode);
  const resolved = resolveStop(v.family, v.stop);
  const readout = `${v.family} · ${resolved.stopName}`;
  return `
<article class="te-card te-card--color${isOpen ? ' is-open' : ''}" data-anchor-row="${key}"
         data-card-kind="color" title="${escapeAttr(description)}">
  <button type="button" class="te-card-swatch-btn" data-anchor-toggle aria-expanded="${isOpen}"
          aria-label="${label} — open picker">
    <div class="te-card-swatch" style="background:${resolved.hex}"></div>
    ${extraTopLeft}
    ${modePinGlyph(m)}
  </button>
  <div class="te-card-label">${label}</div>
  <div class="te-card-readout">${readout}</div>
  ${isOpen ? `<div class="te-card-popover" data-popover>${pickerMarkup(key, v.family, v.stop)}</div>` : ''}
</article>`;
}

function companionCard(
  m: ModedValue<ColorAnchorValue>,
  paired: boolean,
  mode: ModeKey,
  isOpen: boolean,
): string {
  const v = valueForMode(m, mode);
  const resolved = resolveStop(v.family, v.stop);
  const chain = paired
    ? '<span class="te-card-chain" title="Paired with Accent (canonical sage hue-shift)" aria-label="Paired with Accent">⚭</span>'
    : '';
  const readout = `${v.family} · ${resolved.stopName}${paired ? ' · paired' : ''}`;
  return `
<article class="te-card te-card--color${isOpen ? ' is-open' : ''}" data-anchor-row="companion"
         data-card-kind="color" title="The second voice — blockquotes, tags, hue-shift partner">
  <button type="button" class="te-card-swatch-btn" data-anchor-toggle aria-expanded="${isOpen}"
          aria-label="Companion — open picker">
    <div class="te-card-swatch" style="background:${resolved.hex}"></div>
    ${chain}
    ${modePinGlyph(m)}
  </button>
  <div class="te-card-label">Companion</div>
  <div class="te-card-readout">${readout}</div>
  ${isOpen ? `
    <div class="te-card-popover" data-popover>
      <label class="te-card-pair-toggle">
        <input type="checkbox" data-companion-pair ${paired ? 'checked' : ''}>
        <span>Pair with Accent (canonical sage hue-shift)</span>
      </label>
      <div class="${paired ? 'te-anchor-disabled-block' : ''}">
        ${pickerMarkup('companion', v.family, v.stop)}
      </div>
    </div>
  ` : ''}
</article>`;
}

// ---------------------------------------------------------------------------
// Signals card — 5 inline sub-swatches; click any → popover with that sub-picker
// ---------------------------------------------------------------------------

function signalsCard(
  signals: {
    error: ModedValue<ColorAnchorValue>;
    warning: ModedValue<ColorAnchorValue>;
    success: ModedValue<ColorAnchorValue>;
    info: ModedValue<ColorAnchorValue>;
    accentInfo: ModedValue<ColorAnchorValue>;
  },
  mode: ModeKey,
  openSignal: (typeof SIGNAL_KEYS)[number] | null,
): string {
  const strip = SIGNAL_KEYS.map((k) => {
    const v = valueForMode(signals[k], mode);
    const r = resolveStop(v.family, v.stop);
    const isActive = openSignal === k;
    return `
      <button type="button" class="te-signal-sub${isActive ? ' is-active' : ''}"
              data-signal-sub="${k}" aria-pressed="${isActive}"
              aria-label="${SIGNAL_LABELS[k]} — open picker"
              title="${SIGNAL_LABELS[k]} · ${v.family}">
        <span class="te-signal-sub-swatch" style="background:${r.hex}"></span>
        <span class="te-signal-sub-label">${SIGNAL_SHORT[k]}</span>
        ${signals[k].kind === 'pinned' ? '<span class="te-signal-sub-pin" title="Mode-pinned">⌐</span>' : ''}
      </button>`;
  }).join('');

  let popover = '';
  if (openSignal) {
    const v = valueForMode(signals[openSignal], mode);
    popover = `<div class="te-card-popover" data-popover>${pickerMarkup(`signal-${openSignal}`, v.family, v.stop)}</div>`;
  }

  return `
<article class="te-card te-card--signals${openSignal ? ' is-open' : ''}" data-anchor-row="signals"
         data-card-kind="signals" title="Status colours — error, warning, success, info, note">
  <div class="te-signal-strip">${strip}</div>
  <div class="te-card-label">Signals</div>
  <div class="te-card-readout">5 status</div>
  ${popover}
</article>`;
}

// ---------------------------------------------------------------------------
// Type cards
// ---------------------------------------------------------------------------

function typeFaceCard(
  key: 'displayFace' | 'readingFace',
  label: string,
  m: ModedValue<TypeFaceValue>,
  mode: ModeKey,
): string {
  const v = valueForMode(m, mode);
  const options = COMMON_FONTS.includes(v.family) ? COMMON_FONTS : [v.family, ...COMMON_FONTS];
  return `
<article class="te-card te-card--type" data-anchor-row="${key}" data-card-kind="type">
  <div class="te-card-head">
    <div class="te-card-label">${label}</div>
    ${modePinGlyph(m)}
  </div>
  <label class="te-control-stacked">
    <span class="te-control-label-above">Font family</span>
    <select class="te-select" data-type-face-select>
      ${options.map((f) => `<option value="${escapeAttr(f)}" ${f === v.family ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
    </select>
  </label>
</article>`;
}

function typeScaleCard(m: ModedValue<TypeScaleValue>, mode: ModeKey): string {
  const v = valueForMode(m, mode);
  const sizes = [5, 4, 3, 2, 1, 0]
    .map((n) => Math.round(v.basePx * Math.pow(v.ratio, n) * 100) / 100)
    .map((n) => `${n}`)
    .join(' · ');
  return `
<article class="te-card te-card--type te-card--type-scale" data-anchor-row="typeScale" data-card-kind="type">
  <div class="te-card-head">
    <div class="te-card-label">Type scale</div>
    ${modePinGlyph(m)}
  </div>
  <div class="te-paired-row">
    <label class="te-paired-input">
      <span class="te-paired-label">base</span>
      <input type="number" class="te-input te-input--narrow" min="10" max="24" step="1"
             data-type-scale-base value="${v.basePx}">
    </label>
    <label class="te-paired-input">
      <span class="te-paired-label">ratio</span>
      <input type="number" class="te-input te-input--narrow" min="1.05" max="1.6" step="0.025"
             data-type-scale-ratio value="${v.ratio}">
    </label>
  </div>
  <div class="te-card-mini-preview">${sizes}</div>
</article>`;
}

// ---------------------------------------------------------------------------
// Shape cards
// ---------------------------------------------------------------------------

function spacingCard(m: ModedValue<SpacingValue>, mode: ModeKey): string {
  const v = valueForMode(m, mode);
  const preview = [1, 2, 3, 4, 6, 8].map((n) => `${v.basePx * n}`).join(' · ');
  return `
<article class="te-card te-card--shape" data-anchor-row="spacing" data-card-kind="shape">
  <div class="te-card-head">
    <div class="te-card-label">Spacing</div>
    ${modePinGlyph(m)}
  </div>
  <div class="te-paired-row">
    <label class="te-paired-input">
      <span class="te-paired-label">base</span>
      <input type="number" class="te-input te-input--narrow" min="2" max="8" step="1"
             data-spacing-base value="${v.basePx}">
      <span class="te-control-unit">px</span>
    </label>
  </div>
  <div class="te-card-mini-preview">${preview}</div>
</article>`;
}

function cornersCard(m: ModedValue<CornerValue>, mode: ModeKey): string {
  const v = valueForMode(m, mode);
  const derived = !!v.derivedFrom;
  return `
<article class="te-card te-card--shape te-card--corners" data-anchor-row="corners" data-card-kind="shape">
  <div class="te-card-head">
    <div class="te-card-label">Corners</div>
    ${modePinGlyph(m)}
  </div>
  <div class="te-paired-row te-paired-row--four">
    ${(['s', 'm', 'l', 'xl'] as const).map((k) => `
      <label class="te-paired-input">
        <span class="te-paired-label">${k}</span>
        <input type="number" class="te-input te-input--tiny" min="0" max="64" step="1"
               data-corner-stop="${k}" value="${v[k]}">
      </label>
    `).join('')}
  </div>
  ${derived ? `<div class="te-card-mini-preview">base ${v.derivedFrom!.base} × ${v.derivedFrom!.ratio}</div>` : ''}
</article>`;
}

function elevationCard(m: ModedValue<ElevationValue>, mode: ModeKey): string {
  const v = valueForMode(m, mode);
  const shadowPct = Math.round(v.shadowIntensity * 100);
  return `
<article class="te-card te-card--shape" data-anchor-row="elevation" data-card-kind="shape">
  <div class="te-card-head">
    <div class="te-card-label">Elevation</div>
    ${modePinGlyph(m)}
  </div>
  <div class="te-paired-row">
    <label class="te-paired-input">
      <span class="te-paired-label">border</span>
      <input type="number" class="te-input te-input--tiny" min="0" max="3" step="1"
             data-elevation-border value="${v.borderWeight}">
      <span class="te-control-unit">px</span>
    </label>
    <label class="te-paired-input">
      <span class="te-paired-label">shadow</span>
      <input type="range" class="te-range te-range--narrow" min="0" max="100" step="5"
             data-elevation-shadow value="${shadowPct}">
      <span class="te-control-unit">${shadowPct}%</span>
    </label>
  </div>
</article>`;
}

// ---------------------------------------------------------------------------
// Top-level group renderer
// ---------------------------------------------------------------------------

function isSignalKey(k: string): k is (typeof SIGNAL_KEYS)[number] {
  return (SIGNAL_KEYS as readonly string[]).includes(k);
}

export function renderAnchorList(
  preset: Preset,
  mode: ModeKey,
  expanded: Set<string>,
): string {
  const a = preset.anchors;
  // For Signals, the `expanded` Set may contain entries like `signals.error` to
  // mark which sub-picker is open. We extract the first such entry as the open
  // signal sub-anchor. If none, openSignal stays null.
  const openSignal = ((): (typeof SIGNAL_KEYS)[number] | null => {
    for (const k of expanded) {
      if (k.startsWith('signals.')) {
        const sub = k.slice('signals.'.length);
        if (isSignalKey(sub)) return sub;
      }
    }
    return null;
  })();

  const colorGroup = `
<div class="te-anchor-group">
  <header class="te-anchor-group-header">
    <h3 class="te-anchor-group-title">Color</h3>
    <span class="te-anchor-group-meta">5 anchors · click swatch to open picker</span>
  </header>
  <div class="te-anchor-group-body">
    ${colorSwatchCard('surface', 'Surface', 'The warm ground everything sits on', a.surface, mode, expanded.has('surface'))}
    ${colorSwatchCard('ink', 'Ink', 'The reading colour and figure on the surface', a.ink, mode, expanded.has('ink'))}
    ${colorSwatchCard('accent', 'Accent', 'Interactive register — links, focus, active states', a.accent, mode, expanded.has('accent'))}
    ${companionCard(a.companion.value, a.companion.pairedToAccent, mode, expanded.has('companion'))}
    ${signalsCard(a.signals, mode, openSignal)}
  </div>
</div>`;

  const typeGroup = `
<div class="te-anchor-group">
  <header class="te-anchor-group-header">
    <h3 class="te-anchor-group-title">Type</h3>
    <span class="te-anchor-group-meta">3 anchors · scale derived from base × ratio</span>
  </header>
  <div class="te-anchor-group-body">
    ${typeFaceCard('displayFace', 'Display face', a.displayFace, mode)}
    ${typeFaceCard('readingFace', 'Reading face', a.readingFace, mode)}
    ${typeScaleCard(a.typeScale, mode)}
  </div>
</div>`;

  const shapeGroup = `
<div class="te-anchor-group">
  <header class="te-anchor-group-header">
    <h3 class="te-anchor-group-title">Shape</h3>
    <span class="te-anchor-group-meta">3 anchors · spacing / corners / elevation</span>
  </header>
  <div class="te-anchor-group-body">
    ${spacingCard(a.spacing, mode)}
    ${cornersCard(a.corners, mode)}
    ${elevationCard(a.elevation, mode)}
  </div>
</div>`;

  return colorGroup + typeGroup + shapeGroup;
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

interface WireOpts {
  onEdit: OnEdit;
  scheduleWrite: () => void;
}

// One outside-click handler attached lazily; closes any open picker (color
// anchor or signal sub-picker) when the click lands outside both the trigger
// and the popover. The handler stays attached for the page lifetime since the
// editor is a single SPA-shaped surface.
let outsideClickAttached = false;

function attachOutsideClickOnce() {
  if (outsideClickAttached) return;
  outsideClickAttached = true;
  document.addEventListener('mousedown', (e) => {
    const target = e.target as Node | null;
    if (!target) return;
    const root = document.querySelector<HTMLElement>('#te-anchor-list');
    if (!root || !root.contains(target)) {
      // Click outside the anchors section → close every open card.
      closeAllOpen();
      return;
    }
    // Click inside — close only if the click is not inside an open card's
    // swatch/strip-button OR its popover. (Clicks on other cards' swatches
    // will be handled by the toggle handler, which already closes others.)
    const card = (target as HTMLElement).closest<HTMLElement>('[data-anchor-row]');
    if (!card) {
      closeAllOpen();
      return;
    }
    const inPopover = (target as HTMLElement).closest('[data-popover]');
    const inToggle = (target as HTMLElement).closest('[data-anchor-toggle], [data-signal-sub]');
    if (!inPopover && !inToggle) {
      // Click was inside a card but not on a toggle or its popover (e.g. the
      // label area) — don't close anything.
    }
  }, true);

  // Esc closes any open picker.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllOpen();
    }
  });
}

function closeAllOpen() {
  const { expanded } = getState();
  if (expanded.size === 0) return;
  const keys = Array.from(expanded);
  for (const k of keys) {
    // Treat each as its own "close" toggle — pass non-additive so toggleExpanded
    // clears it cleanly when it's the only entry, or removes from the set.
    toggleExpanded(k, true);
  }
}

export function wireAnchorEvents(root: HTMLElement, opts: WireOpts): void {
  attachOutsideClickOnce();

  // Color swatch buttons — toggle popover open/closed
  root.querySelectorAll<HTMLButtonElement>('[data-anchor-toggle]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const row = btn.closest('[data-anchor-row]') as HTMLElement | null;
      if (!row) return;
      const key = row.dataset.anchorRow!;
      const additive = e.metaKey || e.ctrlKey;
      // When opening this card without additive, also clear any open signal sub.
      const { expanded } = getState();
      if (!additive && !expanded.has(key)) {
        for (const k of Array.from(expanded)) {
          if (k.startsWith('signals.')) toggleExpanded(k, true);
        }
      }
      toggleExpanded(key, additive);
    });
  });

  // Signal sub-swatches — open/close the per-signal popover
  root.querySelectorAll<HTMLButtonElement>('[data-signal-sub]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const sub = btn.dataset.signalSub!;
      const key = `signals.${sub}`;
      const additive = e.metaKey || e.ctrlKey;
      // Close any other open signal subs unless additive
      const { expanded } = getState();
      if (!additive) {
        for (const k of Array.from(expanded)) {
          if (k !== key && k.startsWith('signals.')) toggleExpanded(k, true);
          // Also close any open card-level color anchors so the popover doesn't stack
          if (k !== key && !k.startsWith('signals.')) toggleExpanded(k, true);
        }
      }
      toggleExpanded(key, additive);
    });
  });

  // Hue-family-picker events — bubble from the picker root in any popover
  root.querySelectorAll<HTMLElement>('[data-hue-family-picker]').forEach((pickerEl) => {
    pickerEl.addEventListener('hue-pick', (e: Event) => {
      const detail = (e as CustomEvent).detail as { family: FamilySlug; value: number; source: string };
      if (detail.source === 'set') return;
      const id = pickerEl.dataset.anchorPickerId!;
      const address = pickerIdToAddress(id);
      if (!address) return;
      const nextValue: ColorAnchorValue = { family: detail.family, stop: detail.value };
      const result = editAnchor.color(address, nextValue);
      if (result) opts.onEdit(result);
      if (address === 'accent') {
        refreshCompanionFromAccent(companionPairedToAccent(detail.family));
      }
      opts.scheduleWrite();
    });
  });

  // Companion pair toggle
  const pairEl = root.querySelector<HTMLInputElement>('[data-companion-pair]');
  if (pairEl) {
    pairEl.addEventListener('change', () => {
      setCompanionPaired(pairEl.checked);
      opts.scheduleWrite();
    });
  }

  // Type face selects
  root.querySelectorAll<HTMLSelectElement>('[data-type-face-select]').forEach((sel) => {
    const row = sel.closest<HTMLElement>('[data-anchor-row]')!;
    const key = row.dataset.anchorRow as 'displayFace' | 'readingFace';
    sel.addEventListener('change', () => {
      const result = editAnchor.typeFace(key, { family: sel.value });
      if (result) opts.onEdit(result);
      opts.scheduleWrite();
    });
  });

  // Type scale inputs
  const tsBase = root.querySelector<HTMLInputElement>('[data-type-scale-base]');
  const tsRatio = root.querySelector<HTMLInputElement>('[data-type-scale-ratio]');
  if (tsBase && tsRatio) {
    const fire = () => {
      const result = editAnchor.typeScale({ basePx: Number(tsBase.value), ratio: Number(tsRatio.value) });
      if (result) opts.onEdit(result);
      opts.scheduleWrite();
    };
    tsBase.addEventListener('change', fire);
    tsRatio.addEventListener('change', fire);
  }

  // Spacing
  const spBase = root.querySelector<HTMLInputElement>('[data-spacing-base]');
  if (spBase) {
    spBase.addEventListener('change', () => {
      const result = editAnchor.spacing({ basePx: Number(spBase.value), kind: 'linear' });
      if (result) opts.onEdit(result);
      opts.scheduleWrite();
    });
  }

  // Corners
  const cornerInputs = root.querySelectorAll<HTMLInputElement>('[data-corner-stop]');
  if (cornerInputs.length) {
    const fire = () => {
      const stops: Record<string, number> = {};
      cornerInputs.forEach((i) => { stops[i.dataset.cornerStop!] = Number(i.value); });
      const result = editAnchor.corners({
        s: stops.s, m: stops.m, l: stops.l, xl: stops.xl,
      });
      if (result) opts.onEdit(result);
      opts.scheduleWrite();
    };
    cornerInputs.forEach((i) => i.addEventListener('change', fire));
  }

  // Elevation
  const elBorder = root.querySelector<HTMLInputElement>('[data-elevation-border]');
  const elShadow = root.querySelector<HTMLInputElement>('[data-elevation-shadow]');
  if (elBorder && elShadow) {
    const fire = () => {
      const result = editAnchor.elevation({
        borderWeight: Number(elBorder.value),
        shadowIntensity: Number(elShadow.value) / 100,
      });
      if (result) opts.onEdit(result);
      opts.scheduleWrite();
    };
    elBorder.addEventListener('change', fire);
    elShadow.addEventListener('input', fire);
  }
}

function pickerIdToAddress(id: string): AnchorAddress | null {
  if (id === 'surface' || id === 'ink' || id === 'accent') return id;
  if (id === 'companion') return 'companion.value';
  if (id.startsWith('signal-')) {
    const key = id.slice('signal-'.length);
    if (SIGNAL_KEYS.includes(key as (typeof SIGNAL_KEYS)[number])) {
      return `signals.${key as (typeof SIGNAL_KEYS)[number]}`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
