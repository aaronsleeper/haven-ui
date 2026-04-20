// Contrast-pair conformance gate. Scans components.css for rule blocks
// that declare both a background and a foreground (text/border/ring) in
// the same rule, resolves each side to a hex value via the registered
// token set, and fails the gate when the computed WCAG 2.1 contrast
// ratio falls below 3.0:1 — the SC 1.4.11 non-text threshold.
//
// v1 scope (per Token Steward + A11y expert consult 2026-04-20):
//
//   - SC 1.4.11 non-text UI contrast only (3:1 floor). SC 1.4.3 text
//     contrast (4.5:1) deferred to v2 pending font-size resolution.
//   - **Pilot-registered components only.** The gate scopes to rule
//     blocks whose selector references a class derived from
//     registry.json's item names. components.css contains extensive
//     legacy design-system debt (card outlines, notification pills, etc.)
//     that is out of scope for slice-1 debt closeout; expanding the gate
//     to those is a tracked v2 follow-up.
//   - Single-rule pair extraction — both bg and fg declared in the same
//     rule block. Cross-rule inheritance and `background: transparent`
//     rules defer to v2 (need cascade resolution).
//   - Single-state — only the rule as authored; `:hover`, `:focus-visible`,
//     `.active` etc. are distinct rule blocks and get evaluated
//     independently when they declare both sides. Tailwind variant
//     prefixes (`dark:*`, `hover:*`, etc.) defer to v2.
//   - Haven rule exceeds WCAG: `:disabled` / `[aria-disabled=true]` still
//     hold 3:1. The exempt list covers only the narrow WCAG carve-outs.
//
// Exemption convention:
//   /* @contrast-exempt: decorative-background */
//   .some-class { ... }
//
// Valid reasons (enum — free-form exemptions fail):
//   disabled-state | placeholder-text | decorative-background
//   | focus-ring-adjacent-only | logotype
//
// (brand-taste-override was proposed during Token Steward design but
// rejected by A11y consult; Haven does not authorize brand-taste
// relaxations of WCAG 1.4.11.)
//
// Usage:
//   pnpm conform:contrast-pairs
//   pnpm conform:contrast-pairs path/to/file.css ...

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeColor } from './utils/normalizeColor';
import { loadSourceTokens } from './utils/resolveTokens';
import { wcagContrast } from './utils/wcagContrast';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/components.css',
);
const REGISTRY_PATH = resolve(PACKAGE_ROOT, 'registry.json');

