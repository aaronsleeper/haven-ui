// Surface-role conformance gate. Scans components.css for classes annotated
// with `/* @surface-role: <role> */` and asserts the class's background
// declarations match the allowed token set for that role per DESIGN.md
// §Surface / elevation:
//
//   page   — solid opaque sand/50 (bg-surface-page | bg-sand-50)
//   pane   — translucent white    (bg-surface-pane only — no opaque fallback)
//   card   — solid white or sand/100 (bg-surface-card | bg-sand-100 | bg-white)
//   raised — solid sand/150       (bg-surface-raised | bg-sand-150)
//
// Gap surfaced by Brand Fidelity panel round-2 2026-04-20 as a new iterate
// finding after Patch 1a landed the floating-page envelope: the center-panel
// `.three-panel-shell-center` was declared with opaque `bg-sand-50` (page
// role) when DESIGN.md §Brand-taste says "Pages float. Panes layer translucent
// white on top." The css-family gate couldn't catch this — sand is the right
// family; the role is the wrong one. This gate closes that gap by reading
// the role annotation the author writes directly above the class.
//
// Annotation convention:
//   /* @surface-role: pane */
//   .three-panel-shell-center {
//       @apply bg-surface-pane;
//   }
//
// The annotation is a CSS comment authored alongside the class. Adding a
// new surface class = add the annotation; the gate picks it up automatically.
// No registry schema change required.
//
// Usage:
//   pnpm conform:surface-role                       # default: components.css
//   pnpm conform:surface-role path/to/file.css ...  # explicit files

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/components.css',
);

type Role = 'page' | 'pane' | 'card' | 'raised';

// Allowed background values per role. Tailwind utilities and raw var() refs
// both accepted — css-family gate separately enforces sand-canonical, so we
// don't need to re-check family here.
const ROLE_ALLOWED: Record<Role, readonly string[]> = {
  page: [
    'bg-surface-page',
    'bg-sand-50',
    'var(--color-surface-page)',
    'var(--color-sand-50)',
  ],
  pane: [
    // Pane is translucent white per DESIGN.md §Brand-taste. No opaque fallback.
    'bg-surface-pane',
    'var(--color-surface-pane)',
  ],
  card: [
    'bg-surface-card',
    'bg-sand-100',
    'bg-white',
    'var(--color-surface-card)',
    'var(--color-sand-100)',
    '#fff',
    '#ffffff',
    'white',
  ],
  raised: [
    'bg-surface-raised',
    'bg-sand-150',
    'var(--color-surface-raised)',
    'var(--color-sand-150)',
  ],
};

const VALID_ROLES = new Set<string>(Object.keys(ROLE_ALLOWED));

// @surface-role: <role> on its own CSS comment line
const ANNOTATION_RE = /\/\*\s*@surface-role:\s*([a-z-]+)\s*\*\//gi;

