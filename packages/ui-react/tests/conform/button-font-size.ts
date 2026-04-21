// Button-font-size conformance gate. Scans components.css for rule blocks
// whose selector is button-shaped (button tag, [type=...] attr selectors,
// .btn-* classes, a.btn-* qualifiers) and asserts that every font-size
// source resolves through var(--text-button-{small,medium,large}).
//
// Background — Patch 13 retro proposal (2026-04-21): Tailwind 4 inlines
// text-* utilities as direct font-size values rather than emitting
// --text-* custom properties, so runtime computed-style scans can't
// detect "this is a Tailwind utility vs a Haven token." Source-side scan
// is the only reliable signal. This gate is the sibling to Patch 13's
// generic-button fix — Patch 13 closed the leak; this gate prevents its
// return.
//
// Scope (per Token Steward review 2026-04-21):
//   - Full-surface components.css — not pilot-registered-scoped. Buttons
//     are cross-persona primitives; the leak class doesn't respect
//     registration boundaries.
//   - Selector match: `button`, [type='button'|'submit'|'reset'|'image'],
//     any `.btn-<anything>`, any `a.btn-<anything>`. Compound selectors
//     match if any head token is button-shaped.
//   - Excluded: `.btn-group`, `.btn-group-vertical` — layout wrappers,
//     no font-size set, no text directly housed.
//   - No exemption enum. Gate is absolute — every button font-size must
//     resolve through one of three Haven tokens. If an exemption ever
//     becomes legitimate, add it then with a retro-documented reason.
//
// Allowed font-size sources:
//   - font-size: var(--text-button-small | -medium | -large)
//   - @apply text-button-small | text-button-medium | text-button-large
//   - font-size: inherit | 1em (descendants relying on parent scale)
//   - @apply text-inherit (compiles to font-size: inherit)
//   - No font-size declaration (rule inherits from the generic button rule)
//
// Forbidden:
//   - @apply ...text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl...
//   - @apply text-[<arbitrary>]
//   - font-size: <px|rem|em> literal (other than 1em)
//   - font-size: var(--X) where X is not a --text-button-* token
//   - Tailwind variant prefixes (hover:, dark:, etc.) on any text-size utility
//
// Usage:
//   pnpm conform:button-font-size
//   pnpm conform:button-font-size path/to/file.css

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/components.css',
);

// The three registered button-font-size tokens. Order matters for the
// "closest token" suggestion in failure messages — sorted by px value
// ascending.
const ALLOWED_VAR_NAMES = [
  '--text-button-small',
  '--text-button-medium',
  '--text-button-large',
] as const;
const ALLOWED_VAR_SET = new Set<string>(ALLOWED_VAR_NAMES);

// px values for the closest-token suggestion. Mirrors typography.css:61-66.
// If those tokens move, update here.
const TOKEN_PX: Record<string, number> = {
  '--text-button-small': 11.11,
  '--text-button-medium': 13.33,
  '--text-button-large': 16,
};

// Tailwind text-size utility → px approximation for closest-token suggestion.
// Values are Tailwind 4 defaults (rem assuming 16px root).
const TAILWIND_TEXT_PX: Record<string, number> = {
  'text-xs': 12,
  'text-sm': 14,
  'text-base': 16,
  'text-lg': 18,
  'text-xl': 20,
  'text-2xl': 24,
  'text-3xl': 30,
};