// Load the pilot-registered component class names. Each registry entry's
// kebab-cased name is the semantic class (`three-panel-shell`,
// `queue-item`, etc.). The gate checks rule blocks whose selector
// references any of these as a root class or in a descendant selector.
function loadRegisteredClasses(): Set<string> {
  const raw = readFileSync(REGISTRY_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as { items: Array<{ name: string }> };
  const classes = new Set<string>();
  for (const item of parsed.items) classes.add(item.name);
  // Sub-classes that live alongside the registered root (e.g., queue-item
  // has queue-item-sla, queue-item-header, etc.). Add a prefix-match
  // rather than enumerate every sub-class — any `.queue-item-*` pattern
  // is in scope.
  return classes;
}

function selectorMatchesRegistry(
  selector: string,
  registered: Set<string>,
): boolean {
  // Strip everything but class tokens (`.foo.bar:hover .baz` → foo, bar, baz).
  const classRe = /\.([\w-]+)/g;
  for (const m of selector.matchAll(classRe)) {
    const cls = m[1]!;
    for (const reg of registered) {
      if (cls === reg || cls.startsWith(`${reg}-`)) return true;
    }
  }
  return false;
}

const NON_TEXT_THRESHOLD = 3.0;

// Assumed adjacent surface for solo-bg pairs (rules that declare only a
// background — the "opposite" color is the parent/page surface). Haven's
// page surface is sand-50 (#f5eee5, very near white); surface-pane over
// the page is translucent-white, also near-white. White is the defensible
// assumption: if the bg fails 3:1 vs white, it'll fail vs every lighter
// Haven surface too. Dark-mode-adjacent pairs defer to v2.
const ASSUMED_ADJACENT_HEX = '#ffffff';

// Valid exemption reasons. Sourced from A11y verdict (WCAG 2.1 carve-outs
// only); `brand-taste-override` was proposed by Token Steward but rejected
// by A11y ("brand-taste is NOT a contrast exemption axis"). The gate
// enforces the strictest consulting verdict.
const VALID_EXEMPTIONS = new Set<string>([
  'disabled-state',
  'placeholder-text',
  'decorative-background',
  'focus-ring-adjacent-only',
  'logotype',
]);

// @contrast-exempt: <reason> on its own CSS comment line
const EXEMPT_RE = /\/\*\s*@contrast-exempt:\s*([a-z-]+)\s*\*\//i;

// Selector line opening a block — same pattern as surface-role.ts.
const SELECTOR_RE = /^(\s*)([.:#&\w][^{]*?)\s*\{/;

// Tailwind color utilities: bg-X, border-X, ring-X where X is a
// token name (possibly with /alpha suffix). Text (text-X, color:) is
// deferred to v2 with SC 1.4.3 text-contrast handling.
// Rejects variant-prefixed utilities (`dark:bg-X`, `hover:ring-X`, etc)
// via the `:` in the reject set — different render states defer to v2.
const UTIL_RE =
  /(?<![\w\-:])(bg|border|ring)-(sand-[\w-]+|stone-[\w-]+|teal-[\w-]+|primary-[\w-]+|accent-[\w-]+|surface-[\w-]+|error-[\w-]+|warning-[\w-]+|success-[\w-]+|white|black)(?:\/\d+)?(?![\w-])/g;

// Direct CSS property declarations for identifying colors (bg, border,
// ring/outline). Shorthand border / border-left / border-right / etc.
// also match — the value-color extractor pulls var() / hex / rgb() /
// named-color references out regardless of position within the value.
// Text `color:` is excluded for v1 (SC 1.4.3 deferred).
const DECL_RE =
  /(background(?:-color)?|border(?:-color|-left-color|-right-color|-top-color|-bottom-color|-left|-right|-top|-bottom)?|outline-color|ring-color)\s*:\s*([^;}]+)/gi;

// box-shadow declarations can carry identifying edges — inset shadows in
// particular are how components like `.queue-item.active` communicate
// state with the fill staying soft. Extract the color-component of each
// shadow (the final non-length token — simplified; doesn't handle comma-
// separated multi-shadow or color-first syntax, which aren't in Haven's
// authored patterns).
const SHADOW_RE = /box-shadow\s*:\s*([^;}]+)/gi;

// Extract every groundable color reference from a CSS value string.
// Covers var(--color-X) refs, raw hex literals, rgb()/rgba() functions,
// and the named colors Haven actually uses (white/black). Used for both
// shorthand declarations (`border: 1px solid var(--color-X)`) and
// box-shadow values where the color sits among length tokens.
function extractValueColors(
  value: string,
  tokens: Record<string, string>,
): string[] {
  const hexes: string[] = [];

  for (const m of value.matchAll(/var\(\s*(--color-[\w-]+)[^)]*\)/g)) {
    const resolved = tokens[m[1]!];
    if (!resolved) continue;
    try {
      hexes.push(normalizeColor(resolved));
    } catch {
      continue;
    }
  }
  for (const m of value.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)/gi)) {
    try {
      hexes.push(normalizeColor(m[0]));
    } catch {
      continue;
    }
  }
  // Named colors — token-boundary match so `whiteout` doesn't false-hit.
  if (/(^|[\s,])white(\s|$|[,;/)])/i.test(value)) {
    hexes.push(normalizeColor('#ffffff'));
  }
  if (/(^|[\s,])black(\s|$|[,;/)])/i.test(value)) {
    hexes.push(normalizeColor('#000000'));
  }

  return hexes;
}

// Resolve a Tailwind utility token (sand-50, teal-400, surface-pane, white)
// to a hex via the `--color-<X>` registered name. Alpha suffixes (/50) drop
// per v1 scope — source-side can't blend alpha without knowing the parent.
function resolveUtilTokenToHex(
  token: string,
  tokens: Record<string, string>,
): string | null {
  if (token === 'white') return normalizeColor('#ffffff');
  if (token === 'black') return normalizeColor('#000000');
  const bare = token.split('/')[0]!;
  const key = `--color-${bare}`;
  const resolved = tokens[key];
  if (!resolved) return null;
  try {
    return normalizeColor(resolved);
  } catch {
    return null;
  }
}