// Selector line following the annotation: a class (or compound) opening a block
const SELECTOR_RE = /^(\s*)(\.[\w-]+(?:[^{]*?))\s*\{/;

// Match any background utility in @apply: bg-something (hyphen-ok), capturing
// the full `bg-*` token. Handles stacked utilities on one line.
const BG_UTILITY_RE = /(?<![\w-])bg-[\w/-]+/g;

// background-color CSS property declaration (value up to the terminating ; or })
const BG_COLOR_RE = /background(?:-color)?\s*:\s*([^;}]+)/gi;

type Violation = {
  file: string;
  line: number;
  selector: string;
  role: Role;
  offenders: string[];
  reason: string;
};

type AnnotatedBlock = {
  line: number;
  role: Role;
  selector: string;
  body: string;
};

// Walk source; for each @surface-role annotation, locate the immediately
// following class selector and capture its declaration block (naive
// brace-matching suffices here — components.css doesn't nest rules).
function collectAnnotatedBlocks(source: string): { blocks: AnnotatedBlock[]; invalidRoles: Array<{ line: number; role: string }> } {
  const lines = source.split('\n');
  const blocks: AnnotatedBlock[] = [];
  const invalidRoles: Array<{ line: number; role: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const match = ANNOTATION_RE.exec(lines[i]!);
    ANNOTATION_RE.lastIndex = 0;
    if (!match) continue;

    const roleRaw = match[1]!.toLowerCase();
    if (!VALID_ROLES.has(roleRaw)) {
      invalidRoles.push({ line: i + 1, role: roleRaw });
      continue;
    }
    const role = roleRaw as Role;

    // Look ahead for the selector on the next non-blank line.
    let j = i + 1;
    while (j < lines.length && lines[j]!.trim() === '') j++;
    const selLine = lines[j];
    if (!selLine) continue;
    const selMatch = SELECTOR_RE.exec(selLine);
    if (!selMatch) continue;

    const selector = selMatch[2]!.trim();

    // Capture the block body by counting braces starting from the opening {.
    let depth = 0;
    let started = false;
    const bodyLines: string[] = [];
    for (let k = j; k < lines.length; k++) {
      const line = lines[k]!;
      for (const ch of line) {
        if (ch === '{') { depth++; started = true; }
        else if (ch === '}') depth--;
      }
      bodyLines.push(line);
      if (started && depth === 0) break;
    }

    blocks.push({ line: j + 1, role, selector, body: bodyLines.join('\n') });
  }

  return { blocks, invalidRoles };
}

function extractBackgroundTokens(body: string): string[] {
  const tokens: string[] = [];
  for (const m of body.matchAll(BG_UTILITY_RE)) tokens.push(m[0]!);
  for (const m of body.matchAll(BG_COLOR_RE)) {
    // Push each space-separated value (handles `background: #fff none` etc.).
    for (const piece of m[1]!.trim().split(/\s+/)) tokens.push(piece);
  }
  return tokens;
}

function validateBlock(block: AnnotatedBlock, file: string): Violation | null {
  const found = extractBackgroundTokens(block.body);
  if (found.length === 0) {
    return {
      file,
      line: block.line,
      selector: block.selector,
      role: block.role,
      offenders: [],
      reason: `role '${block.role}' declared but no background declaration found in block`,
    };
  }

  const allowed = ROLE_ALLOWED[block.role];
  const offenders = found.filter((tok) => !allowed.includes(tok));
  if (offenders.length === 0) return null;

  return {
    file,
    line: block.line,
    selector: block.selector,
    role: block.role,
    offenders,
    reason: `role '${block.role}' must use one of: ${allowed.join(', ')}`,
  };
}

function scanFile(path: string): { violations: Violation[]; checked: number } {
  const source = readFileSync(path, 'utf-8');
  const { blocks, invalidRoles } = collectAnnotatedBlocks(source);
  const violations: Violation[] = [];

  for (const bad of invalidRoles) {
    violations.push({
      file: path,
      line: bad.line,
      selector: '(annotation)',
      role: 'page',
      offenders: [bad.role],
      reason: `unknown surface role '${bad.role}' — must be one of: ${Object.keys(ROLE_ALLOWED).join(', ')}`,
    });
  }
  for (const block of blocks) {
    const v = validateBlock(block, path);
    if (v) violations.push(v);
  }

  return { violations, checked: blocks.length };
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `surface-role gate — scanning ${targets.length} file(s) for @surface-role annotations`,
  );

  const allViolations: Violation[] = [];
  let totalChecked = 0;
  for (const target of targets) {
    const { violations, checked } = scanFile(target);
    allViolations.push(...violations);
    totalChecked += checked;
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel} — ${checked} annotated class(es)`);
    else console.log(`  ✗ ${rel} — ${violations.length} violation(s) across ${checked} annotated class(es)`);
  }

  if (allViolations.length > 0) {
    console.error(`\nsurface-role gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      const offList = v.offenders.length ? ` [${v.offenders.join(', ')}]` : '';
      console.error(`  ${rel}:${v.line}  ${v.selector}  [${v.role}]${offList}  — ${v.reason}`);
    }
    console.error(
      `\n  Fix: align each annotated class's background with its role per DESIGN.md §Surface.`,
    );
    console.error(
      `  Pane = translucent white; page/card/raised = opaque sand stops. See Token Steward judgment-framework.md.`,
    );
    process.exit(1);
  }

  console.log(
    `\nsurface-role gate PASSED — ${totalChecked} annotated class(es) across ${targets.length} file(s)`,
  );
}

main();