// Rule selectors that should be scanned. The head of a comma-separated
// selector list must contain a button-shaped token to be in scope.
const BUTTON_TAG_RE = /\bbutton\b/;
const BUTTON_TYPE_RE = /\[type=['"]?(?:button|submit|reset|image)['"]?\]/;
const BUTTON_CLASS_RE = /(?:^|[^\w-])\.btn-[\w-]+/;
const ANCHOR_BTN_CLASS_RE = /\ba\.btn-[\w-]+/;

// Explicit exclusions — rule selectors that match a button-shape token but
// are pure layout wrappers and don't house text.
const EXCLUDED_SELECTOR_RES = [
  /^\.btn-group(?:\s|,|$)/,
  /^\.btn-group-vertical(?:\s|,|$)/,
];

function isButtonSelector(selector: string): boolean {
  // Reject excluded wrappers before the inclusive match.
  for (const re of EXCLUDED_SELECTOR_RES) {
    if (re.test(selector.trim())) return false;
  }
  // Any comma-separated head that is button-shaped qualifies.
  const heads = selector.split(',').map((s) => s.trim());
  for (const head of heads) {
    if (BUTTON_TAG_RE.test(head)) return true;
    if (BUTTON_TYPE_RE.test(head)) return true;
    if (ANCHOR_BTN_CLASS_RE.test(head)) return true;
    if (BUTTON_CLASS_RE.test(head)) return true;
  }
  return false;
}

// Selector line opening a block — same shape as surface-role.ts / contrast-pairs.ts.
const SELECTOR_RE = /^(\s*)([.:#&\w\[][^{]*?)\s*\{/;

type RuleBlock = {
  file: string;
  line: number;
  selector: string;
  body: string;
};

function collectRuleBlocks(source: string, file: string): RuleBlock[] {
  const lines = source.split('\n');
  const blocks: RuleBlock[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    const selMatch = SELECTOR_RE.exec(line);
    if (!selMatch) continue;
    const selector = selMatch[2]!.trim();
    // Skip at-rules and similar non-class selector shapes.
    if (selector.startsWith('@')) continue;

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
    });

    i = endIdx;
  }

  return blocks;
}

// A font-size source found in a rule body. Each rule produces zero or more.
// A rule with zero sources inherits from the generic button rule and passes.
type FontSizeSource = {
  kind: 'apply-utility' | 'direct';
  raw: string;
  // px approximation for closest-token suggestion (when known).
  pxGuess: number | null;
  // Was this a valid Haven-button-token reference?
  valid: boolean;
};

// Tailwind text-* size utility inside an @apply. Rejects variant-prefixed
// versions like `hover:text-sm` and `dark:text-xs`.
const APPLY_TEXT_RE =
  /(?<![\w-])(?:[\w-]+:)?text-(?:xs|sm|base|lg|xl|\dxl|button-small|button-medium|button-large|inherit)\b/g;

// Direct font-size declaration inside a rule body.
const DIRECT_FS_RE = /font-size\s*:\s*([^;}\n]+)/g;

// Extract the var name from a value like `var(--foo, fallback)`.
const VAR_NAME_RE = /var\(\s*(--[\w-]+)/;

function extractSources(body: string): FontSizeSource[] {
  const sources: FontSizeSource[] = [];

  // @apply text-* utilities.
  for (const m of body.matchAll(APPLY_TEXT_RE)) {
    const raw = m[0]!;
    const hasVariantPrefix = /:/.test(raw);

    // text-inherit and text-button-* are valid (text-button-* assumes
    // Tailwind emits those utilities from Haven's @theme).
    if (!hasVariantPrefix) {
      if (raw === 'text-inherit') {
        sources.push({ kind: 'apply-utility', raw, pxGuess: null, valid: true });
        continue;
      }
      if (
        raw === 'text-button-small' ||
        raw === 'text-button-medium' ||
        raw === 'text-button-large'
      ) {
        sources.push({ kind: 'apply-utility', raw, pxGuess: null, valid: true });
        continue;
      }
    }

    // Everything else (text-xs, text-sm, ..., hover:text-xs, dark:text-sm) is
    // forbidden. Derive a px guess for the failure message when we can.
    const sizeTail = raw.replace(/^[\w-]+:/, '');
    const pxGuess = TAILWIND_TEXT_PX[sizeTail] ?? null;
    sources.push({ kind: 'apply-utility', raw, pxGuess, valid: false });
  }

  // Direct font-size declarations.
  for (const m of body.matchAll(DIRECT_FS_RE)) {
    const value = m[1]!.trim();
    const raw = `font-size: ${value}`;

    // Inherit-style escape hatches.
    if (value === 'inherit' || value === '1em') {
      sources.push({ kind: 'direct', raw, pxGuess: null, valid: true });
      continue;
    }

    // var(--X) — valid only if X is a registered button token.
    const varMatch = VAR_NAME_RE.exec(value);
    if (varMatch) {
      const name = varMatch[1]!;
      const valid = ALLOWED_VAR_SET.has(name);
      // If it's an unregistered var, give a px guess when we know the token.
      let pxGuess: number | null = null;
      if (!valid) {
        // Common off-gate token the author might have reached for.
        const known: Record<string, number> = {
          '--text-body-03': 13.33,
          '--text-body-04': 11.11,
          '--text-utility-timestamp': 11.11,
          '--text-utility-overline': 11.11,
        };
        pxGuess = known[name] ?? null;
      }
      sources.push({ kind: 'direct', raw, pxGuess, valid });
      continue;
    }

    // Numeric literal (px / rem / em with a number). Always invalid.
    const litMatch = value.match(/^([\d.]+)(px|rem|em|%)$/);
    if (litMatch) {
      const num = parseFloat(litMatch[1]!);
      const unit = litMatch[2]!;
      let pxGuess: number | null = null;
      if (unit === 'px') pxGuess = num;
      else if (unit === 'rem') pxGuess = num * 16;
      sources.push({ kind: 'direct', raw, pxGuess, valid: false });
      continue;
    }

    // Unknown shape — mark invalid, no px guess.
    sources.push({ kind: 'direct', raw, pxGuess: null, valid: false });
  }

  return sources;
}

function closestToken(px: number): { name: string; px: number } {
  let bestName = ALLOWED_VAR_NAMES[0] as string;
  let bestDelta = Math.abs(px - TOKEN_PX[bestName]!);
  for (const name of ALLOWED_VAR_NAMES) {
    const delta = Math.abs(px - TOKEN_PX[name]!);
    if (delta < bestDelta) {
      bestName = name;
      bestDelta = delta;
    }
  }
  return { name: bestName, px: TOKEN_PX[bestName]! };
}

type Violation = {
  file: string;
  line: number;
  selector: string;
  source: FontSizeSource;
  suggested: { name: string; px: number } | null;
};

function scanFile(path: string): { violations: Violation[]; blocksChecked: number } {
  const source = readFileSync(path, 'utf-8');
  const blocks = collectRuleBlocks(source, path);

  const violations: Violation[] = [];
  let blocksChecked = 0;

  for (const block of blocks) {
    if (!isButtonSelector(block.selector)) continue;
    const sources = extractSources(block.body);
    if (sources.length === 0) continue;
    blocksChecked++;

    for (const src of sources) {
      if (src.valid) continue;
      const suggested = src.pxGuess !== null ? closestToken(src.pxGuess) : null;
      violations.push({
        file: block.file,
        line: block.line,
        selector: block.selector,
        source: src,
        suggested,
      });
    }
  }

  return { violations, blocksChecked };
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `button-font-size gate — scanning ${targets.length} file(s); allowed tokens: ${ALLOWED_VAR_NAMES.join(', ')}`,
  );

  const allViolations: Violation[] = [];
  let totalBlocks = 0;

  for (const target of targets) {
    const { violations, blocksChecked } = scanFile(target);
    allViolations.push(...violations);
    totalBlocks += blocksChecked;
    const rel = relative(MONOREPO_ROOT, target);
    const status = violations.length === 0 ? '✓' : '✗';
    console.log(`  ${status} ${rel} — ${blocksChecked} button rule(s) with font-size source(s)`);
  }

  if (allViolations.length > 0) {
    console.error(
      `\nbutton-font-size gate FAILED — ${allViolations.length} violation(s):`,
    );
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}:${v.line}  ${v.selector}`);
      console.error(`    forbidden font-size source: ${v.source.raw}`);
      if (v.suggested) {
        console.error(
          `    suggested: ${v.suggested.name} (${v.suggested.px}px)`,
        );
      } else {
        console.error(
          `    use font-size: var(--text-button-{small,medium,large})`,
        );
      }
    }
    console.error(
      `\n  Fix: every button rule's font-size must resolve through one of: ${ALLOWED_VAR_NAMES.join(', ')}. Rules that declare no font-size inherit from the generic button rule and pass. Escape hatches: font-size: inherit | 1em, @apply text-inherit.`,
    );
    process.exit(1);
  }

  console.log(
    `\nbutton-font-size gate PASSED — ${totalBlocks} button rule(s) with font-size source(s) resolve through registered tokens`,
  );
}

main();
