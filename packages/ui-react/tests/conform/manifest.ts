// Manifest conformance gate. AST-walks target .tsx files; for every JSX
// element with a PascalCase (component) tag name, asserts the tag resolves
// to a name in registry.json. Lowercase HTML tags (div, span, etc.) pass.
// Hallucinated component names (leakage past Markdoc or a bad edit) fail.
//
// Mapping: registry.json item.name is kebab-case; expected React export is
// PascalCase. "queue-item" → "QueueItem". Built from items[].name; any
// component added to registry is automatically valid.
//
// Usage:
//   pnpm conform:manifest                         # default fixture
//   pnpm conform:manifest path/to/file.tsx [...]  # explicit files

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Project, SyntaxKind } from 'ts-morph';

type RegistryItem = { name: string };
type Registry = { items: RegistryItem[] };

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const REGISTRY_PATH = resolve(PACKAGE_ROOT, 'registry.json');
const DEFAULT_FIXTURE = resolve(
  PACKAGE_ROOT,
  'tests/conform/fixtures/manifest-pilot.tsx',
);

function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function loadValidNames(): Set<string> {
  const registry: Registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
  const names = new Set<string>();
  for (const item of registry.items) names.add(kebabToPascal(item.name));
  return names;
}

type Violation = {
  file: string;
  line: number;
  column: number;
  tagName: string;
};

function checkFile(
  project: Project,
  filePath: string,
  validNames: Set<string>,
): { checked: number; violations: Violation[] } {
  const source = project.addSourceFileAtPath(filePath);
  const elements = [
    ...source.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
    ...source.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
  ];

  const violations: Violation[] = [];
  let checked = 0;

  for (const el of elements) {
    const nameNode = el.getTagNameNode();
    const tagName = nameNode.getText();
    if (!/^[A-Z]/.test(tagName)) continue;
    checked++;
    if (!validNames.has(tagName)) {
      const { line, column } = source.getLineAndColumnAtPos(nameNode.getStart());
      violations.push({ file: filePath, line, column, tagName });
    }
  }

  return { checked, violations };
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_FIXTURE];

  const validNames = loadValidNames();
  console.log(
    `manifest gate — ${validNames.size} registered components: ${[...validNames].sort().join(', ')}`,
  );

  const project = new Project({
    compilerOptions: { jsx: 4 /* react-jsx */, allowJs: false },
    skipAddingFilesFromTsConfig: true,
  });

  let totalChecked = 0;
  const allViolations: Violation[] = [];

  for (const target of targets) {
    const { checked, violations } = checkFile(project, target, validNames);
    totalChecked += checked;
    allViolations.push(...violations);
    const rel = relative(PACKAGE_ROOT, target);
    if (violations.length === 0) {
      console.log(`  ✓ ${rel} — ${checked} component tag(s) resolved`);
    } else {
      console.log(`  ✗ ${rel} — ${violations.length} unresolved of ${checked}`);
    }
  }

  if (allViolations.length > 0) {
    console.error(`\nmanifest gate FAILED — ${allViolations.length} unresolved component tag(s):`);
    for (const v of allViolations) {
      const rel = relative(PACKAGE_ROOT, v.file);
      console.error(`  ${rel}:${v.line}:${v.column}  <${v.tagName}> not in registry.json`);
    }
    process.exit(1);
  }

  console.log(`\nmanifest gate PASSED — ${totalChecked} component tag(s) across ${targets.length} file(s)`);
}

main();
