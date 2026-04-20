// One-Family-Per-Role conformance gate. Scans source for any non-canonical
// color-family utility or var reference. Per DESIGN.md §Color and Token
// Steward judgment-framework.md, `sand` is the canonical warm neutral
// surface family; the alias families (stone, gray, zinc, slate, neutral)
// exist only as defensive fallbacks against Tailwind v4's cascade override
// trap — never component-facing vocabulary.
//
// v1 scope (2026-04-19): components.css only.
// v2 scope (2026-04-20, this patch): pilot pattern-library HTML exemplars
// + all pilot React JSX component source. Pilot-scoped per slice-1 debt
// closeout item 6 — non-pilot pattern-library surface (~100+ pre-existing
// violations across pages/, partials/, non-pilot components) deferred to a
// future cleanup sweep. Storybook demo wrappers (`*.stories.tsx`) excluded
// as scaffolding.
//
// Gap surfaced 2026-04-20 during item 6 scope calibration: even with
// components.css clean, a future author could write `className="bg-gray-50"`
// directly in a React component (bypassing semantic classes) and neither
// the CSS-source gate nor the structural gates would catch it. This patch
// closes that gap at the markup layer.
//
// Usage:
//   pnpm conform:css-family                       # default: components.css + pilot HTML + pilot JSX
//   pnpm conform:css-family path/to/file.css ...  # explicit files (any of .css, .html, .tsx)

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DESIGN_SYSTEM_ROOT = resolve(MONOREPO_ROOT, 'packages/design-system');
const UI_REACT_COMPONENTS = resolve(PACKAGE_ROOT, 'src/components');

const COMPONENTS_CSS = resolve(DESIGN_SYSTEM_ROOT, 'src/styles/tokens/components.css');

// Pilot slice-1 pattern-library HTML exemplars. One entry per registered
// pilot component. Mirrors the pilot-scoping used by the contrast-pair and
// plain-language gates.
const PILOT_PATTERN_LIBRARY_HTML = [
  'queue-item.html',
  'queue-section-header.html',
  'queue-sidebar.html',
  'three-panel-shell.html',
  'progress-bar-pagination.html',
  'assessment-header.html',
  'response-option.html',
  'response-option-group.html',
  'primary-action.html',
].map((f) => resolve(DESIGN_SYSTEM_ROOT, 'pattern-library/components', f));

// All pilot JSX component source files. Glob at run time so newly-ported
// components are picked up automatically; `.stories.tsx` demo wrappers are
// exempted as scaffolding (see v2 debt item for reconsideration).
function listPilotJsx(): string[] {
  return readdirSync(UI_REACT_COMPONENTS)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
    .map((f) => resolve(UI_REACT_COMPONENTS, f));
}

// Forbidden neutral-family names. Sand is canonical; these are hex-literal
// aliases in palette.css kept for defensive fallback only.
const FORBIDDEN_FAMILIES = ['stone', 'gray', 'zinc', 'slate', 'neutral'] as const;

// Tailwind color-affecting property prefixes that generate utilities from
// the color palette. Covers the full surface — background, text, border,
// ring, divide, outline, fill, stroke, accent, caret, placeholder, shadow,
// from, via, to (gradient stops). If it takes a color family, it's here.
const COLOR_PROPS = [
  'bg',
  'text',
  'border',
  'ring',
  'ring-offset',
  'divide',
  'outline',
  'fill',
  'stroke',
  'accent',
  'caret',
  'placeholder',
  'shadow',
  'from',
  'via',
  'to',
];

// Variant prefixes (pseudo-classes, modes). Can chain (e.g. dark:hover:bg-gray-50).
const VARIANT_PREFIXES = [
  'hover',
  'focus',
  'focus-visible',
  'focus-within',
  'active',
  'disabled',
  'visited',
  'checked',
  'group-hover',
  'group-focus',
  'peer-hover',
  'peer-focus',
  'peer-checked',
  'dark',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'print',
];

// Build the master utility regex. Matches:
//   [variant:]*prop-family-step
// e.g. bg-gray-500, dark:hover:text-neutral-900, placeholder:text-stone-400
const VARIANT_PART = `(?:(?:${VARIANT_PREFIXES.join('|')}):)*`;
const PROP_PART = `(?:${COLOR_PROPS.join('|')})`;
const FAMILY_PART = `(?:${FORBIDDEN_FAMILIES.join('|')})`;
const UTILITY_RE = new RegExp(
  `(?<![\\w-])${VARIANT_PART}${PROP_PART}-${FAMILY_PART}-\\d{1,3}(?:/\\d{1,3})?(?![\\w-])`,
  'g',
);

// Raw var() references into alias families: var(--color-gray-500), etc.
const VAR_RE = new RegExp(`var\\(\\s*--color-${FAMILY_PART}-\\d{1,3}\\s*(?:,[^)]*)?\\)`, 'g');

// Exemption annotation. Recognized in CSS (/* ... */), HTML (<!-- ... -->),
// and JSX ({/* ... */}) comments. Placed on the line immediately preceding
// the violating line (blank lines OK between annotation and target).
//
// Valid reasons (enum — free-form fails):
//   preview-chrome-body   — pattern-library exemplar <body> page wrapper
//   preview-chrome-wrapper — demo-wrapper element around the component
//                             inside an exemplar (e.g. a <ul> frame around
//                             <li class="queue-item"> demos)
//   exemplar-scaffolding  — other legitimate pattern-library preview
//                             scaffolding (catch-all; prefer specific reasons)
const EXEMPT_RE = /@css-family-exempt:\s*([a-z-]+)/i;
const VALID_EXEMPT_REASONS = new Set([
  'preview-chrome-body',
  'preview-chrome-wrapper',
  'exemplar-scaffolding',
]);

