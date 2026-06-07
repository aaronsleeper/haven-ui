/**
 * Anchor row factories — all 11 v1 anchors.
 *
 * Each anchor has a row factory that owns:
 *   - rendering its collapsed header (name + value readout + mode-pin glyph)
 *   - rendering its expanded body (editor specific to the value type)
 *   - listening to value-change events and pushing into the store
 *
 * Color anchors render the shipped @haven/design-system hue-family-picker
 * (compact variant). Type/shape anchors use simple form controls because
 * they don't have a brand-canon-aligned shared editor yet.
 *
 * The picker JS auto-inits on DOMContentLoaded but we render dynamically.
 * Boot sequence handles this by dynamic-importing the picker module AFTER
 * the editor renders its DOM the first time; on programmatic preset/mode
 * changes we drive each picker via its `_hueFamilyPicker.setValue()` and
 * `setFamily()` API (no re-init needed).
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
} from './types';
import { valueForMode } from './types';
import {
  editAnchor,
  toggleExpanded,
  setCompanionPaired,
  refreshCompanionFromAccent,
  type AnchorAddress,
  type OptimisticEdit,
} from './store';
import { resolveStop, companionPairedToAccent } from './color';

export const ANCHOR_LIST: { key: string; label: string; description: string; kind: AnchorKind }[] = [
  { key: 'surface',     label: 'Surface',     description: 'The warm ground everything sits on',          kind: 'color' },
  { key: 'ink',         label: 'Ink',         description: 'The reading colour and figure on the surface', kind: 'color' },
  { key: 'accent',      label: 'Accent',      description: 'Interactive register — links, focus, active states', kind: 'color' },
  { key: 'companion',   label: 'Companion',   description: 'The second voice — blockquotes, tags, hue-shift partner', kind: 'companion' },
  { key: 'signals',     label: 'Signals',     description: 'Status colours — error, warning, success, info, note', kind: 'signals' },
  { key: 'displayFace', label: 'Display face', description: 'Headlines and section titles', kind: 'type-face' },
  { key: 'readingFace', label: 'Reading face', description: 'Body text and UI', kind: 'type-face' },
  { key: 'typeScale',   label: 'Type scale',  description: 'Base size and ratio between heading sizes', kind: 'type-scale' },
  { key: 'spacing',     label: 'Spacing',     description: 'Base unit and rhythm', kind: 'spacing' },
  { key: 'corners',     label: 'Corners',     description: 'Border-radius register', kind: 'corners' },
  { key: 'elevation',   label: 'Elevation',   description: 'Border weight and shadow intensity', kind: 'elevation' },
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

// ---------------------------------------------------------------------------
// Optimistic-edit + undo chip wiring
// ---------------------------------------------------------------------------

/**
 * One callback type for every anchor-row optimistic edit. The factory wires
 * each picker/input to call this with the OptimisticEdit so main.ts can
 * surface the undo chip + schedule the write.
 */
export type OnEdit = (edit: OptimisticEdit<unknown>) => void;

// ---------------------------------------------------------------------------
// Picker markup template — used by all color anchors + signals sub-rows
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
// Row scaffolding — shared header structure
// ---------------------------------------------------------------------------

function modePinGlyph<T>(m: ModedValue<T>): string {
  return m.kind === 'pinned' ? '<span class="te-anchor-modepin" title="Mode-pinned">⌐</span>' : '';
}

function shapeRowHeader(
  index: number,
  label: string,
  readout: string,
  isExpanded: boolean,
  extraGlyphs = '',
): string {
  return `
<button type="button" class="te-anchor-header" data-anchor-toggle
        aria-expanded="${isExpanded}">
  <span class="te-anchor-number">${index}</span>
  <span class="te-anchor-name">${label}</span>
  <span class="te-anchor-readout">${readout}</span>
  ${extraGlyphs}
  <span class="te-anchor-caret">${isExpanded ? '▾' : '▸'}</span>
</button>`;
}

// ---------------------------------------------------------------------------
// Color anchor row (Surface, Ink, Accent)
// ---------------------------------------------------------------------------

