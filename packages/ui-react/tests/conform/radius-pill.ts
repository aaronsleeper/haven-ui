// Radius-pill conformance gate. Scans components.css for any rule that uses
// rounded-xl (Haven --radius-xl = 54px pill) or rounded-[54px]. Fails on any
// occurrence — DESIGN.md reserves pill radius exclusively for chat-input
// send/mic button primitives, which in practice are implemented with
// rounded-full (full circle/stadium), not rounded-xl. After Patch 19's sweep,
// components.css has zero legitimate rounded-xl consumers; this gate prevents
// the 54px-pill-on-card-surfaces drift class from returning.
//
// Background — Patch 19 audit (2026-04-22): 25 selectors across content cards,
// floating panels, containers, media, and chat surfaces had drifted to
// rounded-xl (54px pill) despite DESIGN.md §Card canon prescribing
// border-radius/md (11px). Three experts (Token Steward + Brand Fidelity +
// Registry Steward) converged on a mechanical sweep: 23 sites → rounded-md,
// 2 sites (meal-chip media) → rounded-lg, zero legitimate pill consumers left.
// The gate is the forcing function so the next trip through catches this
// drift at PR time instead of next quarter's browser review.
//
// Scope:
//   - Full-surface components.css — drift class doesn't respect registration
//     boundaries (same rationale as conform:button-font-size).
//   - Rule-body scan only: CSS block comments (/* ... */) outside rule bodies
//     are stripped before matching, so doc examples aren't flagged.
//   - No exemption enum in v1. Any future legitimate pill surface should use
//     rounded-full (circle/stadium) rather than rounded-xl, per established
//     codebase practice. If a real rounded-xl need surfaces, add an exemption
//     enum at that time with a retro-documented reason.
//
// Forbidden:
//   - @apply ...rounded-xl...
//   - @apply ...rounded-[54px]...
//   - border-radius: var(--radius-xl)
//   - border-radius: 54px
//
// Usage:
//   pnpm conform:radius-pill
//   pnpm conform:radius-pill path/to/file.css

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');
const DEFAULT_TARGET = resolve(
  MONOREPO_ROOT,
  'packages/design-system/src/styles/tokens/components.css',
);

// Selector line opening a rule block — same shape as button-font-size.ts /
// surface-role.ts / contrast-pairs.ts.
const SELECTOR_RE = /^(\s*)([.:#&\w\[][^{]*?)\s*\{/;

type RuleBlock = {
  file: string;
  line: number;
  selector: string;
  body: string;
};

function stripBlockComments(source: string): string {
  // Replace /* ... */ spans with equal-length whitespace (preserving newlines)
  // so line numbers stay stable for diagnostics.
  return source.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
}

function collectRuleBlocks(source: string, file: string): RuleBlock[] {
  const stripped = stripBlockComments(source);
  const lines = stripped.split('\n');
  const blocks: RuleBlock[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    const selMatch = SELECTOR_RE.exec(line);
    if (!selMatch) continue;
    const selector = selMatch[2]!.trim();
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

// Forbidden patterns. Reject variant-prefixed matches too (`hover:rounded-xl`,
// `dark:rounded-xl`) — if pill-on-hover drift emerges, catch it the same way.
const FORBIDDEN_RES: { re: RegExp; kind: string }[] = [
  { re: /(?<![\w-])(?:[\w-]+:)?rounded-xl\b/g, kind: 'rounded-xl utility' },
  { re: /(?<![\w-])(?:[\w-]+:)?rounded-\[54px\]/g, kind: 'rounded-[54px] arbitrary utility' },
  { re: /border-radius\s*:\s*var\(\s*--radius-xl\s*[,)]/g, kind: 'var(--radius-xl)' },
  { re: /border-radius\s*:\s*54px\b/g, kind: 'border-radius: 54px literal' },
];

type Violation = {
  file: string;
  line: number;
  selector: string;
  match: string;
  kind: string;
};

function scanFile(path: string): { violations: Violation[]; blocksScanned: number } {
  const source = readFileSync(path, 'utf-8');
  const blocks = collectRuleBlocks(source, path);

  const violations: Violation[] = [];

  for (const block of blocks) {
    for (const { re, kind } of FORBIDDEN_RES) {
      for (const m of block.body.matchAll(re)) {
        violations.push({
          file: block.file,
          line: block.line,
          selector: block.selector,
          match: m[0]!,
          kind,
        });
      }
    }
  }

  return { violations, blocksScanned: blocks.length };
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : [DEFAULT_TARGET];

  console.log(
    `radius-pill gate — scanning ${targets.length} file(s); pill radius (rounded-xl / 54px) is reserved for chat-send/mic primitives and is expected to be zero in components.css`,
  );

  const allViolations: Violation[] = [];
  let totalBlocks = 0;

  for (const target of targets) {
    const { violations, blocksScanned } = scanFile(target);
    allViolations.push(...violations);
    totalBlocks += blocksScanned;
    const rel = relative(MONOREPO_ROOT, target);
    const status = violations.length === 0 ? '✓' : '✗';
    console.log(`  ${status} ${rel} — ${blocksScanned} rule block(s) scanned`);
  }

  if (allViolations.length > 0) {
    console.error(
      `\nradius-pill gate FAILED — ${allViolations.length} violation(s):`,
    );
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(`  ${rel}:${v.line}  ${v.selector}`);
      console.error(`    forbidden ${v.kind}: ${v.match}`);
    }
    console.error(
      `\n  Fix: DESIGN.md §Card canon prescribes border-radius/md (11px) for cards, panels, containers, and bubbles. Legitimate circle/stadium surfaces (avatars, toggles, badges) use rounded-full. If a new chat-send/mic pill primitive is needed, add an exemption enum here with a retro-documented reason before landing.`,
    );
    process.exit(1);
  }

  console.log(
    `\nradius-pill gate PASSED — ${totalBlocks} rule block(s) scanned, zero pill-radius consumers`,
  );
}

main();
