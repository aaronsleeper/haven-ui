// Wireframe-completeness conformance gate. For each .mdoc wireframe under
// apps/*/design/wireframes/, parses the Markdoc AST and asserts that any
// wireframe containing an interactive-input tag (registry entry with
// haven.requiresTerminal: true) also contains at least one terminal-action
// tag (registry entry with haven.isTerminalAction: true).
//
// Gap surfaced by Accessibility panel review 2026-04-20: the GAD-7 pilot
// wireframe included a response-option-group but no submit / advance
// affordance — a keyboard-only user could select but could not progress.
// WCAG 2.1.1 Keyboard (A) + 2.4.3 Focus Order (A). Manifest / token /
// visual / typecheck / Markdoc-validate gates all passed because the
// wireframe was self-consistent; the gap was at the screen-completeness
// level. This gate closes that gap structurally.
//
// Usage:
//   pnpm conform:wireframe-completeness                      # walks apps/*/design/wireframes/*.mdoc
//   pnpm conform:wireframe-completeness path/to/file.mdoc    # explicit files

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import Markdoc from '@markdoc/markdoc';

type RegistryItem = {
  name: string;
  haven?: {
    requiresTerminal?: boolean;
    isTerminalAction?: boolean;
  };
};
type Registry = { items: RegistryItem[] };

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const REGISTRY_PATH = resolve(PACKAGE_ROOT, 'registry.json');
const APPS_DIR = resolve(MONOREPO_ROOT, 'apps');

function discoverWireframes(): string[] {
  if (!existsSync(APPS_DIR)) return [];
  const found: string[] = [];
  for (const app of readdirSync(APPS_DIR, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    const wireframeDir = resolve(APPS_DIR, app.name, 'design/wireframes');
    if (!existsSync(wireframeDir)) continue;
    for (const entry of readdirSync(wireframeDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.mdoc')) {
        found.push(resolve(wireframeDir, entry.name));
      }
    }
  }
  return found;
}

function loadContractTags(): {
  requiresTerminal: Set<string>;
  isTerminalAction: Set<string>;
} {
  const registry: Registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
  const requiresTerminal = new Set<string>();
  const isTerminalAction = new Set<string>();
  for (const item of registry.items) {
    if (item.haven?.requiresTerminal) requiresTerminal.add(item.name);
    if (item.haven?.isTerminalAction) isTerminalAction.add(item.name);
  }
  return { requiresTerminal, isTerminalAction };
}

type Violation = {
  file: string;
  reason: string;
};

function collectTagNames(node: any, acc: Set<string>): void {
  if (node.type === 'tag' && typeof node.tag === 'string') acc.add(node.tag);
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectTagNames(child, acc);
  }
}

function checkFile(
  path: string,
  contract: { requiresTerminal: Set<string>; isTerminalAction: Set<string> },
): Violation[] {
  const source = readFileSync(path, 'utf-8');
  const ast = Markdoc.parse(source);
  const tags = new Set<string>();
  collectTagNames(ast, tags);

  const interactiveTags = [...tags].filter((t) => contract.requiresTerminal.has(t));
  if (interactiveTags.length === 0) return [];

  const hasTerminal = [...tags].some((t) => contract.isTerminalAction.has(t));
  if (hasTerminal) return [];

  return [
    {
      file: path,
      reason: `wireframe contains interactive-input tag(s) [${interactiveTags.join(', ')}] but no terminal-action tag. Add one of: ${[...contract.isTerminalAction].join(', ') || '(none registered)'}`,
    },
  ];
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : discoverWireframes();

  if (targets.length === 0) {
    console.log('wireframe-completeness gate — no .mdoc wireframes found; nothing to check');
    return;
  }

  const contract = loadContractTags();
  console.log(
    `wireframe-completeness gate — ${contract.requiresTerminal.size} requiresTerminal tag(s): ${[...contract.requiresTerminal].sort().join(', ') || '(none)'}; ${contract.isTerminalAction.size} isTerminalAction tag(s): ${[...contract.isTerminalAction].sort().join(', ') || '(none)'}`,
  );

  const allViolations: Violation[] = [];
  for (const target of targets) {
    const violations = checkFile(target, contract);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel}`);
  }

  if (allViolations.length > 0) {
    console.error(
      `\nwireframe-completeness gate FAILED — ${allViolations.length} wireframe(s) missing terminal action:`,
    );
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(
    `\nwireframe-completeness gate PASSED — ${targets.length} wireframe(s) honor the terminal-action contract`,
  );
}

main();
