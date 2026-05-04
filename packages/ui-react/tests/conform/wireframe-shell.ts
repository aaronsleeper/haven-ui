// wireframe-shell conformance gate. For each apps/*/design/wireframes/*.{md,mdoc}
// file, parses YAML frontmatter via gray-matter and validates the three-shape
// `shells:` contract against the current registry canon (computed via
// src/lib/shell-canon.ts):
//
//   shells: [{name, pl_shell_version}, ...]   → validated; halts if stale or
//                                                references an unregistered name
//   shells: []                                → silent skip (fragment opt-out)
//   shells:  field absent                     → warn-mode: logged, not error
//                                                strict-mode: halts with the
//                                                three-shape error message
//
// Strict-mode is gated by HAVEN_WIREFRAME_SHELL_STRICT=1. Phase 2 ships with
// strict OFF in CI so concurrent slice work continues unaffected; Phase 4 flips
// the env var (see plan §Phase 4 strict-mode flip).
//
// Closes the upstream-design-skip failure mode that produced 6 of 8 cc-05
// patches: a wireframe authored against the wrong shell ships through a
// "self-consistent" build because manifest/token/visual gates operate at
// component+per-story granularity, not at wireframe-vs-current-canon
// granularity.
//
// Usage:
//   pnpm conform:wireframe-shell                                 # walks apps/*/design/wireframes/*.{md,mdoc}
//   pnpm conform:wireframe-shell path/to/wireframe.md            # explicit files
//   HAVEN_WIREFRAME_SHELL_STRICT=1 pnpm conform:wireframe-shell  # strict mode

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  hashShell,
  loadRegistry,
  shellsFromRegistry,
  type Registry,
  type RegistryItem,
} from '../../src/lib/shell-canon.js';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const APPS_DIR = resolve(MONOREPO_ROOT, 'apps');
const WIREFRAME_NAME_RE = /^[a-zA-Z0-9_-]+\.(md|mdoc)$/;

export type ShellDeclaration = { name: string; pl_shell_version: string };

export type WireframeStatus =
  | { kind: 'absent' } // shells: field missing
  | { kind: 'fragment' } // shells: []
  | { kind: 'declared'; entries: ShellDeclaration[] }
  | { kind: 'shape-error'; reason: string };

export type WireframeRecord = {
  path: string;
  status: WireframeStatus;
};

type StaleEntry = {
  wireframe: string;
  declared: string;
};

type ValidationResult = {
  total: number;
  declaredCount: number;
  fragmentCount: number;
  absentCount: number;
  // per-shell stale wireframes (shell name → list)
  stale: Map<string, StaleEntry[]>;
  // wireframes referencing unregistered shell names
  unregistered: { wireframe: string; shellName: string }[];
  // wireframes with malformed shells: shape
  shapeErrors: { wireframe: string; reason: string }[];
  // wireframes missing shells: declaration entirely
  absent: string[];
};

function discoverWireframes(): string[] {
  if (!existsSync(APPS_DIR)) return [];
  const found: string[] = [];
  for (const app of readdirSync(APPS_DIR, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    const wfDir = resolve(APPS_DIR, app.name, 'design/wireframes');
    if (!existsSync(wfDir)) continue;
    for (const entry of readdirSync(wfDir, { withFileTypes: true })) {
      if (entry.isFile() && WIREFRAME_NAME_RE.test(entry.name)) {
        found.push(resolve(wfDir, entry.name));
      }
    }
  }
  return found;
}

export function parseWireframe(path: string): WireframeRecord {
  const raw = readFileSync(path, 'utf-8');
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  if (!('shells' in data)) {
    return { path, status: { kind: 'absent' } };
  }

  const shells = data.shells;

  if (!Array.isArray(shells)) {
    return {
      path,
      status: {
        kind: 'shape-error',
        reason: `'shells:' must be an array; got ${typeof shells}`,
      },
    };
  }

  if (shells.length === 0) {
    return { path, status: { kind: 'fragment' } };
  }

  const entries: ShellDeclaration[] = [];
  for (let i = 0; i < shells.length; i++) {
    const item = shells[i];
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      return {
        path,
        status: {
          kind: 'shape-error',
          reason: `'shells[${i}]' must be an object with 'name' and 'pl_shell_version' string fields`,
        },
      };
    }
    const obj = item as Record<string, unknown>;
    if (typeof obj.name !== 'string' || obj.name.length === 0) {
      return {
        path,
        status: {
          kind: 'shape-error',
          reason: `'shells[${i}].name' must be a non-empty string`,
        },
      };
    }
    if (typeof obj.pl_shell_version !== 'string' || obj.pl_shell_version.length === 0) {
      return {
        path,
        status: {
          kind: 'shape-error',
          reason: `'shells[${i}].pl_shell_version' must be a non-empty string (e.g., 'sha256:...')`,
        },
      };
    }
    entries.push({ name: obj.name, pl_shell_version: obj.pl_shell_version });
  }

  return { path, status: { kind: 'declared', entries } };
}