type Violation = {
  file: string;
  line: number;
  column: number;
  match: string;
  kind: 'utility' | 'var' | 'bad-exempt-reason';
};

// Strip comments for markup file types so `<!-- uses bg-gray-50 -->` or
// `{/* bg-gray-50 */}` don't trip the regex. The scan target is actual
// class / className output, not documentation about it.
function stripComments(source: string, kind: 'css' | 'html' | 'jsx'): string {
  if (kind === 'css') {
    // CSS: /* ... */ block comments only. Don't strip — the existing gate
    // has always scanned CSS comments (including `/* uses gray */` in an
    // annotation), and in practice the pattern-match false-positive rate
    // is zero. Preserving current behavior.
    return source;
  }
  if (kind === 'html') {
    // Preserve newlines so violation line numbers match the raw source
    // (the `@component-meta` header at the top of every pattern-library
    // HTML spans 20+ lines; collapsing it to a single run of spaces would
    // shift every subsequent line number).
    return source.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
  }
  // jsx: strip block comments only. `{/* ... */}` (JSX-embedded) and
  // plain `/* ... */` (TS block). Line `//` comments are not stripped —
  // mangling URLs inside string literals is riskier than the near-zero
  // chance of an author writing a forbidden utility inside a line
  // comment. Preserve line counts with space substitution so violation
  // line numbers remain accurate.
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function fileKind(path: string): 'css' | 'html' | 'jsx' {
  const ext = extname(path).toLowerCase();
  if (ext === '.css') return 'css';
  if (ext === '.html' || ext === '.htm') return 'html';
  return 'jsx';
}

// Walk the raw (comments intact) source for exemption annotations. Annotation
// on line N exempts the next non-blank line. Returns a set of 1-indexed
// line numbers to skip when scanning for violations, plus any invalid-reason
// violations (which fail the gate even though they look like exemptions).
function collectExemptions(
  raw: string,
  file: string,
): { exemptLines: Set<number>; badReasons: Violation[] } {
  const lines = raw.split('\n');
  const exemptLines = new Set<number>();
  const badReasons: Violation[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = EXEMPT_RE.exec(lines[i]!);
    EXEMPT_RE.lastIndex = 0;
    if (!match) continue;

    const reason = match[1]!.toLowerCase();
    if (!VALID_EXEMPT_REASONS.has(reason)) {
      badReasons.push({
        file,
        line: i + 1,
        column: (match.index ?? 0) + 1,
        match: reason,
        kind: 'bad-exempt-reason',
      });
      continue;
    }
    // Exempt the next non-blank line.
    let j = i + 1;
    while (j < lines.length && lines[j]!.trim() === '') j++;
    if (j < lines.length) exemptLines.add(j + 1);
  }

  return { exemptLines, badReasons };
}

function scanFile(path: string): Violation[] {
  const raw = readFileSync(path, 'utf-8');
  const { exemptLines, badReasons } = collectExemptions(raw, path);
  const source = stripComments(raw, fileKind(path));
  const lines = source.split('\n');
  const violations: Violation[] = [...badReasons];
  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    if (exemptLines.has(lineNo)) return;
    for (const match of line.matchAll(UTILITY_RE)) {
      violations.push({
        file: path,
        line: lineNo,
        column: (match.index ?? 0) + 1,
        match: match[0],
        kind: 'utility',
      });
    }
    for (const match of line.matchAll(VAR_RE)) {
      violations.push({
        file: path,
        line: lineNo,
        column: (match.index ?? 0) + 1,
        match: match[0],
        kind: 'var',
      });
    }
  });
  return violations;
}

function defaultTargets(): string[] {
  return [COMPONENTS_CSS, ...PILOT_PATTERN_LIBRARY_HTML, ...listPilotJsx()];
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : defaultTargets();

  const cssCount = targets.filter((t) => fileKind(t) === 'css').length;
  const htmlCount = targets.filter((t) => fileKind(t) === 'html').length;
  const jsxCount = targets.filter((t) => fileKind(t) === 'jsx').length;

  console.log(
    `one-family-per-role gate — scanning ${targets.length} file(s) (${cssCount} css, ${htmlCount} html, ${jsxCount} jsx) for non-canonical families: ${FORBIDDEN_FAMILIES.join(', ')} (canonical: sand)`,
  );

  const allViolations: Violation[] = [];
  for (const target of targets) {
    const violations = scanFile(target);
    allViolations.push(...violations);
    const rel = relative(MONOREPO_ROOT, target);
    if (violations.length === 0) console.log(`  ✓ ${rel}`);
    else console.log(`  ✗ ${rel} — ${violations.length} violation(s)`);
  }

  if (allViolations.length > 0) {
    console.error(`\none-family-per-role gate FAILED — ${allViolations.length} violation(s):`);
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      if (v.kind === 'bad-exempt-reason') {
        console.error(
          `  ${rel}:${v.line}:${v.column}  [bad-exempt-reason] '${v.match}' — must be one of: ${[...VALID_EXEMPT_REASONS].join(', ')}`,
        );
      } else {
        console.error(`  ${rel}:${v.line}:${v.column}  [${v.kind}] ${v.match} — migrate to sand`);
      }
    }
    console.error(
      '\n  Fix: replace non-canonical family with sand (bg-gray-50 → bg-sand-50, etc.). See Token Steward judgment-framework.md → "One family per surface role".',
    );
    console.error(
      '  Pattern-library preview-shell chrome may annotate the preceding line with `<!-- @css-family-exempt: preview-chrome-body -->` or `preview-chrome-wrapper`.',
    );
    process.exit(1);
  }

  console.log(`\none-family-per-role gate PASSED — all color utilities + var refs use sand`);
}

main();
