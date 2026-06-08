/**
 * Canonical relation registry — UX proposal §1 transcription.
 *
 * Each entry binds one Obsidian CSS variable to a relation expression
 * over the 11 anchors. Presets store ONLY overrides + locks against this
 * registry; on emit, every registered relation gets walked and resolved
 * against the current preset.
 *
 * Source: ~/.claude/plans/haven-theme-editor-ux-proposal.md §1 + worked
 * examples in §2. When a UX proposal entry says "ref(surface, 50)" the
 * entry here mirrors that AST verbatim.
 *
 * NOT comprehensive of all 422 Obsidian vars — covers the vars UX proposal §1
 * explicitly names (~100 entries). The remaining ~300 vars stay at
 * Obsidian defaults; the Tokens layer (Phase 4) exposes them for override.
 */

import type { RegisteredRelation } from './types';

// Convenience constructors for readability.
const ref = (anchor: Parameters<typeof refImpl>[0], stop: number): import('./types').ColorRelation =>
  ({ op: 'ref', anchor, stop });
const traverse = (anchor: Parameters<typeof refImpl>[0], delta: number): import('./types').ColorRelation =>
  ({ op: 'traverse', anchor, delta });
const sib = (anchor: Parameters<typeof refImpl>[0], delta?: number): import('./types').ColorRelation =>
  ({ op: 'sib', anchor, delta });
const cross = (anchor: Parameters<typeof refImpl>[0], stop: number): import('./types').ColorRelation =>
  ({ op: 'cross', anchor, stop });
const alpha = (inner: import('./types').ColorRelation, opacity: number): import('./types').ColorRelation =>
  ({ op: 'alpha', inner, opacity });
const ratio = (anchor: 'typeScale', step: number, baseOverride?: number): import('./types').NonColorRelation =>
  ({ op: 'ratio', anchor, step, baseOverride });
const multiple = (anchor: 'spacing' | 'corners' | 'elevation', n: number): import('./types').NonColorRelation =>
  ({ op: 'multiple', anchor, n });
const stop = (
  anchor: 'spacing' | 'corners' | 'elevation',
  name: 'hairline' | 's' | 'm' | 'l' | 'xl',
): import('./types').NonColorRelation => ({ op: 'stop', anchor, name });

// Phantom constructor — used only for type inference on the convenience
// shorthand above (TypeScript needs a concrete type to pin the anchor union).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function refImpl(_a: import('./types').ColorAnchorRef): void {}

// ---------------------------------------------------------------------------
// Surface anchor — warm ground; backgrounds + base scale + chrome surfaces
// ---------------------------------------------------------------------------

const SURFACE_RELATIONS: RegisteredRelation[] = [
  // Base scale 00→70 — Obsidian's stratified background ladder.
  { cssVar: '--color-base-00', expr: ref('surface', 50),  description: 'Base 00 — lightest, headline surface', anchorKey: 'surface' },
  { cssVar: '--color-base-10', expr: ref('surface', 100), description: 'Base 10 — primary surface',           anchorKey: 'surface' },
  { cssVar: '--color-base-20', expr: ref('surface', 200), description: 'Base 20 — softened surface',          anchorKey: 'surface' },
  { cssVar: '--color-base-25', expr: ref('surface', 300), description: 'Base 25 — quieter surface',           anchorKey: 'surface' },
  { cssVar: '--color-base-30', expr: ref('surface', 400), description: 'Base 30 — separators',                anchorKey: 'surface' },
  { cssVar: '--color-base-35', expr: ref('surface', 500), description: 'Base 35 — neutral middle',            anchorKey: 'surface' },
  { cssVar: '--color-base-40', expr: ref('surface', 600), description: 'Base 40 — quiet borders',             anchorKey: 'surface' },
  { cssVar: '--color-base-50', expr: ref('surface', 700), description: 'Base 50 — assertive borders',         anchorKey: 'surface' },
  { cssVar: '--color-base-60', expr: ref('surface', 800), description: 'Base 60 — heavy surface',             anchorKey: 'surface' },
  { cssVar: '--color-base-70', expr: ref('surface', 900), description: 'Base 70 — darkest chrome',            anchorKey: 'surface' },

  // Backgrounds — UX proposal §2 worked example direct quotes.
  { cssVar: '--background-primary',       expr: ref('surface', 50),                          description: 'Primary editor background',                       anchorKey: 'surface' },
  { cssVar: '--background-primary-alt',   expr: sib('surface'),                              description: 'One stop softer than primary',                    anchorKey: 'surface' },
  { cssVar: '--background-secondary',     expr: sib('surface', 2),                           description: 'Two stops softer — sidebar / secondary surfaces', anchorKey: 'surface' },
  { cssVar: '--background-secondary-alt', expr: sib('surface', 3),                           description: 'Three stops softer — quieter secondary',          anchorKey: 'surface' },
  { cssVar: '--background-modifier-hover',expr: alpha(traverse('surface', 2), 0.4),          description: 'Hover modifier — surface + 2 stops at 40% alpha',  anchorKey: 'surface' },
  { cssVar: '--titlebar-background',      expr: ref('surface', 100),                         description: 'Title bar background',                            anchorKey: 'surface' },
  { cssVar: '--ribbon-background',        expr: ref('surface', 100),                         description: 'Sidebar ribbon background',                       anchorKey: 'surface' },
  { cssVar: '--modal-background',         expr: ref('surface', 50),                          description: 'Modal background — same as primary',              anchorKey: 'surface' },
];