export function validateWireframes(
  records: WireframeRecord[],
  registry: Registry,
): ValidationResult {
  const shells = shellsFromRegistry(registry);
  const canonByName = new Map<string, string>();
  for (const shell of shells) {
    canonByName.set(shell.name, hashShell(shell));
  }

  const result: ValidationResult = {
    total: records.length,
    declaredCount: 0,
    fragmentCount: 0,
    absentCount: 0,
    stale: new Map(),
    unregistered: [],
    shapeErrors: [],
    absent: [],
  };

  for (const record of records) {
    const { path, status } = record;
    switch (status.kind) {
      case 'absent':
        result.absentCount++;
        result.absent.push(path);
        break;
      case 'fragment':
        result.declaredCount++;
        result.fragmentCount++;
        break;
      case 'shape-error':
        result.declaredCount++;
        result.shapeErrors.push({ wireframe: path, reason: status.reason });
        break;
      case 'declared':
        result.declaredCount++;
        for (const entry of status.entries) {
          const currentCanon = canonByName.get(entry.name);
          if (currentCanon === undefined) {
            result.unregistered.push({
              wireframe: path,
              shellName: entry.name,
            });
            continue;
          }
          if (entry.pl_shell_version !== currentCanon) {
            const existing = result.stale.get(entry.name) ?? [];
            existing.push({
              wireframe: path,
              declared: entry.pl_shell_version,
            });
            result.stale.set(entry.name, existing);
          }
        }
        break;
    }
  }

  return result;
}

function relPath(p: string): string {
  return relative(MONOREPO_ROOT, p);
}

function emitCounter(strict: boolean, result: ValidationResult): void {
  const declared = result.declaredCount;
  const total = result.total;
  const remaining = total - declared;
  const mode = strict ? 'strict' : 'warn-mode';
  const trailer = strict
    ? ''
    : `; ${remaining} remaining for Phase 4 readiness`;
  console.log(
    `wireframe-shell gate (${mode}) — ${declared} of ${total} wireframes have 'shells:' declaration${trailer}`,
  );
}

function emitShapeErrors(result: ValidationResult): void {
  const { shapeErrors } = result;
  if (shapeErrors.length === 0) return;
  console.error(
    `\nwireframe-shell gate FAILED — ${shapeErrors.length} wireframe(s) with invalid 'shells:' shape:`,
  );
  for (const { wireframe, reason } of shapeErrors) {
    console.error(`  ${relPath(wireframe)}: ${reason}`);
  }
  console.error(
    `\n  'shells:' must be an array of {name: string, pl_shell_version: string} objects, ` +
      `or '[]' for fragment-spec wireframes (component-only, no shell composition).`,
  );
}

function emitUnregistered(
  result: ValidationResult,
  registry: Registry,
): void {
  const { unregistered } = result;
  if (unregistered.length === 0) return;
  const registeredNames = shellsFromRegistry(registry)
    .map((s) => s.name)
    .sort()
    .join(', ');
  console.error(
    `\nwireframe-shell gate FAILED — ${unregistered.length} wireframe(s) declare unregistered shells:`,
  );
  for (const { wireframe, shellName } of unregistered) {
    console.error(
      `  ${relPath(wireframe)} declares shell '${shellName}'.`,
    );
  }
  console.error(`\n  Registered shells: ${registeredNames || '(none)'}.`);
}

