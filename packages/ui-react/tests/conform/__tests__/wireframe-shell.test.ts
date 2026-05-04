// Self-tests for the wireframe-shell gate's hash + canonicalization layer
// AND the gate's three-shape `shells:` contract (added Phase 2).
// Runs via: pnpm test:wireframe-shell  (tsx-runnable, exit 0 on pass / 1 on fail)
//
// Coverage (per spec v2 §Test plan):
//   T1. canonicalize-shell-html.ts is deterministic across:
//       a) Prettier-style reflowed input
//       b) attribute reorder
//       c) comment injection
//   T2. Hash include/exclude round-trip:
//       a) mutating an EXCLUDED registry field (haven.notes) → hash unchanged
//       b) mutating an INCLUDED registry field (composition.allowedChildren)
//          → hash changed
//   T3. Three-shape `shells:` contract (Phase 2):
//       a) shells: [{name, pl_shell_version}] with current canon → declared, validates
//       b) shells: [] → fragment, silent skip
//       c) shells:  field absent → absent (warn in Phase 2; halt in strict mode)
//       d) shells: with stale hash → flagged in stale map
//       e) shells: referencing unregistered shell name → flagged in unregistered list
//       f) shells: with malformed shape (string, missing fields) → flagged in shapeErrors

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { canonicalizeShellHtml } from '../../../src/lib/canonicalize-shell-html.js';
import { hashShell } from '../../../src/lib/shell-canon.js';
import { parseWireframe, validateWireframes } from '../wireframe-shell.js';

type Failure = { test: string; reason: string };
const failures: Failure[] = [];

function check(test: string, condition: boolean, reason: string): void {
  if (condition) console.log(`  ✓ ${test}`);
  else {
    console.log(`  ✗ ${test}`);
    failures.push({ test, reason });
  }
}

// ---------- T1: canonicalization determinism ----------

console.log('T1. canonicalize-shell-html determinism');

const baseHtml = `<div class="shell" id="x" data-hs-foo="bar"><h1>Title</h1><p>One</p></div>`;

const reflowed = `<div  class="shell"  id="x"  data-hs-foo="bar">
  <h1>Title</h1>
  <p>One</p>
</div>`;

const attrReordered = `<div data-hs-foo="bar" id="x" class="shell"><h1>Title</h1><p>One</p></div>`;

const commentInjected = `<div class="shell" id="x" data-hs-foo="bar"><!-- a comment --><h1>Title</h1><!-- another --><p>One</p></div>`;

const baseCanon = canonicalizeShellHtml(baseHtml);
const reflowedCanon = canonicalizeShellHtml(reflowed);
const attrCanon = canonicalizeShellHtml(attrReordered);
const commentCanon = canonicalizeShellHtml(commentInjected);

check(
  'Prettier-style reflow produces identical canonical form',
  baseCanon === reflowedCanon,
  `base: ${baseCanon}\nreflowed: ${reflowedCanon}`,
);
check(
  'attribute reorder produces identical canonical form',
  baseCanon === attrCanon,
  `base: ${baseCanon}\nreordered: ${attrCanon}`,
);
check(
  'comment injection produces identical canonical form',
  baseCanon === commentCanon,
  `base: ${baseCanon}\ninjected: ${commentCanon}`,
);

const preHtml = `<pre>line one
  line two
    line three</pre>`;
const preCanon = canonicalizeShellHtml(preHtml);
check(
  'whitespace inside <pre> is preserved',
  preCanon.includes('line one\n  line two\n    line three'),
  `canonical: ${preCanon}`,
);

// ---------- T2: hash include/exclude round-trip ----------
//
// Builds a temp shell registration + temp PL HTML on disk, then mutates
// hashShell()'s view of it via direct registry-item construction. hashShell()
// reads the PL HTML from disk via the registry's haven.patternLibraryHtml path,
// so we point that path at our temp HTML file.
//
// To make hashShell() resolve the temp path correctly, we construct the
// patternLibraryHtml as an absolute path. The script's resolvePatternLibraryHtml()
// uses resolve(PACKAGE_ROOT, rel), and resolve() returns absolute paths
// unchanged when the second arg is already absolute.

console.log('\nT2. hash include/exclude round-trip');

const tmp = mkdtempSync(join(tmpdir(), 'wireframe-shell-test-'));
const htmlPath = join(tmp, 'shell.html');
writeFileSync(htmlPath, `<div class="shell"><slot /></div>`);

const baseItem = {
  name: 'test-shell',
  files: [{ path: 'components/TestShell.tsx', type: 'registry:component' }],
  haven: {
    isAppShell: true,
    patternLibraryHtml: htmlPath,
    composition: {
      slotModel: 'children-slot',
      allowedChildren: ['child-a', 'child-b'],
      markdocTag: null,
      propSchema: null,
    },
    notes: 'original notes',
    brandReviewed: false,
    a11yReviewed: false,
    stories: [],
  },
};