// ---------------------------------------------------------------------------
// Ink anchor — reading colour + figure on the ground
// ---------------------------------------------------------------------------

const INK_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--text-normal',        expr: ref('ink', 900), description: 'Body text',                anchorKey: 'ink' },
  { cssVar: '--text-muted',         expr: ref('ink', 700), description: 'Muted body text',          anchorKey: 'ink' },
  { cssVar: '--text-faint',         expr: ref('ink', 500), description: 'Faint helper text',        anchorKey: 'ink' },
  { cssVar: '--h1-color',           expr: ref('ink', 900), description: 'H1 heading colour',        anchorKey: 'ink' },
  { cssVar: '--h2-color',           expr: ref('ink', 900), description: 'H2 heading colour',        anchorKey: 'ink' },
  { cssVar: '--h3-color',           expr: ref('ink', 800), description: 'H3 heading colour',        anchorKey: 'ink' },
  { cssVar: '--h4-color',           expr: ref('ink', 800), description: 'H4 heading colour',        anchorKey: 'ink' },
  { cssVar: '--h5-color',           expr: ref('ink', 700), description: 'H5 heading colour',        anchorKey: 'ink' },
  { cssVar: '--h6-color',           expr: ref('ink', 700), description: 'H6 heading colour',        anchorKey: 'ink' },
  { cssVar: '--inline-title-color', expr: ref('ink', 900), description: 'Inline note title colour', anchorKey: 'ink' },
];

// ---------------------------------------------------------------------------
// Accent anchor — interactive register
// ---------------------------------------------------------------------------

const ACCENT_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--color-accent',                   expr: ref('accent', 700),       description: 'Primary accent colour',           anchorKey: 'accent' },
  { cssVar: '--color-accent-1',                 expr: traverse('accent', -1),   description: 'Accent variant 1 — slightly darker', anchorKey: 'accent' },
  { cssVar: '--color-accent-2',                 expr: traverse('accent', 1),    description: 'Accent variant 2 — slightly lighter', anchorKey: 'accent' },
  { cssVar: '--interactive-accent',             expr: ref('accent', 700),       description: 'Interactive accent — buttons, fills', anchorKey: 'accent' },
  { cssVar: '--interactive-accent-hover',       expr: traverse('accent', -1),   description: 'Interactive accent hover — one stop darker', anchorKey: 'accent' },
  { cssVar: '--link-color',                     expr: ref('accent', 700),       description: 'Link colour',                     anchorKey: 'accent' },
  { cssVar: '--link-color-hover',               expr: traverse('accent', 1),    description: 'Link hover — one stop lighter',   anchorKey: 'accent' },
  { cssVar: '--text-accent',                    expr: ref('accent', 700),       description: 'Accent text colour',              anchorKey: 'accent' },
  { cssVar: '--text-accent-hover',              expr: traverse('accent', -1),   description: 'Accent text hover',               anchorKey: 'accent' },
  { cssVar: '--icon-color-active',              expr: ref('accent', 700),       description: 'Active icon colour',              anchorKey: 'accent' },
  { cssVar: '--checkbox-color',                 expr: ref('accent', 700),       description: 'Checkbox accent',                 anchorKey: 'accent' },
  { cssVar: '--background-modifier-border-focus', expr: ref('accent', 500),     description: 'Focus border on interactive elements', anchorKey: 'accent' },
  { cssVar: '--slider-thumb-border-color',      expr: ref('accent', 700),       description: 'Slider thumb border',             anchorKey: 'accent' },
];

// ---------------------------------------------------------------------------
// Companion anchor — second voice; hue-shift partner
// ---------------------------------------------------------------------------

const COMPANION_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--blockquote-border-color', expr: cross('companion', 700), description: 'Blockquote border — sage-on-teal-surface (UX proposal Tension 3 example)', anchorKey: 'companion' },
  { cssVar: '--tag-color',               expr: cross('companion', 700), description: 'Tag text colour',                                                            anchorKey: 'companion' },
  { cssVar: '--tag-background',          expr: cross('companion', 200), description: 'Tag background',                                                             anchorKey: 'companion' },
  { cssVar: '--text-highlight-bg',       expr: cross('companion', 100), description: 'Highlighted text background',                                                anchorKey: 'companion' },
  { cssVar: '--code-function',           expr: cross('companion', 600), description: 'Code function colour',                                                       anchorKey: 'companion' },
];

