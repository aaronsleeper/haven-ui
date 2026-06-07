/**
 * Obsidian theme.css emitter — Phase 2.
 *
 * Emits the CSS the editor's middleware writes as `theme.editor-overrides.css`
 * (composed into the runtime `theme.css` per the Path-E split). Walks all 11
 * v1 anchors, resolving each ModedValue<T> to its per-mode concrete value
 * and writing a per-mode block of Obsidian CSS variables.
 *
 * Variable coverage is the minimum needed to make every anchor visibly
 * affect the rendered theme — the full UX-proposal § 1 map is the Phase 3
 * relation layer's job. v2 emitter passes can broaden coverage when the
 * relation language ships.
 */

import type {
  Preset,
  ModeKey,
  ColorAnchorValue,
  TypeFaceValue,
  TypeScaleValue,
  CornerValue,
  ElevationValue,
} from './types';
import { valueForMode } from './types';
import { resolveStop } from './color';

const MODE_SELECTOR: Record<ModeKey, string> = {
  light: '.theme-light',
  dark: '.theme-dark',
};

function hex(value: ColorAnchorValue): string {
  return resolveStop(value.family, value.stop).hex;
}

function emitColorAnchorBlock(
  value: ColorAnchorValue,
  varNames: string[],
): string[] {
  const h = hex(value);
  return varNames.map((v) => `  ${v}: ${h};`);
}

function emitSurfaceVars(value: ColorAnchorValue): string[] {
  const primary = hex(value);
  // Soft step one stop lighter for --background-secondary. (Phase 3 replaces
  // this with sib(surface, +1).)
  const altPos = Math.min(100, value.stop + 10);
  const secondary = resolveStop(value.family, altPos).hex;
  return [
    `  --background-primary: ${primary};`,
    `  --background-secondary: ${secondary};`,
  ];
}

function emitInkVars(value: ColorAnchorValue): string[] {
  return emitColorAnchorBlock(value, [
    '--text-normal',
    '--h1-color',
    '--h2-color',
    '--h3-color',
  ]);
}

function emitAccentVars(value: ColorAnchorValue): string[] {
  return emitColorAnchorBlock(value, [
    '--interactive-accent',
    '--text-accent',
    '--link-color',
    '--checkbox-color',
  ]);
}

function emitCompanionVars(value: ColorAnchorValue): string[] {
  return emitColorAnchorBlock(value, [
    '--blockquote-border-color',
    '--tag-color',
  ]);
}

function emitSignalVar(varName: string, value: ColorAnchorValue): string {
  return `  ${varName}: ${hex(value)};`;
}

function emitTypeFaceVar(varName: string, value: TypeFaceValue): string {
  // Quote the family in case it contains whitespace.
  const quoted = /^[A-Za-z_][A-Za-z0-9_-]*$/.test(value.family)
    ? value.family
    : `'${value.family.replace(/'/g, "\\'")}'`;
  return `  ${varName}: ${quoted};`;
}

function emitTypeScaleVar(value: TypeScaleValue): string {
  return `  --font-text-size: ${value.basePx}px;`;
}

function emitCornerVars(value: CornerValue): string[] {
  return [
    `  --radius-s: ${value.s}px;`,
    `  --radius-m: ${value.m}px;`,
    `  --radius-l: ${value.l}px;`,
    `  --radius-xl: ${value.xl}px;`,
  ];
}

function emitElevationVar(value: ElevationValue): string {
  return `  --border-width: ${value.borderWeight}px;`;
}

// ---------------------------------------------------------------------------
// Per-mode block builder — collects all 11 anchors' var lines for one mode
// ---------------------------------------------------------------------------

function buildModeBlock(preset: Preset, mode: ModeKey): string {
  const a = preset.anchors;
  const lines: string[] = [];

  lines.push(...emitSurfaceVars(valueForMode(a.surface, mode)));
  lines.push(...emitInkVars(valueForMode(a.ink, mode)));
  lines.push(...emitAccentVars(valueForMode(a.accent, mode)));
  lines.push(...emitCompanionVars(valueForMode(a.companion.value, mode)));

  // Signals — 5 sub-anchors mapped to their Obsidian "text-*" variables.
  lines.push(emitSignalVar('--text-error', valueForMode(a.signals.error, mode)));
  lines.push(emitSignalVar('--text-warning', valueForMode(a.signals.warning, mode)));
  lines.push(emitSignalVar('--text-success', valueForMode(a.signals.success, mode)));

  // Type faces — these don't strictly differ by mode in v1 but we honor the
  // ModedValue contract uniformly.
  lines.push(emitTypeFaceVar('--font-display-theme', valueForMode(a.displayFace, mode)));
  lines.push(emitTypeFaceVar('--h1-font', valueForMode(a.displayFace, mode)));
  lines.push(emitTypeFaceVar('--h2-font', valueForMode(a.displayFace, mode)));
  lines.push(emitTypeFaceVar('--h3-font', valueForMode(a.displayFace, mode)));
  lines.push(emitTypeFaceVar('--font-text-theme', valueForMode(a.readingFace, mode)));
  lines.push(emitTypeFaceVar('--font-interface-theme', valueForMode(a.readingFace, mode)));

  lines.push(emitTypeScaleVar(valueForMode(a.typeScale, mode)));

  lines.push(...emitCornerVars(valueForMode(a.corners, mode)));

  lines.push(emitElevationVar(valueForMode(a.elevation, mode)));

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Top-level emit
// ---------------------------------------------------------------------------

export function emitObsidian(preset: Preset): string {
  const out: string[] = [];
  out.push(`/* Generated by @haven/theme-editor — preset: ${preset.meta.name} */`);
  for (const mode of ['light', 'dark'] as ModeKey[]) {
    out.push('');
    out.push(`${MODE_SELECTOR[mode]} {`);
    out.push(buildModeBlock(preset, mode));
    out.push('}');
  }
  return out.join('\n');
}