function renderColorRow(
  index: number,
  key: 'surface' | 'ink' | 'accent',
  label: string,
  description: string,
  m: ModedValue<ColorAnchorValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  const resolved = resolveStop(v.family, v.stop);
  const readout = `${v.family} · ${resolved.stopName}`;
  const gamut = resolved.inGamut ? '' : ' · sRGB clamped';
  return `
<div class="te-anchor te-anchor--color" data-anchor-row="${key}">
  ${shapeRowHeader(index, label, readout + gamut, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      ${pickerMarkup(`${key}`, v.family, v.stop)}
      <p class="te-anchor-resolved">${resolved.hex} · ${resolved.oklch}</p>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Companion anchor (paired-to-accent variant)
// ---------------------------------------------------------------------------

function renderCompanionRow(
  index: number,
  label: string,
  description: string,
  paired: boolean,
  m: ModedValue<ColorAnchorValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  const resolved = resolveStop(v.family, v.stop);
  const chain = paired ? '<span class="te-anchor-chain" title="Paired with Accent">⚭</span>' : '';
  const readout = `${v.family} · ${resolved.stopName}${paired ? ' · paired' : ''}`;
  return `
<div class="te-anchor te-anchor--color" data-anchor-row="companion">
  ${shapeRowHeader(index, label, readout, isExpanded, chain + modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <label class="te-anchor-toggle-row">
        <input type="checkbox" data-companion-pair ${paired ? 'checked' : ''}>
        <span>Pair with Accent (canonical sage hue-shift)</span>
      </label>
      <div class="${paired ? 'te-anchor-disabled-block' : ''}">
        ${pickerMarkup('companion', v.family, v.stop)}
      </div>
      <p class="te-anchor-resolved">${resolved.hex} · ${resolved.oklch}</p>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Signals anchor — 5 sub-pickers
// ---------------------------------------------------------------------------

function renderSignalsRow(
  index: number,
  label: string,
  description: string,
  signals: { error: ModedValue<ColorAnchorValue>; warning: ModedValue<ColorAnchorValue>;
             success: ModedValue<ColorAnchorValue>; info: ModedValue<ColorAnchorValue>;
             accentInfo: ModedValue<ColorAnchorValue> },
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const summary = SIGNAL_KEYS
    .map((k) => {
      const v = valueForMode(signals[k], mode);
      return `<span class="te-signal-chip" style="background:${resolveStop(v.family, v.stop).hex}" title="${SIGNAL_LABELS[k]} · ${v.family}"></span>`;
    })
    .join('');
  return `
<div class="te-anchor te-anchor--signals" data-anchor-row="signals">
  ${shapeRowHeader(index, label, `<span class="te-signal-chips">${summary}</span>`, isExpanded)}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <div class="te-signal-list">
        ${SIGNAL_KEYS.map((k) => {
          const v = valueForMode(signals[k], mode);
          return `
            <div class="te-signal-row" data-signal-row="${k}">
              <span class="te-signal-label">${SIGNAL_LABELS[k]}${modePinGlyph(signals[k])}</span>
              ${pickerMarkup(`signal-${k}`, v.family, v.stop)}
            </div>`;
        }).join('')}
      </div>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Type-face row (display, reading)
// ---------------------------------------------------------------------------

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

function renderTypeFaceRow(
  index: number,
  key: 'displayFace' | 'readingFace',
  label: string,
  description: string,
  m: ModedValue<TypeFaceValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  const options = COMMON_FONTS.includes(v.family) ? COMMON_FONTS : [v.family, ...COMMON_FONTS];
  return `
<div class="te-anchor te-anchor--type-face" data-anchor-row="${key}">
  ${shapeRowHeader(index, label, v.family, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <label class="te-control-label">Font family
        <select class="te-select" data-type-face-select>
          ${options.map((f) => `<option value="${f}" ${f === v.family ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </label>
      <p class="te-anchor-preview" style="font-family: '${v.family}', system-ui, sans-serif;">
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Type-scale row
// ---------------------------------------------------------------------------

function renderTypeScaleRow(
  index: number,
  label: string,
  description: string,
  m: ModedValue<TypeScaleValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  return `
<div class="te-anchor te-anchor--type-scale" data-anchor-row="typeScale">
  ${shapeRowHeader(index, label, `${v.basePx}px · ratio ${v.ratio}`, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <label class="te-control-label">Base size
        <input type="number" class="te-input" min="10" max="24" step="1"
               data-type-scale-base value="${v.basePx}">
        <span class="te-control-unit">px</span>
      </label>
      <label class="te-control-label">Ratio
        <input type="number" class="te-input" min="1.05" max="1.6" step="0.025"
               data-type-scale-ratio value="${v.ratio}">
      </label>
      <p class="te-anchor-preview">
        ${[5, 4, 3, 2, 1, 0]
          .map((n) => {
            const size = Math.round(v.basePx * Math.pow(v.ratio, n) * 100) / 100;
            return `<span style="font-size:${size}px">h${6 - n}</span>`;
          })
          .join(' ')}
      </p>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Shape rows
// ---------------------------------------------------------------------------

function renderSpacingRow(
  index: number,
  label: string,
  description: string,
  m: ModedValue<SpacingValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  return `
<div class="te-anchor te-anchor--spacing" data-anchor-row="spacing">
  ${shapeRowHeader(index, label, `${v.basePx}px base · ${v.kind}`, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <label class="te-control-label">Base
        <input type="number" class="te-input" min="2" max="8" step="1"
               data-spacing-base value="${v.basePx}">
        <span class="te-control-unit">px</span>
      </label>
    </div>
  ` : ''}
</div>`;
}

function renderCornersRow(
  index: number,
  label: string,
  description: string,
  m: ModedValue<CornerValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  const ratioReadout = v.derivedFrom
    ? ` · base ${v.derivedFrom.base} × ${v.derivedFrom.ratio}`
    : '';
  return `
<div class="te-anchor te-anchor--corners" data-anchor-row="corners">
  ${shapeRowHeader(index, label, `${v.s} / ${v.m} / ${v.l} / ${v.xl}${ratioReadout}`, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <div class="te-corner-grid">
        ${(['s', 'm', 'l', 'xl'] as const).map((k) => `
          <label class="te-control-label">${k.toUpperCase()}
            <input type="number" class="te-input" min="0" max="64" step="1"
                   data-corner-stop="${k}" value="${v[k]}">
            <span class="te-control-unit">px</span>
          </label>`).join('')}
      </div>
      ${v.derivedFrom ? `<p class="te-anchor-resolved">Detected ratio ladder: base ${v.derivedFrom.base} × ${v.derivedFrom.ratio}</p>` : ''}
    </div>
  ` : ''}
</div>`;
}

function renderElevationRow(
  index: number,
  label: string,
  description: string,
  m: ModedValue<ElevationValue>,
  mode: ModeKey,
  isExpanded: boolean,
): string {
  const v = valueForMode(m, mode);
  return `
<div class="te-anchor te-anchor--elevation" data-anchor-row="elevation">
  ${shapeRowHeader(index, label, `${v.borderWeight}px borders · shadow ${Math.round(v.shadowIntensity * 100)}%`, isExpanded, modePinGlyph(m))}
  ${isExpanded ? `
    <div class="te-anchor-body">
      <p class="te-anchor-description">${description}</p>
      <label class="te-control-label">Border weight
        <input type="number" class="te-input" min="0" max="3" step="1"
               data-elevation-border value="${v.borderWeight}">
        <span class="te-control-unit">px</span>
      </label>
      <label class="te-control-label">Shadow intensity
        <input type="range" class="te-range" min="0" max="100" step="5"
               data-elevation-shadow value="${Math.round(v.shadowIntensity * 100)}">
        <span class="te-control-unit">${Math.round(v.shadowIntensity * 100)}%</span>
      </label>
    </div>
  ` : ''}
</div>`;
}

// ---------------------------------------------------------------------------
// Top-level render — produces the markup for all 11 anchors
// ---------------------------------------------------------------------------

import type { Preset } from './types';

export function renderAnchorList(
  preset: Preset,
  mode: ModeKey,
  expanded: Set<string>,
): string {
  const a = preset.anchors;
  return ANCHOR_LIST.map((spec, i) => {
    const idx = i + 1;
    const isExpanded = expanded.has(spec.key);
    switch (spec.kind) {
      case 'color':
        return renderColorRow(idx, spec.key as 'surface' | 'ink' | 'accent', spec.label, spec.description,
          a[spec.key as 'surface' | 'ink' | 'accent'], mode, isExpanded);
      case 'companion':
        return renderCompanionRow(idx, spec.label, spec.description,
          a.companion.pairedToAccent, a.companion.value, mode, isExpanded);
      case 'signals':
        return renderSignalsRow(idx, spec.label, spec.description, a.signals, mode, isExpanded);
      case 'type-face':
        return renderTypeFaceRow(idx, spec.key as 'displayFace' | 'readingFace', spec.label, spec.description,
          a[spec.key as 'displayFace' | 'readingFace'], mode, isExpanded);
      case 'type-scale':
        return renderTypeScaleRow(idx, spec.label, spec.description, a.typeScale, mode, isExpanded);
      case 'spacing':
        return renderSpacingRow(idx, spec.label, spec.description, a.spacing, mode, isExpanded);
      case 'corners':
        return renderCornersRow(idx, spec.label, spec.description, a.corners, mode, isExpanded);
      case 'elevation':
        return renderElevationRow(idx, spec.label, spec.description, a.elevation, mode, isExpanded);
    }
  }).join('');
}

// ---------------------------------------------------------------------------
// Event wiring — called after each render to bind handlers
// ---------------------------------------------------------------------------

interface WireOpts {
  onEdit: OnEdit;
  scheduleWrite: () => void;
}

export function wireAnchorEvents(root: HTMLElement, opts: WireOpts): void {
  // Header toggles
  root.querySelectorAll<HTMLButtonElement>('[data-anchor-toggle]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const row = btn.closest('[data-anchor-row]') as HTMLElement | null;
      if (!row) return;
      const key = row.dataset.anchorRow!;
      const additive = e.metaKey || e.ctrlKey;
      toggleExpanded(key, additive);
    });
  });

  // Hue-family-picker events — bubble from the picker root
  root.querySelectorAll<HTMLElement>('[data-hue-family-picker]').forEach((pickerEl) => {
    pickerEl.addEventListener('hue-pick', (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        family: FamilySlug;
        value: number;
        source: string;
      };
      if (detail.source === 'set') return; // ignore programmatic changes
      const id = pickerEl.dataset.anchorPickerId!;
      const address = pickerIdToAddress(id);
      if (!address) return;
      const nextValue: ColorAnchorValue = { family: detail.family, stop: detail.value };
      const result = editAnchor.color(address, nextValue);
      if (result) opts.onEdit(result);
      // Companion auto-pair: when accent moves, refresh companion cache
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
      const result = editAnchor.typeScale({
        basePx: Number(tsBase.value),
        ratio: Number(tsRatio.value),
      });
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
      const result = editAnchor.spacing({
        basePx: Number(spBase.value),
        kind: 'linear',
      });
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