// ---------------------------------------------------------------------------
// Signals — 5 sub-anchors mapped to Obsidian functional colours
// ---------------------------------------------------------------------------

const SIGNALS_RELATIONS: RegisteredRelation[] = [
  // Error / red
  { cssVar: '--color-red',                       expr: ref('signals.error', 500),     description: 'Error / red family root',                anchorKey: 'signals' },
  { cssVar: '--text-error',                      expr: ref('signals.error', 700),     description: 'Error text colour',                      anchorKey: 'signals' },
  { cssVar: '--background-modifier-error',       expr: alpha(ref('signals.error', 500), 0.2), description: 'Error background modifier',      anchorKey: 'signals' },
  { cssVar: '--alert-error',                     expr: ref('signals.error', 500),     description: 'Error alert (haven canon: alert-error)',  anchorKey: 'signals' },

  // Warning / yellow
  { cssVar: '--color-yellow',                    expr: ref('signals.warning', 500),   description: 'Warning / yellow family root',           anchorKey: 'signals' },
  { cssVar: '--text-warning',                    expr: ref('signals.warning', 700),   description: 'Warning text colour',                    anchorKey: 'signals' },
  { cssVar: '--background-modifier-warning',     expr: alpha(ref('signals.warning', 500), 0.2), description: 'Warning background modifier', anchorKey: 'signals' },
  { cssVar: '--alert-warning',                   expr: ref('signals.warning', 500),   description: 'Warning alert (haven canon: alert-warning)', anchorKey: 'signals' },

  // Success / green
  { cssVar: '--color-green',                     expr: ref('signals.success', 500),   description: 'Success / green family root',            anchorKey: 'signals' },
  { cssVar: '--text-success',                    expr: ref('signals.success', 700),   description: 'Success text colour',                    anchorKey: 'signals' },
  { cssVar: '--background-modifier-success',     expr: alpha(ref('signals.success', 500), 0.2), description: 'Success background modifier', anchorKey: 'signals' },
  { cssVar: '--alert-success',                   expr: ref('signals.success', 500),   description: 'Success alert (haven canon: alert-success)', anchorKey: 'signals' },

  // Info / blue
  { cssVar: '--color-blue',                      expr: ref('signals.info', 500),      description: 'Info / blue family root',                anchorKey: 'signals' },
  { cssVar: '--alert-info',                      expr: ref('signals.info', 500),      description: 'Info alert (haven canon: alert-info)',   anchorKey: 'signals' },

  // Accent-info / cyan
  { cssVar: '--color-cyan',                      expr: ref('signals.accentInfo', 500), description: 'Accent-info / cyan family root',        anchorKey: 'signals' },
  { cssVar: '--signal-info-accent',              expr: ref('signals.accentInfo', 500), description: 'Cyan accent-info design token (NOT a directive class — per HVD 2026-06-08: alert-* directive vocabulary stays at 4 variants info/warning/success/error)', anchorKey: 'signals' },
];

// ---------------------------------------------------------------------------
// Type — display face, reading face, type scale
//
// Type-face vars (--font-display-theme, --h1-font, --font-text-theme, etc.)
// are emitted as raw font-family strings by the emitter, not through a
// relation. Those bindings stay in emitter-obsidian.ts. The registry only
// owns the relation language; raw string-valued vars are out of scope.
// ---------------------------------------------------------------------------

const TYPE_SCALE_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--font-text-size', expr: ratio('typeScale', 0),  description: 'Body text size (base × ratio⁰ = base)', anchorKey: 'typeScale' },
  { cssVar: '--h1-size',        expr: ratio('typeScale', 5),  description: 'H1 size (base × ratio⁵)',                anchorKey: 'typeScale' },
  { cssVar: '--h2-size',        expr: ratio('typeScale', 4),  description: 'H2 size (base × ratio⁴)',                anchorKey: 'typeScale' },
  { cssVar: '--h3-size',        expr: ratio('typeScale', 3),  description: 'H3 size (base × ratio³)',                anchorKey: 'typeScale' },
  { cssVar: '--h4-size',        expr: ratio('typeScale', 2),  description: 'H4 size (base × ratio²)',                anchorKey: 'typeScale' },
  { cssVar: '--h5-size',        expr: ratio('typeScale', 1),  description: 'H5 size (base × ratio¹)',                anchorKey: 'typeScale' },
  { cssVar: '--h6-size',        expr: ratio('typeScale', 0),  description: 'H6 size (base × ratio⁰)',                anchorKey: 'typeScale' },
  { cssVar: '--font-ui-small',  expr: ratio('typeScale', -1), description: 'UI small text (one step down)',          anchorKey: 'typeScale' },
  { cssVar: '--font-ui-medium', expr: ratio('typeScale', 0),  description: 'UI medium text',                         anchorKey: 'typeScale' },
  { cssVar: '--font-ui-larger', expr: ratio('typeScale', 1),  description: 'UI larger text',                         anchorKey: 'typeScale' },
];