// Per-shell declaration totals are computed by main() from the records and
// passed in here so the validation result doesn't need to surface them as part
// of its return shape (only stale wireframes need surfacing for non-display
// callers like tests).
function emitStale(
  result: ValidationResult,
  registry: Registry,
  declarationsByShell: Map<string, number>,
): void {
  const { stale } = result;
  if (stale.size === 0) return;

  const shellMap = new Map<string, RegistryItem>();
  for (const item of shellsFromRegistry(registry)) {
    shellMap.set(item.name, item);
  }

  console.error(
    `\nwireframe-shell gate FAILED — ${stale.size} shell(s) with stale wireframes:`,
  );

  const sortedShells = [...stale.keys()].sort();
  for (const shellName of sortedShells) {
    const entries = stale.get(shellName)!;
    const total = declarationsByShell.get(shellName) ?? entries.length;
    const item = shellMap.get(shellName);
    const currentCanon = item ? hashShell(item) : '(unknown)';

    console.error(`\n  shell '${shellName}':`);
    console.error(`    current canon: ${currentCanon}`);
    console.error('');
    console.error(
      `    ${entries.length} of ${total} wireframes declaring this shell ` +
        `${entries.length === 1 ? 'is' : 'are'} stale:`,
    );
    // Align declared-hash column for scannability
    const longestPath = Math.max(
      ...entries.map((e) => relPath(e.wireframe).length),
    );
    for (const entry of entries) {
      const rel = relPath(entry.wireframe);
      const pad = ' '.repeat(Math.max(2, longestPath - rel.length + 2));
      console.error(`      ${rel}${pad}declares: ${entry.declared}`);
    }
  }

  console.error('');
  console.error(`  Action per stale wireframe:`);
  console.error(
    `    1. Re-run the wireframe-vs-PL delta review (haven-mapper) — confirm composition still fits the new contract`,
  );
  console.error(`    2. Update 'pl_shell_version' to the current canon for that shell`);
  console.error(
    `    3. Source canonical hashes with: pnpm --filter @haven/ui-react shell-canon`,
  );
  console.error('');
  console.error(
    `  Note: this gate enforces "I saw this canon," not "I reconciled my composition against this canon."`,
  );
  console.error(
    `        The hash records observation; the haven-mapper step records reconciliation. Don't skip step 1.`,
  );
}

function emitAbsentStrict(result: ValidationResult): void {
  if (result.absent.length === 0) return;
  console.error(
    `\nwireframe-shell gate FAILED — ${result.absent.length} wireframe(s) missing 'shells:' declaration:`,
  );
  for (const path of result.absent) {
    console.error(`  ${relPath(path)}`);
  }
  console.error(
    `\n  Add 'shells: [{name, pl_shell_version}]' for screens or 'shells: []' for fragments.`,
  );
}

function emitAbsentWarn(result: ValidationResult): void {
  if (result.absent.length === 0) return;
  console.log(
    `\n  warn: ${result.absent.length} wireframe(s) missing 'shells:' declaration ` +
      `(non-blocking in Phase 2):`,
  );
  for (const path of result.absent) {
    console.log(`    ${relPath(path)}`);
  }
}

function declarationsByShellFromRecords(
  records: WireframeRecord[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    if (record.status.kind !== 'declared') continue;
    for (const entry of record.status.entries) {
      counts.set(entry.name, (counts.get(entry.name) ?? 0) + 1);
    }
  }
  return counts;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : discoverWireframes();
  const strict = process.env.HAVEN_WIREFRAME_SHELL_STRICT === '1';

  if (targets.length === 0) {
    console.log(
      'wireframe-shell gate — no .{md,mdoc} wireframes found under apps/*/design/wireframes/; nothing to check',
    );
    return;
  }

  const registry = loadRegistry();
  const records = targets.map((path) => parseWireframe(path));
  const result = validateWireframes(records, registry);

  emitCounter(strict, result);

  // Per-target tick line — mirrors wireframe-completeness.ts UX
  const staleSet = new Set<string>();
  for (const entries of result.stale.values()) {
    for (const e of entries) staleSet.add(e.wireframe);
  }
  const unregisteredSet = new Set(result.unregistered.map((u) => u.wireframe));
  const shapeErrorSet = new Set(result.shapeErrors.map((s) => s.wireframe));
  for (const record of records) {
    const rel = relPath(record.path);
    const failed =
      staleSet.has(record.path) ||
      unregisteredSet.has(record.path) ||
      shapeErrorSet.has(record.path);
    if (failed) console.log(`  ✗ ${rel}`);
    else if (record.status.kind === 'absent') console.log(`  · ${rel}`);
    else console.log(`  ✓ ${rel}`);
  }

  emitShapeErrors(result);
  emitUnregistered(result, registry);
  emitStale(result, registry, declarationsByShellFromRecords(records));

  if (strict) {
    emitAbsentStrict(result);
  } else {
    emitAbsentWarn(result);
  }

  const blockingFailures =
    result.shapeErrors.length +
    result.unregistered.length +
    result.stale.size +
    (strict ? result.absent.length : 0);

  if (blockingFailures > 0) {
    process.exit(1);
  }

  console.log(
    `\nwireframe-shell gate PASSED — ${result.declaredCount} declared (${result.fragmentCount} fragment) of ${result.total} wireframes; 0 stale, 0 unregistered, 0 shape errors.`,
  );
}

// Run only when invoked as a script (not when imported by tests). tsx sets
// import.meta.url to the resolved file URL of the script entry; if a test
// imports this module, that condition is false and main() does not run.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
