// pnpm shell-canon — prints the canonical hash for each registered app shell.
//
// Used by:
//   - Wireframe authors / haven-mapper to source the `pl_shell_version` hash
//     when authoring or refreshing a wireframe's `shells:` frontmatter
//   - CI in Phase 2 (skip-when-absent mode) to compute current canon
//   - The `--audit` flag is the Phase 4 strict-flip precondition: scans all
//     wireframes and reports zero-or-more missing `shells:` declarations
//
// Flags:
//   (default)   — text output: `<shell-name>  sha256:<hash>` per line
//   --json      — JSON output: { "<shell-name>": "sha256:<hash>", ... }
//   --audit     — scan apps/*/design/wireframes/ for `shells:` declaration; exit
//                 1 if any wireframe is missing the field; exit 0 if all declared

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  hashShell,
  loadRegistry,
  shellsFromRegistry,
} from '../src/lib/shell-canon.js';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const APPS_DIR = resolve(MONOREPO_ROOT, 'apps');
const WIREFRAME_NAME_RE = /^[a-zA-Z0-9_-]+\.(md|mdoc)$/;

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

type AuditEntry = { file: string; declared: boolean };

function auditWireframes(): AuditEntry[] {
  const entries: AuditEntry[] = [];
  for (const file of discoverWireframes()) {
    const raw = readFileSync(file, 'utf-8');
    const parsed = matter(raw);
    const shells = (parsed.data as Record<string, unknown>)['shells'];
    entries.push({ file, declared: shells !== undefined });
  }
  return entries;
}

function printText(hashes: Map<string, string>): void {
  for (const [name, hash] of hashes) {
    console.log(`${name}  ${hash}`);
  }
}

function printJson(hashes: Map<string, string>): void {
  const obj: Record<string, string> = {};
  for (const [name, hash] of hashes) obj[name] = hash;
  console.log(JSON.stringify(obj, null, 2));
}

function runAudit(): number {
  const entries = auditWireframes();
  const total = entries.length;
  const declared = entries.filter((e) => e.declared).length;
  const missing = entries.filter((e) => !e.declared);

  console.log(`shell-canon --audit — ${declared} of ${total} wireframes declare 'shells:'`);

  if (missing.length === 0) {
    console.log(`\nready for Phase 4 strict-mode flip — zero undeclared wireframes.`);
    return 0;
  }

  console.error(`\n${missing.length} wireframe(s) missing 'shells:' declaration:`);
  for (const m of missing) {
    console.error(`  ${relative(MONOREPO_ROOT, m.file)}`);
  }
  console.error(
    `\nAdd 'shells: [{name, pl_shell_version}]' for screens or 'shells: []' for fragments.`,
  );
  return 1;
}

function main(): number {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const audit = args.includes('--audit');

  if (audit) return runAudit();

  const registry = loadRegistry();
  const shells = shellsFromRegistry(registry);
  if (shells.length === 0) {
    console.error('shell-canon — no registered shells (haven.isAppShell: true)');
    return 1;
  }

  const hashes = new Map<string, string>();
  for (const shell of shells) {
    hashes.set(shell.name, hashShell(shell));
  }

  if (json) printJson(hashes);
  else printText(hashes);
  return 0;
}

process.exit(main());