// ---------------------------------------------------------------------------
// Shape — spacing, corners, elevation
// ---------------------------------------------------------------------------

const SPACING_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--size-4-1',  expr: multiple('spacing', 1),  description: '4-1 — 1× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-2',  expr: multiple('spacing', 2),  description: '4-2 — 2× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-3',  expr: multiple('spacing', 3),  description: '4-3 — 3× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-4',  expr: multiple('spacing', 4),  description: '4-4 — 4× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-6',  expr: multiple('spacing', 6),  description: '4-6 — 6× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-8',  expr: multiple('spacing', 8),  description: '4-8 — 8× spacing base',  anchorKey: 'spacing' },
  { cssVar: '--size-4-12', expr: multiple('spacing', 12), description: '4-12 — 12× spacing base', anchorKey: 'spacing' },
  { cssVar: '--size-4-16', expr: multiple('spacing', 16), description: '4-16 — 16× spacing base', anchorKey: 'spacing' },
  { cssVar: '--size-4-18', expr: multiple('spacing', 18), description: '4-18 — 18× spacing base', anchorKey: 'spacing' },
  { cssVar: '--size-2-1',  expr: multiple('spacing', 0.5),description: '2-1 — half spacing base', anchorKey: 'spacing' },
  { cssVar: '--size-2-2',  expr: multiple('spacing', 1),  description: '2-2 — 1× spacing base',   anchorKey: 'spacing' },
  { cssVar: '--size-2-3',  expr: multiple('spacing', 1.5),description: '2-3 — 1.5× spacing base', anchorKey: 'spacing' },
  { cssVar: '--p-spacing', expr: multiple('spacing', 4),  description: 'Paragraph spacing',       anchorKey: 'spacing' },
];

const CORNER_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--radius-s',       expr: stop('corners', 's'),  description: 'Small radius',                  anchorKey: 'corners' },
  { cssVar: '--radius-m',       expr: stop('corners', 'm'),  description: 'Medium radius',                 anchorKey: 'corners' },
  { cssVar: '--radius-l',       expr: stop('corners', 'l'),  description: 'Large radius',                  anchorKey: 'corners' },
  { cssVar: '--radius-xl',      expr: stop('corners', 'xl'), description: 'Extra-large radius',            anchorKey: 'corners' },
  { cssVar: '--button-radius',  expr: stop('corners', 's'),  description: 'Button radius',                 anchorKey: 'corners' },
  { cssVar: '--tab-radius',     expr: stop('corners', 'm'),  description: 'Tab radius',                    anchorKey: 'corners' },
  { cssVar: '--modal-radius',   expr: stop('corners', 'l'),  description: 'Modal radius',                  anchorKey: 'corners' },
  { cssVar: '--input-radius',   expr: stop('corners', 's'),  description: 'Input field radius',            anchorKey: 'corners' },
  { cssVar: '--popover-radius', expr: stop('corners', 'm'),  description: 'Popover radius',                anchorKey: 'corners' },
];

const ELEVATION_RELATIONS: RegisteredRelation[] = [
  { cssVar: '--border-width', expr: stop('elevation', 'hairline'), description: 'Default border width', anchorKey: 'elevation' },
];

// ---------------------------------------------------------------------------
// Combined registry — keyed by Obsidian CSS variable name
// ---------------------------------------------------------------------------

const ALL_REGISTERED: RegisteredRelation[] = [
  ...SURFACE_RELATIONS,
  ...INK_RELATIONS,
  ...ACCENT_RELATIONS,
  ...COMPANION_RELATIONS,
  ...SIGNALS_RELATIONS,
  ...TYPE_SCALE_RELATIONS,
  ...SPACING_RELATIONS,
  ...CORNER_RELATIONS,
  ...ELEVATION_RELATIONS,
];

export const RELATION_REGISTRY: Record<string, RegisteredRelation> = (() => {
  const out: Record<string, RegisteredRelation> = {};
  for (const r of ALL_REGISTERED) {
    out[r.cssVar] = r;
  }
  return out;
})();

/** Ordered list (insertion order) — for the Relations section UI. */
export const REGISTERED_RELATIONS: RegisteredRelation[] = ALL_REGISTERED;

/** Sanity check — fires only in development. */
if (typeof window !== 'undefined' && Object.keys(RELATION_REGISTRY).length !== ALL_REGISTERED.length) {
  console.warn('relation-registry: duplicate cssVar entries detected');
}