const baseHash = hashShell(baseItem);
check('base hash computes to a sha256:* value', baseHash.startsWith('sha256:'), baseHash);

// Excluded: haven.notes
const notesMutated = JSON.parse(JSON.stringify(baseItem));
notesMutated.haven.notes = 'completely different notes';
const notesHash = hashShell(notesMutated);
check(
  'mutating haven.notes leaves hash unchanged',
  notesHash === baseHash,
  `base: ${baseHash}\nafter: ${notesHash}`,
);

// Excluded: haven.brandReviewed
const brandMutated = JSON.parse(JSON.stringify(baseItem));
brandMutated.haven.brandReviewed = true;
const brandHash = hashShell(brandMutated);
check(
  'mutating haven.brandReviewed leaves hash unchanged',
  brandHash === baseHash,
  `base: ${baseHash}\nafter: ${brandHash}`,
);

// Excluded: haven.stories
const storiesMutated = JSON.parse(JSON.stringify(baseItem));
storiesMutated.haven.stories = ['Foo.bar', 'Foo.baz'];
const storiesHash = hashShell(storiesMutated);
check(
  'mutating haven.stories leaves hash unchanged',
  storiesHash === baseHash,
  `base: ${baseHash}\nafter: ${storiesHash}`,
);

// Included: haven.composition.allowedChildren
const childrenMutated = JSON.parse(JSON.stringify(baseItem));
childrenMutated.haven.composition.allowedChildren = ['child-a', 'child-b', 'child-c'];
const childrenHash = hashShell(childrenMutated);
check(
  'mutating haven.composition.allowedChildren CHANGES hash',
  childrenHash !== baseHash,
  `base: ${baseHash}\nafter: ${childrenHash}`,
);

// Included: haven.composition.slotModel
const slotMutated = JSON.parse(JSON.stringify(baseItem));
slotMutated.haven.composition.slotModel = 'named-slots';
const slotHash = hashShell(slotMutated);
check(
  'mutating haven.composition.slotModel CHANGES hash',
  slotHash !== baseHash,
  `base: ${baseHash}\nafter: ${slotHash}`,
);

// Included: PL HTML content (semantic change)
writeFileSync(htmlPath, `<div class="shell"><slot /><p>added</p></div>`);
const htmlHash = hashShell(baseItem);
check(
  'modifying PL HTML content CHANGES hash',
  htmlHash !== baseHash,
  `base: ${baseHash}\nafter: ${htmlHash}`,
);

// ---------- T3: three-shape `shells:` contract + validation paths ----------
//
// Builds a synthetic registry on the fly (rather than depending on the live
// haven-ui registry.json) so the test stays stable as registered shells
// evolve. Wireframe content is written to temp files so parseWireframe()
// reads from disk through the same path it uses in production.

console.log('\nT3. three-shape `shells:` contract + validation paths');

const t3tmp = mkdtempSync(join(tmpdir(), 'wireframe-shell-contract-'));
const t3html = join(t3tmp, 'fake-shell.html');
writeFileSync(t3html, `<div class="shell"><slot /></div>`);

const fakeRegistry = {
  items: [
    {
      name: 'fake-shell',
      files: [{ path: 'components/FakeShell.tsx', type: 'registry:component' }],
      haven: {
        isAppShell: true,
        patternLibraryHtml: t3html,
        composition: {
          slotModel: 'children-slot',
          allowedChildren: [],
          markdocTag: null,
          propSchema: null,
        },
        notes: '',
        brandReviewed: false,
        a11yReviewed: false,
        stories: [],
      },
    },
  ],
};

const fakeCanon = hashShell(fakeRegistry.items[0]);

function writeWireframe(name: string, body: string): string {
  const path = join(t3tmp, name);
  writeFileSync(path, body);
  return path;
}

// (a) Declared with current canon — validates clean
const declaredPath = writeWireframe(
  'declared.md',
  `---\ntitle: Declared\nshells:\n  - name: fake-shell\n    pl_shell_version: ${fakeCanon}\n---\n\n# Declared\n`,
);
const declaredRecord = parseWireframe(declaredPath);
check(
  'shells: [{name, pl_shell_version}] parses to status.kind === "declared"',
  declaredRecord.status.kind === 'declared',
  `actual kind: ${declaredRecord.status.kind}`,
);

// (b) shells: [] — fragment, silent skip
const fragmentPath = writeWireframe(
  'fragment.md',
  `---\ntitle: Fragment\nshells: []\n---\n\n# Fragment\n`,
);
const fragmentRecord = parseWireframe(fragmentPath);
check(
  'shells: [] parses to status.kind === "fragment"',
  fragmentRecord.status.kind === 'fragment',
  `actual kind: ${fragmentRecord.status.kind}`,
);

