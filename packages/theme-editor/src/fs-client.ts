/**
 * Filesystem-client — browser → Vite middleware shim.
 *
 * The editor never writes to disk directly; it POSTs CSS strings and PUTs
 * preset JSON to the dev-server middleware which performs the actual file
 * I/O. Same shape that any future production-bundled mode will keep.
 */

import type { Preset } from './types';

export interface TargetInfo {
  themeCss: string;
  overridesCss: string;
  presetsDir: string;
}

async function ok<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTarget(): Promise<TargetInfo> {
  return ok(await fetch('/api/target'));
}

export async function listPresets(): Promise<string[]> {
  const data = await ok<{ presets: string[] }>(await fetch('/api/presets'));
  return data.presets;
}

export async function loadPreset(name: string): Promise<Preset> {
  return ok(await fetch(`/api/presets/${encodeURIComponent(name)}`));
}

export async function savePreset(name: string, preset: Preset): Promise<void> {
  const res = await fetch(`/api/presets/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(preset, null, 2),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
}

export async function deletePreset(name: string): Promise<void> {
  const res = await fetch(`/api/presets/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
}

export async function writeThemeBlock(css: string): Promise<void> {
  const res = await fetch('/api/theme', {
    method: 'POST',
    headers: { 'content-type': 'text/css' },
    body: css,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
}
