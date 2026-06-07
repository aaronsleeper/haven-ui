// Dependency-declaration conformance gate. Two checks per workspace package:
//
//   1. Every bare-module import in source must be declared in the importing
//      package's own package.json (dependencies/devDependencies/peerDependencies).
//      Workspace package names and Node.js builtins pass automatically.
//
//   2. If the imported module's own package.json carries no types/typings
//      field (it's a JS-only module), then EITHER `@types/<module>` is
//      declared in the same workspace package OR a `declare module 'X'`
//      lives in a local `.d.ts` under the package tree.
//
// The failure shape this catches: a hoisted orphan in `node_modules/` that
// the local install resolves but `pnpm install --frozen-lockfile` on CI
// does not. Source incident: 2026-06-07 culori type-import flooded the
// inbox with ~24 CI failure emails before the missing `@types/culori`
// devDependency was declared. See repo-inventory.md, haven-ui row.
//
// Honest limit: a static-imports check catches this failure shape but not
// every install-drift class. The deeper preventive measure is pnpm's
// `public-hoist-pattern=[]` in `.npmrc`; that's a bigger one-time cleanup
// not in scope here.
//
// Usage:
//   pnpm conform:deps   # scans every package under packages/ and apps/

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';

const NODE_BUILTINS = new Set<string>([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.turbo',
  'archive',
  '__screenshots__',
  'storybook-static',
]);

type PkgJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  types?: string;
  typings?: string;
  exports?: unknown;
};

type WorkspacePkg = {
  name: string;
  dir: string;
  deps: Set<string>;
  declaredModules: Set<string>;
};

type Finding = {
  package: string;
  module: string;
  file: string;
  kind: 'undeclared' | 'missing-types';
};

function readPkg(path: string): PkgJson | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as PkgJson;
  } catch {
    return null;
  }
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, acc);
    else if (SCAN_EXTENSIONS.has(extname(entry))) acc.push(full);
  }
  return acc;
}

function collectDeclaredModules(packageDir: string): Set<string> {
  const modules = new Set<string>();
  const files = existsSync(packageDir) ? walk(packageDir) : [];
  for (const f of files) {
    if (!f.endsWith('.d.ts')) continue;
    const code = readFileSync(f, 'utf8');
    const re = /declare\s+module\s+['"]([^'"]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) modules.add(m[1]);
  }
  return modules;
}

function discoverWorkspacePackages(): WorkspacePkg[] {
  const result: WorkspacePkg[] = [];
  for (const sub of ['packages', 'apps']) {
    const fullSub = join(MONOREPO_ROOT, sub);
    if (!existsSync(fullSub)) continue;
    for (const entry of readdirSync(fullSub)) {
      const dir = join(fullSub, entry);
      const pkgPath = join(dir, 'package.json');
      if (!existsSync(pkgPath)) continue;
      const pkg = readPkg(pkgPath);
      if (!pkg?.name) continue;
      const deps = new Set<string>([
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ]);
      result.push({
        name: pkg.name,
        dir,
        deps,
        declaredModules: collectDeclaredModules(dir),
      });
    }
  }
  return result;
}

function extractImports(packageDir: string): Map<string, string> {
  const imports = new Map<string, string>();
  if (!existsSync(packageDir)) return imports;
  const files = walk(packageDir);
  for (const file of files) {
    if (file.endsWith('.d.ts')) continue;
    const code = readFileSync(file, 'utf8');
    const re = /\b(?:import|export)\s+(?:[^'"\n;]+from\s+)?['"]([^'"]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      const spec = m[1];
      if (spec.startsWith('.') || spec.startsWith('/')) continue;
      // Skip tsconfig path aliases like '@/shared' (literal at-slash; a real
      // scoped package would be '@scope/name' where 'scope' is non-empty).
      if (spec.startsWith('@/')) continue;
      const parts = spec.split('/');
      const pkgName = parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
      if (!imports.has(pkgName)) imports.set(pkgName, file);
    }
  }
  return imports;
}

function resolveModulePkg(moduleName: string, fromDir: string): PkgJson | null {
  let cur = fromDir;
  const root = resolve('/');
  while (cur !== root) {
    const candidate = join(cur, 'node_modules', moduleName, 'package.json');
    if (existsSync(candidate)) return readPkg(candidate);
    cur = dirname(cur);
  }
  return null;
}

function moduleShipsTypes(pkg: PkgJson): boolean {
  if (pkg.types || pkg.typings) return true;
  const exp = pkg.exports;
  if (!exp || typeof exp !== 'object') return false;
  const stack: unknown[] = [exp];
  while (stack.length) {
    const cur = stack.shift();
    if (!cur || typeof cur !== 'object') continue;
    for (const [k, v] of Object.entries(cur as Record<string, unknown>)) {
      if (k === 'types' && typeof v === 'string') return true;
      if (v && typeof v === 'object') stack.push(v);
    }
  }
  return false;
}

function typesPackageName(moduleName: string): string {
  return moduleName.startsWith('@')
    ? `@types/${moduleName.slice(1).replace('/', '__')}`
    : `@types/${moduleName}`;
}

const workspacePkgs = discoverWorkspacePackages();
const workspaceNames = new Set(workspacePkgs.map((p) => p.name));
const findings: Finding[] = [];

for (const wp of workspacePkgs) {
  const imports = extractImports(wp.dir);
  for (const [moduleName, firstFile] of imports) {
    if (NODE_BUILTINS.has(moduleName)) continue;
    if (workspaceNames.has(moduleName)) continue;

    if (!wp.deps.has(moduleName)) {
      findings.push({
        package: wp.name,
        module: moduleName,
        file: relative(MONOREPO_ROOT, firstFile),
        kind: 'undeclared',
      });
      continue;
    }

    const modulePkg = resolveModulePkg(moduleName, wp.dir);
    if (!modulePkg) continue;
    if (moduleShipsTypes(modulePkg)) continue;

    if (wp.deps.has(typesPackageName(moduleName))) continue;
    if (wp.declaredModules.has(moduleName)) continue;

    findings.push({
      package: wp.name,
      module: moduleName,
      file: relative(MONOREPO_ROOT, firstFile),
      kind: 'missing-types',
    });
  }
}

if (findings.length === 0) {
  console.log(
    `conform:deps PASSED — scanned ${workspacePkgs.length} workspace package(s); every external import is declared with types coverage`,
  );
  process.exit(0);
}

console.error(`conform:deps FAILED — ${findings.length} issue(s):`);
for (const f of findings) {
  if (f.kind === 'undeclared') {
    console.error(
      `  [${f.package}] imports '${f.module}' in ${f.file} — declare in ${f.package}/package.json`,
    );
  } else {
    console.error(
      `  [${f.package}] imports JS-only '${f.module}' in ${f.file} without types — declare ${typesPackageName(f.module)} or add a local .d.ts`,
    );
  }
}
process.exit(1);
