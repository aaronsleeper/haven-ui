// pnpm pending — regenerate `design/build/outstanding-assets.md` from PENDING.
//
// Reads the PENDING map in `src/lib/demo-patient.ts`, groups entries by
// category, and writes a human-readable tracker doc. The doc is the canonical
// pre-demo "what's still outstanding" view; never hand-edit it.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PENDING,
  type PendingCategory,
  type PendingEntry,
} from '../src/lib/demo-patient';

const APP_ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUTPUT_PATH = resolve(APP_ROOT, 'design/build/outstanding-assets.md');

const CATEGORY_TITLES: Record<PendingCategory, string> = {
  staff: 'Staff (pending Vanessa)',
  'clinical-copy': 'Clinical copy',
  data: 'Data',
  legal: 'Legal (pending legal review)',
};

const CATEGORY_ORDER: PendingCategory[] = ['staff', 'clinical-copy', 'data', 'legal'];

function entriesByCategory(): Record<PendingCategory, Array<[string, PendingEntry]>> {
  const out = {
    staff: [],
    'clinical-copy': [],
    data: [],
    legal: [],
  } as Record<PendingCategory, Array<[string, PendingEntry]>>;

  for (const [key, entry] of Object.entries(PENDING) as Array<[string, PendingEntry]>) {
    out[entry.category].push([key, entry]);
  }

  return out;
}

function renderEntry(key: string, entry: PendingEntry): string {
  const lines: string[] = [];
  lines.push(`- **${key}** → \`${entry.value}\``);
  lines.push(`  - Source: ${entry.source}`);
  lines.push(`  - Note: ${entry.note}`);
  if (entry.alt) {
    lines.push(`  - Alt: \`${entry.alt}\``);
  }
  return lines.join('\n');
}

function render(): string {
  const grouped = entriesByCategory();
  const total = Object.values(grouped).reduce((sum, list) => sum + list.length, 0);

  const sections: string[] = [];
  sections.push('# Outstanding Assets — Dieckhaus Demo (May 22, 2026)');
  sections.push('');
  sections.push(
    '> **Auto-generated** from `apps/patient/src/lib/demo-patient.ts` PENDING map.',
  );
  sections.push(
    "> Do not edit by hand — run `pnpm --filter @haven/app-patient pending` to regenerate.",
  );
  sections.push('');
  sections.push(`Total outstanding: **${total}**`);
  sections.push('');

  for (const category of CATEGORY_ORDER) {
    const items = grouped[category];
    if (items.length === 0) continue;
    sections.push(`## ${CATEGORY_TITLES[category]}`);
    sections.push('');
    for (const [key, entry] of items) {
      sections.push(renderEntry(key, entry));
    }
    sections.push('');
  }

  sections.push('## Resolution');
  sections.push('');
  sections.push('When external input arrives:');
  sections.push('');
  sections.push(
    '1. Edit `PENDING[key].value` in `apps/patient/src/lib/demo-patient.ts`.',
  );
  sections.push(
    '2. Run `pnpm --filter @haven/app-patient pending` to regenerate this file.',
  );
  sections.push(
    '3. (Optional) Remove the entry from `PENDING` and inline the literal at consumer sites once confirmed for ship.',
  );
  sections.push('');

  return sections.join('\n');
}

writeFileSync(OUTPUT_PATH, render(), 'utf8');
console.log(`wrote ${OUTPUT_PATH}`);
