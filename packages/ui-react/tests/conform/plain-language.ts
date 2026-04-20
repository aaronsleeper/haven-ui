// Plain-language conformance gate. Catches clinical codes, medical
// acronyms, and coordinator-ops jargon leaking into patient-facing
// surfaces. v1 scope per UX Design Lead + Plain Language Positioning
// verdict (2026-04-20):
//
//   - Scans Markdoc wireframes (apps/*/design/wireframes/**/*.mdoc)
//     and pattern-library HTML (packages/design-system/pattern-library/
//     components/*.html). React JSX and i18n catalogs defer to v2.
//   - Persona-scoped by filesystem path: apps/patient/** is strict;
//     apps/care-coordinator/**, apps/provider/**, apps/kitchen/** are
//     relaxed (clinicians + ops legitimately use clinical codes).
//     Pattern-library (unscoped) defaults to **strict** — components
//     are consumed by the patient surface first; a clinician-only
//     component belongs in a persona app folder.
//   - Dictionary: clinical assessment codes (GAD-7, PHQ-9, DAST-10,
//     etc.), medical acronyms (BP, BMI, A1C, etc.), and a short list
//     of ops-leak terms. Codes pattern-match both hyphenated and
//     unhyphenated forms.
//   - Voice-rule lints (imperative register, passive-agent) deferred
//     to v2.
//
// Exemption convention:
//   /* @plain-lang-exempt: <reason> */
//   .some-class { ... }   (CSS — not currently a scan target, but the
//                          convention is shared)
//
//   <!-- @plain-lang-exempt: <reason> -->
//   <h1>GAD-7</h1>        (HTML exemplar only for authoring docs)
//
// Valid reasons (enum — free-form fails):
//   clinician-persona | clinician-handoff-summary | legal-disclosure
//   | billing-code-required
//
// Usage:
//   pnpm conform:plain-language
//   pnpm conform:plain-language path/to/file.mdoc ...

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const MONOREPO_ROOT = resolve(PACKAGE_ROOT, '../..');

const STRICT_ROOTS = [
  resolve(MONOREPO_ROOT, 'apps/patient'),
];
const RELAXED_ROOTS = [
  resolve(MONOREPO_ROOT, 'apps/care-coordinator'),
  resolve(MONOREPO_ROOT, 'apps/provider'),
  resolve(MONOREPO_ROOT, 'apps/kitchen'),
];

// Patient-facing pattern-library components. A component is "patient-
// facing" when it renders on the patient persona surface. v1 hardcodes
// the list; v2 reads persona annotations from registry.json. The rest
// of pattern-library (queue-item, queue-sidebar, thread-*, etc.) is
// coordinator / provider / kitchen surface and out of v1 scope.
const PATIENT_PATTERN_LIBRARY_FILES = new Set<string>([
  'assessment-header.html',
  'progress-bar-pagination.html',
  'response-option.html',
  'response-option-group.html',
  'primary-action.html',
]);

// Clinical assessment instruments, diagnostic codes. Regex catches
// hyphenated (GAD-7), unhyphenated (GAD7), and bare (GAD) forms.
const CLINICAL_CODE_RE =
  /\b(GAD|PHQ|DAST|AUDIT(?:-C)?|PCL|PSS|ACEs?|SBQ|EPDS|WHO-?5|SF-?(?:12|36)|PROMIS|MoCA|MMSE|HAM-?[AD]|BDI-?II|DSM-?5(?:-TR)?|ICD-?1[01]|CPT|SNOMED|LOINC|HCPCS|COWS|CIWA|CAGE|PRAPARE|MDQ)[- ]?\d*\b/g;

// Medical acronyms — flagged in patient surfaces. Short list; expand in v2.
const MEDICAL_ACRONYM_RE = /\b(BMI|HbA1c|A1C|LDL|HDL|SpO2|SDoH|PHI|EHR|EMR)\b/g;

