// Self-tests for the wireframe-shell gate's hash + canonicalization layer.
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
//
// Tests for the three-shape `shells:` contract live with the gate (Phase 2),
// not here — this Phase 1 file covers only what Phase 1 ships.

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { canonicalizeShellHtml } from '../../../src/lib/canonicalize-shell-html.js';
import { hashShell } from '../../../src/lib/shell-canon.js';

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

// ---------- summary ----------

console.log('');
if (failures.length === 0) {
  console.log(`PASSED — ${10} self-tests, 0 failures.`);
  process.exit(0);
} else {
  console.error(`FAILED — ${failures.length} self-test failure(s):`);
  for (const f of failures) {
    console.error(`  ${f.test}\n    ${f.reason.split('\n').join('\n    ')}`);
  }
  process.exit(1);
}