// An identifying color on a component — a value the gate compares to the
// assumed-adjacent surface. Each rule block produces zero or more of
// these; the rule passes if MAX(ratio) across its colors clears 3:1.
type IdentifyingColor = {
  kind: 'background' | 'border' | 'ring' | 'box-shadow';
  hex: string;
  source: string;
};

type RuleBlock = {
  file: string;
  line: number;
  selector: string;
  body: string;
  exempt: { reason: string; valid: boolean } | null;
};

function collectRuleBlocks(source: string, file: string): RuleBlock[] {
  const lines = source.split('\n');
  const blocks: RuleBlock[] = [];
  let exemptPending: { reason: string; valid: boolean } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    const exempt = line.match(EXEMPT_RE);
    if (exempt) {
      const reason = exempt[1]!.toLowerCase();
      exemptPending = { reason, valid: VALID_EXEMPTIONS.has(reason) };
      continue;
    }

    const selMatch = SELECTOR_RE.exec(line);
    if (!selMatch) {
      // Blank line keeps an exemption pending; any non-comment content
      // clears it. Matches surface-role's "annotation applies to next
      // selector" contract.
      if (line.trim() !== '' && !line.trim().startsWith('/*')) {
        exemptPending = null;
      }
      continue;
    }
    const selector = selMatch[2]!.trim();

    // Brace-match the block body.
    let depth = 0;
    let started = false;
    const bodyLines: string[] = [];
    let endIdx = i;
    for (let k = i; k < lines.length; k++) {
      const ll = lines[k]!;
      for (const ch of ll) {
        if (ch === '{') {
          depth++;
          started = true;
        } else if (ch === '}') depth--;
      }
      bodyLines.push(ll);
      endIdx = k;
      if (started && depth === 0) break;
    }

    blocks.push({
      file,
      line: i + 1,
      selector,
      body: bodyLines.join('\n'),
      exempt: exemptPending,
    });

    exemptPending = null;
    i = endIdx;
  }

  return blocks;
}

// Extract every identifying color on a rule block. Each return element
// is one color the component paints against its adjacent surface: a fill,
// a border, a ring/outline, or a box-shadow color-component.
function extractIdentifyingColors(
  body: string,
  tokens: Record<string, string>,
): IdentifyingColor[] {
  const colors: IdentifyingColor[] = [];

  // Tailwind utilities in @apply lines.
  for (const m of body.matchAll(UTIL_RE)) {
    const [full, prop, token] = m as unknown as [string, string, string];
    const hex = resolveUtilTokenToHex(token, tokens);
    if (!hex) continue;
    if (prop === 'bg') colors.push({ kind: 'background', hex, source: full });
    else if (prop === 'border') colors.push({ kind: 'border', hex, source: full });
    else if (prop === 'ring') colors.push({ kind: 'ring', hex, source: full });
  }

  // Direct CSS property declarations — extract every groundable color
  // reference from each value (handles both direct `background: var(...)`
  // and shorthand `border: 1px solid var(...)`).
  for (const m of body.matchAll(DECL_RE)) {
    const prop = m[1]!.toLowerCase();
    const value = m[2]!;
    const kind: IdentifyingColor['kind'] = prop.startsWith('background')
      ? 'background'
      : prop.startsWith('border')
        ? 'border'
        : 'ring';
    for (const hex of extractValueColors(value, tokens)) {
      colors.push({ kind, hex, source: `${prop}: ${value.trim().slice(0, 48)}` });
    }
  }

  // box-shadow — same value extractor, tagged as a distinct kind.
  for (const m of body.matchAll(SHADOW_RE)) {
    const value = m[1]!;
    for (const hex of extractValueColors(value, tokens)) {
      colors.push({ kind: 'box-shadow', hex, source: `box-shadow: ${value.trim().slice(0, 48)}` });
    }
  }

  return colors;
}

type Violation = {
  file: string;
  line: number;
  selector: string;
  colors: IdentifyingColor[];
  maxRatio: number;
};

type InvalidExemption = {
  file: string;
  line: number;
  selector: string;
  reason: string;
};