// (c) shells: field absent
const absentPath = writeWireframe(
  'absent.md',
  `---\ntitle: Absent (no shells field)\n---\n\n# Absent\n`,
);
const absentRecord = parseWireframe(absentPath);
check(
  'shells: missing parses to status.kind === "absent"',
  absentRecord.status.kind === 'absent',
  `actual kind: ${absentRecord.status.kind}`,
);

// (d) Declared with stale hash
const stalePath = writeWireframe(
  'stale.md',
  `---\ntitle: Stale\nshells:\n  - name: fake-shell\n    pl_shell_version: sha256:0000000000000000000000000000000000000000000000000000000000000000\n---\n\n# Stale\n`,
);
const staleRecord = parseWireframe(stalePath);

// (e) Declared with unregistered shell name
const unregisteredPath = writeWireframe(
  'unregistered.md',
  `---\ntitle: Unregistered\nshells:\n  - name: nonexistent-shell\n    pl_shell_version: sha256:abc\n---\n\n# Unregistered\n`,
);
const unregisteredRecord = parseWireframe(unregisteredPath);

// (f) Shape errors: shells as string, shells with missing pl_shell_version
const shapeStringPath = writeWireframe(
  'shape-string.md',
  `---\ntitle: Shape error (string)\nshells: "not an array"\n---\n\n# X\n`,
);
const shapeStringRecord = parseWireframe(shapeStringPath);
check(
  "shells: 'string' parses to status.kind === 'shape-error'",
  shapeStringRecord.status.kind === 'shape-error',
  `actual kind: ${shapeStringRecord.status.kind}`,
);

const shapeMissingFieldPath = writeWireframe(
  'shape-missing-field.md',
  `---\ntitle: Shape error (missing pl_shell_version)\nshells:\n  - name: fake-shell\n---\n\n# X\n`,
);
const shapeMissingFieldRecord = parseWireframe(shapeMissingFieldPath);
check(
  "shells: [{name}] (missing pl_shell_version) parses to status.kind === 'shape-error'",
  shapeMissingFieldRecord.status.kind === 'shape-error',
  `actual kind: ${shapeMissingFieldRecord.status.kind}`,
);

// validateWireframes() routes each record into the right bucket
const result = validateWireframes(
  [
    declaredRecord,
    fragmentRecord,
    absentRecord,
    staleRecord,
    unregisteredRecord,
    shapeStringRecord,
    shapeMissingFieldRecord,
  ],
  fakeRegistry as Parameters<typeof validateWireframes>[1],
);

check(
  'validateWireframes counts 6 declared (incl. shape-error + stale + unregistered) + 1 absent of 7 total',
  result.total === 7 && result.declaredCount === 6 && result.absentCount === 1,
  `actual: total=${result.total} declared=${result.declaredCount} absent=${result.absentCount}`,
);

check(
  'validateWireframes records 1 fragment',
  result.fragmentCount === 1,
  `actual: ${result.fragmentCount}`,
);

check(
  'validateWireframes records 1 stale wireframe under shell "fake-shell"',
  result.stale.size === 1 &&
    result.stale.get('fake-shell')?.length === 1 &&
    result.stale.get('fake-shell')?.[0]?.wireframe === stalePath,
  `actual: stale.size=${result.stale.size}; entries=${JSON.stringify([...result.stale.entries()])}`,
);

check(
  'validateWireframes records 1 unregistered shell reference',
  result.unregistered.length === 1 &&
    result.unregistered[0]?.shellName === 'nonexistent-shell' &&
    result.unregistered[0]?.wireframe === unregisteredPath,
  `actual: ${JSON.stringify(result.unregistered)}`,
);

check(
  'validateWireframes records 2 shape errors (string + missing-field)',
  result.shapeErrors.length === 2,
  `actual: ${JSON.stringify(result.shapeErrors)}`,
);

check(
  'validateWireframes records 1 absent wireframe',
  result.absent.length === 1 && result.absent[0] === absentPath,
  `actual: ${JSON.stringify(result.absent)}`,
);

// Declared-with-current-canon does NOT appear in stale/unregistered/shapeErrors
const declaredAppearsAnywhere =
  [...result.stale.values()].some((es) => es.some((e) => e.wireframe === declaredPath)) ||
  result.unregistered.some((u) => u.wireframe === declaredPath) ||
  result.shapeErrors.some((s) => s.wireframe === declaredPath);
check(
  'declared wireframe with current canon is NOT flagged anywhere',
  !declaredAppearsAnywhere,
  `unexpected: declared wireframe was flagged`,
);

// ---------- summary ----------

const totalTests = 19;

console.log('');
if (failures.length === 0) {
  console.log(`PASSED — ${totalTests} self-tests, 0 failures.`);
  process.exit(0);
} else {
  console.error(`FAILED — ${failures.length} self-test failure(s):`);
  for (const f of failures) {
    console.error(`  ${f.test}\n    ${f.reason.split('\n').join('\n    ')}`);
  }
  process.exit(1);
}