// Ops-leak / clinical-register jargon (patient-facing blockers).
const OPS_LEAK_TERMS = [
  'adherence',
  'compliance', // medication-adherence sense
  'comorbid',
  'comorbidity',
  'exacerbation',
  'triage',
  'escalate',
  'SLA',
  'intake',
  'disposition',
];
const OPS_LEAK_RE = new RegExp(
  `\\b(${OPS_LEAK_TERMS.join('|')})\\b`,
  'gi',
);

const VALID_EXEMPTIONS = new Set<string>([
  'clinician-persona',
  'clinician-handoff-summary',
  'legal-disclosure',
  'billing-code-required',
]);

// @plain-lang-exempt: <reason> on its own line (HTML, CSS, or Markdoc)
const EXEMPT_RE = /(?:\/\*|<!--)\s*@plain-lang-exempt:\s*([a-z-]+)\s*(?:\*\/|-->)/i;

type Scope = 'strict' | 'relaxed';

function scopeForPath(absPath: string): Scope | null {
  for (const root of STRICT_ROOTS) {
    if (absPath.startsWith(root + '/')) return 'strict';
  }
  for (const root of RELAXED_ROOTS) {
    if (absPath.startsWith(root + '/')) return 'relaxed';
  }
  // Patient-facing pattern-library components are strict-scoped too.
  if (
    absPath.startsWith(
      resolve(MONOREPO_ROOT, 'packages/design-system/pattern-library/components') + '/',
    )
  ) {
    const basename = absPath.split('/').pop()!;
    if (PATIENT_PATTERN_LIBRARY_FILES.has(basename)) return 'strict';
  }
  return null;
}

// Strip HTML comments (including multi-line, including @component-meta
// authoring metadata which is wrapped in `<!-- @component-meta ... -->`)
// and Markdoc frontmatter (between `---` delimiters at file head).
// Replaces their spans with whitespace so line/column numbers stay
// accurate for surviving content.
function stripNonContent(source: string, ext: string): string {
  let out = source;

  if (ext === '.mdoc' || ext === '.md') {
    // Markdoc frontmatter: leading `---\n...\n---\n` block.
    const fm = out.match(/^---\n[\s\S]*?\n---\n/);
    if (fm) {
      out = ' '.repeat(fm[0].length - fm[0].split('\n').length + 1) +
        '\n'.repeat(fm[0].split('\n').length - 1) +
        out.slice(fm[0].length);
    }
  }

  if (ext === '.html') {
    // HTML comments — replace with whitespace preserving newlines.
    out = out.replace(/<!--[\s\S]*?-->/g, (match) => {
      return match
        .split('\n')
        .map((line) => ' '.repeat(line.length))
        .join('\n');
    });
  }

  return out;
}

type Violation = {
  file: string;
  line: number;
  column: number;
  term: string;
  kind: 'clinical-code' | 'medical-acronym' | 'ops-leak';
  context: string;
};

function findTerms(
  source: string,
  file: string,
  patterns: Array<{ re: RegExp; kind: Violation['kind'] }>,
): Violation[] {
  const violations: Violation[] = [];
  const lines = source.split('\n');

  // Track exempt regions — an exemption annotation applies to the next
  // non-blank line. For v1 the granularity is line-level (exempt = skip
  // one line). Cross-line exemptions defer to v2.
  let exemptNextLine = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const exemptMatch = line.match(EXEMPT_RE);
    if (exemptMatch) {
      const reason = exemptMatch[1]!.toLowerCase();
      if (!VALID_EXEMPTIONS.has(reason)) {
        violations.push({
          file,
          line: i + 1,
          column: line.indexOf('@plain-lang-exempt') + 1,
          term: reason,
          kind: 'ops-leak',
          context: `unknown exemption reason (valid: ${Array.from(VALID_EXEMPTIONS).join(', ')})`,
        });
      }
      exemptNextLine = true;
      continue;
    }
    if (exemptNextLine) {
      if (line.trim() === '') continue;
      exemptNextLine = false;
      continue;
    }

    for (const { re, kind } of patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        violations.push({
          file,
          line: i + 1,
          column: m.index + 1,
          term: m[0],
          kind,
          context: line.trim().slice(0, 80),
        });
      }
    }
  }

  return violations;
}