function scanFile(
  path: string,
  tokens: Record<string, string>,
  registeredClasses: Set<string>,
): {
  violations: Violation[];
  invalidExemptions: InvalidExemption[];
  exemptSkipped: number;
  blocksChecked: number;
} {
  const source = readFileSync(path, 'utf-8');
  const blocks = collectRuleBlocks(source, path);

  const violations: Violation[] = [];
  const invalidExemptions: InvalidExemption[] = [];
  let exemptSkipped = 0;
  let blocksChecked = 0;

  for (const block of blocks) {
    // v1 scope: pilot-registered components only.
    if (!selectorMatchesRegistry(block.selector, registeredClasses)) continue;

    if (block.exempt && !block.exempt.valid) {
      invalidExemptions.push({
        file: path,
        line: block.line,
        selector: block.selector,
        reason: block.exempt.reason,
      });
      continue;
    }

    const colors = extractIdentifyingColors(block.body, tokens);
    if (colors.length === 0) continue;

    if (block.exempt && block.exempt.valid) {
      exemptSkipped++;
      continue;
    }

    blocksChecked++;

    // Component passes if MAX ratio across its identifying colors >= 3:1.
    // This matches SC 1.4.11's "identify the component against adjacent"
    // — any one visible edge or fill with sufficient contrast means the
    // component is identifiable.
    let maxRatio = 0;
    for (const color of colors) {
      try {
        const r = wcagContrast(color.hex, ASSUMED_ADJACENT_HEX);
        if (r > maxRatio) maxRatio = r;
      } catch {
        continue;
      }
    }

    if (maxRatio < NON_TEXT_THRESHOLD) {
      violations.push({
        file: path,
        line: block.line,
        selector: block.selector,
        colors,
        maxRatio,
      });
    }
  }

  return { violations, invalidExemptions, exemptSkipped, blocksChecked };
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  const tokens = loadSourceTokens();
  const registeredClasses = loadRegisteredClasses();
  console.log(
    `contrast-pair gate — scanning ${targets.length} file(s) against ${Object.keys(tokens).length} registered token(s); scoped to ${registeredClasses.size} pilot-registered component class(es); threshold 3.0:1 (WCAG 1.4.11 non-text)`,
  );

  const allViolations: Violation[] = [];
  const allInvalidExemptions: InvalidExemption[] = [];
  let totalBlocks = 0;
  let totalExempt = 0;

  for (const target of targets) {
    const { violations, invalidExemptions, exemptSkipped, blocksChecked } =
      scanFile(target, tokens, registeredClasses);
    allViolations.push(...violations);
    allInvalidExemptions.push(...invalidExemptions);
    totalBlocks += blocksChecked;
    totalExempt += exemptSkipped;
    const rel = relative(MONOREPO_ROOT, target);
    const status = violations.length === 0 && invalidExemptions.length === 0 ? '✓' : '✗';
    console.log(
      `  ${status} ${rel} — ${blocksChecked} rule(s) checked; ${exemptSkipped} exempt-skipped`,
    );
  }

  if (allInvalidExemptions.length > 0) {
    console.error(`\ncontrast-pair gate FAILED — ${allInvalidExemptions.length} invalid exemption(s):`);
    for (const e of allInvalidExemptions) {
      const rel = relative(MONOREPO_ROOT, e.file);
      console.error(
        `  ${rel}:${e.line}  ${e.selector}  — unknown exemption '${e.reason}'; must be one of: ${Array.from(VALID_EXEMPTIONS).join(', ')}`,
      );
    }
  }

  if (allViolations.length > 0) {
    console.error(
      `\ncontrast-pair gate FAILED — ${allViolations.length} violation(s) with MAX ratio below 3.0:1:`,
    );
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      const colorList = v.colors.map((c) => `${c.kind}=${c.source.slice(0, 60)}`).join('; ');
      console.error(
        `  ${rel}:${v.line}  ${v.selector}  max ${v.maxRatio.toFixed(2)}:1 across ${v.colors.length} identifying color(s)  — ${colorList}`,
      );
    }
    console.error(
      `\n  Fix: give the component at least one identifying color (background, border, ring, or box-shadow) with ≥3.0:1 contrast vs the adjacent surface (white assumed), or annotate with /* @contrast-exempt: <reason> */ if the rule qualifies for a carve-out (disabled-state | placeholder-text | decorative-background | focus-ring-adjacent-only | logotype).`,
    );
  }

  if (allViolations.length > 0 || allInvalidExemptions.length > 0) {
    process.exit(1);
  }

  console.log(
    `\ncontrast-pair gate PASSED — ${totalBlocks} rule(s) with identifying colors clear 3.0:1; ${totalExempt} exempt-skipped`,
  );
}

main();
