// Shell-canon library — the hash function and registry helpers used by:
//   - The CLI (scripts/print-shell-canon.ts)
//   - The wireframe-shell gate (tests/conform/wireframe-shell.ts, ships Phase 2)
//   - Self-tests (tests/conform/__tests__/wireframe-shell.test.ts)
//
// Lives in src/lib so importing it does NOT trigger CLI side effects (the CLI's
// process.exit pattern is a module-load hazard for importers; this split avoids it).
//
// Hash inputs (canon source-of-truth):
//   - `name` (top-level)
//   - `haven.composition.slotModel`
//   - `haven.composition.allowedChildren`
//   - `haven.composition.markdocTag`
//   - `haven.composition.propSchema`
//   - `haven.isAppShell`
//   - The entry React component file path — `files[]` filtered to `.tsx` only
//   - The canonicalized pattern-library HTML at `haven.patternLibraryHtml`
//
// Explicitly NOT in the hash: haven.notes, haven.brandReviewed,
// haven.a11yReviewed, haven.stories — these can churn without composition impact.

import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalizeShellHtml } from './canonicalize-shell-html.js';

export type RegistryFile = { path: string; type: string };
export type RegistryItem = {
  name: string;
  files: RegistryFile[];
  haven?: {
    isAppShell?: boolean;
    patternLibraryHtml?: string;
    composition?: {
      slotModel?: string | null;
      allowedChildren?: unknown[];
      markdocTag?: string | null;
      propSchema?: unknown;
    };
    notes?: string;
    brandReviewed?: boolean;
    a11yReviewed?: boolean;
    stories?: unknown[];
  };
};
export type Registry = { items: RegistryItem[] };

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const REGISTRY_PATH = resolve(PACKAGE_ROOT, 'registry.json');

export function loadRegistry(): Registry {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
}

export function shellsFromRegistry(registry: Registry): RegistryItem[] {
  return registry.items.filter((i) => i.haven?.isAppShell === true);
}

function entryTsxPath(item: RegistryItem): string {
  const entry = item.files.find(
    (f) => f.path.endsWith('.tsx') && !f.path.endsWith('.props.tsx'),
  );
  if (!entry) {
    throw new Error(
      `shell '${item.name}' has no .tsx entry in files[]. files: ${JSON.stringify(item.files)}`,
    );
  }
  return entry.path;
}

function resolvePatternLibraryHtml(item: RegistryItem): string {
  const rel = item.haven?.patternLibraryHtml;
  if (!rel) {
    throw new Error(`shell '${item.name}' has no haven.patternLibraryHtml`);
  }
  const abs = isAbsolute(rel) ? rel : resolve(PACKAGE_ROOT, rel);
  if (!existsSync(abs)) {
    throw new Error(
      `shell '${item.name}' references patternLibraryHtml '${rel}' which does not exist on disk at ${abs}. Either restore the file or unregister the shell.`,
    );
  }
  return readFileSync(abs, 'utf-8');
}

type ShellHashInput = {
  name: string;
  haven: {
    isAppShell: boolean;
    composition: {
      slotModel: string | null;
      allowedChildren: unknown[];
      markdocTag: string | null;
      propSchema: unknown;
    };
  };
  entryFile: string;
  patternLibraryHtmlCanonicalized: string;
};

function buildHashInput(item: RegistryItem): ShellHashInput {
  const composition = item.haven?.composition ?? {};
  const html = resolvePatternLibraryHtml(item);
  return {
    name: item.name,
    haven: {
      isAppShell: item.haven?.isAppShell === true,
      composition: {
        slotModel: composition.slotModel ?? null,
        allowedChildren: composition.allowedChildren ?? [],
        markdocTag: composition.markdocTag ?? null,
        propSchema: composition.propSchema ?? null,
      },
    },
    entryFile: entryTsxPath(item),
    patternLibraryHtmlCanonicalized: canonicalizeShellHtml(html),
  };
}

export function hashShell(item: RegistryItem): string {
  const input = buildHashInput(item);
  const serialized = JSON.stringify(input);
  const digest = createHash('sha256').update(serialized).digest('hex');
  return `sha256:${digest}`;
}