function scanFile(
  path: string,
  scope: Scope,
): Violation[] {
  const raw = readFileSync(path, 'utf-8');
  const source = stripNonContent(raw, extname(path));
  const patterns: Array<{ re: RegExp; kind: Violation['kind'] }> = [
    { re: new RegExp(CLINICAL_CODE_RE.source, CLINICAL_CODE_RE.flags), kind: 'clinical-code' },
  ];
  if (scope === 'strict') {
    patterns.push(
      { re: new RegExp(MEDICAL_ACRONYM_RE.source, MEDICAL_ACRONYM_RE.flags), kind: 'medical-acronym' },
      { re: new RegExp(OPS_LEAK_RE.source, OPS_LEAK_RE.flags), kind: 'ops-leak' },
    );
  }
  return findTerms(source, path, patterns);
}

const SCAN_EXTENSIONS = new Set(['.mdoc', '.html']);

function walkDir(root: string, out: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist') continue;
    const abs = join(root, entry);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkDir(abs, out);
    else if (st.isFile() && SCAN_EXTENSIONS.has(extname(entry))) out.push(abs);
  }
}

function discoverTargets(): string[] {
  const out: string[] = [];
  walkDir(resolve(MONOREPO_ROOT, 'apps/patient/design/wireframes'), out);
  const plRoot = resolve(
    MONOREPO_ROOT,
    'packages/design-system/pattern-library/components',
  );
  for (const f of PATIENT_PATTERN_LIBRARY_FILES) {
    out.push(join(plRoot, f));
  }
  return out;
}

function main(): void {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args.map((a) => resolve(a)) : discoverTargets();

  const scoped: Array<{ path: string; scope: Scope }> = [];
  let skippedOutOfScope = 0;
  for (const t of targets) {
    const scope = scopeForPath(t);
    if (!scope) {
      skippedOutOfScope++;
      continue;
    }
    scoped.push({ path: t, scope });
  }

  console.log(
    `plain-language gate — scanning ${scoped.length} file(s); dictionary: clinical codes + medical acronyms + ops-leak terms. Patient / pattern-library = strict; coordinator / provider / kitchen = relaxed.`,
  );

  const allViolations: Violation[] = [];
  for (const { path, scope } of scoped) {
    const v = scanFile(path, scope);
    allViolations.push(...v);
    const rel = relative(MONOREPO_ROOT, path);
    const status = v.length === 0 ? '✓' : '✗';
    console.log(`  ${status} ${rel} [${scope}] — ${v.length} violation(s)`);
  }

  if (skippedOutOfScope > 0) {
    console.log(`  (${skippedOutOfScope} target(s) outside scoped roots — skipped)`);
  }

  if (allViolations.length > 0) {
    console.error(
      `\nplain-language gate FAILED — ${allViolations.length} violation(s):`,
    );
    for (const v of allViolations) {
      const rel = relative(MONOREPO_ROOT, v.file);
      console.error(
        `  ${rel}:${v.line}:${v.column}  [${v.kind}] "${v.term}"  — ${v.context}`,
      );
    }
    console.error(
      `\n  Fix: replace clinical codes with patient-voice phrasing (e.g., "GAD-7" → "Anxiety check-in" per the [topic] check-in pattern), or annotate with @plain-lang-exempt: <reason> (clinician-persona | clinician-handoff-summary | legal-disclosure | billing-code-required).`,
    );
    process.exit(1);
  }

  console.log(
    `\nplain-language gate PASSED — ${scoped.length} file(s) across strict + relaxed scopes`,
  );
}

main();
