// App-shell conformance gate. For every apps/*/src/App.tsx in the haven-ui
// monorepo, asserts the exported App() function's root returned JSX element
// is a registered shell component (haven.isAppShell === true in registry.json).
//
// Gap surfaced by Brand Fidelity panel review 2026-04-20: the pilot's patient
// App.tsx rendered on a pure-white document with no Haven floating-page
// envelope. Manifest/token/visual gates all passed because they operate at
// component + per-story granularity, not at app-composition granularity.
// This gate closes that gap structurally.
//
// Usage:
//   pnpm conform:app-shell                           # walks apps/*/src/App.tsx
//   pnpm conform:app-shell path/to/App.tsx [...]     # explicit files

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Project, SyntaxKind } from 'ts-morph';

type RegistryFile = { path: string; type: string };
type RegistryItem = {
  name: string;
  files: RegistryFile[];
  haven?: { isAppShell?: boolean };
};
type Registry = { items: RegistryItem[] };

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const REGISTRY_PATH = resolve(PACKAGE_ROOT, 'registry.json');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const APPS_DIR = resolve(MONOREPO_ROOT, 'apps');

function discoverAppFiles(): string[] {
  if (!existsSync(APPS_DIR)) return [];
  return readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => resolve(APPS_DIR, d.name, 'src/App.tsx'))
    .filter((p) => existsSync(p));
}

function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function loadShellNames(): Set<string> {
  const registry: Registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
  const shells = new Set<string>();
  for (const item of registry.items) {
    if (!item.haven?.isAppShell) continue;
    const tsx = item.files.find((f) => f.path.endsWith('.tsx'));
    if (tsx) shells.add(tsx.path.split('/').pop()!.replace(/\.tsx$/, ''));
    else shells.add(kebabToPascal(item.name));
  }
  return shells;
}

type Violation = {
  file: string;
  line: number;
  column: number;
  rootTag: string;
  reason: string;
};

function checkFile(
  project: Project,
  filePath: string,
  shellNames: Set<string>,
): Violation[] {
  const source = project.addSourceFileAtPath(filePath);
  const violations: Violation[] = [];

  const appFn =
    source.getFunction('App') ??
    source.getVariableDeclaration('App')?.getInitializerIfKind(SyntaxKind.ArrowFunction);
  if (!appFn) {
    violations.push({
      file: filePath,
      line: 1,
      column: 1,
      rootTag: '(none)',
      reason: 'no exported `App` function found',
    });
    return violations;
  }

  // Only top-level returns count — not returns inside useMemo, map, filter callbacks.
  const body = appFn.getBody();
  const bodyBlock = body?.asKind(SyntaxKind.Block);
  const topLevelReturn = bodyBlock
    ?.getStatements()
    .find((s) => s.getKind() === SyntaxKind.ReturnStatement);
  if (!topLevelReturn) {
    violations.push({
      file: filePath,
      line: 1,
      column: 1,
      rootTag: '(none)',
      reason: 'App() has no top-level return statement',
    });
    return violations;
  }

  const returned = topLevelReturn.asKindOrThrow(SyntaxKind.ReturnStatement).getExpression();
  if (!returned) {
    const { line, column } = source.getLineAndColumnAtPos(returnStmts[0]!.getStart());
    violations.push({
      file: filePath,
      line,
      column,
      rootTag: '(none)',
      reason: 'App() returns no expression',
    });
    return violations;
  }

  const root =
    returned.getKind() === SyntaxKind.ParenthesizedExpression
      ? (returned.asKindOrThrow(SyntaxKind.ParenthesizedExpression).getExpression())
      : returned;

  let openingElement;
  if (root.getKind() === SyntaxKind.JsxElement) {
    openingElement = root.asKindOrThrow(SyntaxKind.JsxElement).getOpeningElement();
  } else if (root.getKind() === SyntaxKind.JsxSelfClosingElement) {
    openingElement = root.asKindOrThrow(SyntaxKind.JsxSelfClosingElement);
  } else {
    const { line, column } = source.getLineAndColumnAtPos(root.getStart());
    violations.push({
      file: filePath,
      line,
      column,
      rootTag: `(${root.getKindName()})`,
      reason: 'App() root is not a JSX element — fragments and conditionals disallowed at the app root',
    });
    return violations;
  }

  const rootTag = openingElement.getTagNameNode().getText();
  if (!shellNames.has(rootTag)) {
    const { line, column } = source.getLineAndColumnAtPos(openingElement.getStart());
    violations.push({
      file: filePath,
      line,
      column,
      rootTag,
      reason: `root JSX tag '${rootTag}' is not a registered shell (haven.isAppShell: true). Registered shells: ${[...shellNames].sort().join(', ') || '(none)'}`,
    });
  }

  return violations;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : discoverAppFiles();

  if (targets.length === 0) {
    console.error(`app-shell gate — no App.tsx files found under ${APPS_GLOB}`);
    process.exit(1);
  }

  const shellNames = loadShellNames();
  console.log(
    `app-shell gate — ${shellNames.size} registered shell(s): ${[...shellNames].sort().join(', ') || '(none)'}`,
  );

  if (shellNames.size === 0) {
    console.error('app-shell gate FAILED — no registered shells (items[].haven.isAppShell: true)');
    process.exit(1);
  }

  const project = new Project({
    compilerOptions: { jsx: 4 /* react-jsx */, allowJs: false },
    skipAddingFilesFromTsConfig: true,
  });

  const allViolations: Violation[] = [];
  for (const target of targets) {
    const violations = checkFile(project, target, shellNames);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel}`);
  }

  if (allViolations.length > 0) {
    console.error(`\napp-shell gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}:${v.line}:${v.column}  ${v.reason}`);
    }
    process.exit(1);
  }

  console.log(`\napp-shell gate PASSED — ${targets.length} app(s) root-compose a registered shell`);
}

main();
