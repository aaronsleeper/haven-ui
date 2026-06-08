// ============================================================================
// SoT generated content — DERIVED VIEWS for the UConn SoT surface (SURFACE=sot).
// Builds the Apps/Operations hub pages from per-capability frontmatter and the
// Meeting-notes index from the dated notes. These are VIEWS (views.md): the cap
// notes + meeting notes are canonical; this regenerates their browsable index
// every build, so the hub never goes stale by hand. define-once: titles/status
// are READ from frontmatter, never restated.
// ============================================================================

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import matter from 'gray-matter';

const fm1 = (v) => Array.isArray(v) ? v.join(', ') : (v ?? '');
const esc = (s) => String(s).replace(/\|/g, '\\|');

function readCaps(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data } = matter(readFileSync(resolve(dir, f), 'utf8'));
      return { file: f, ...data };
    })
    .filter((c) => c.id)                       // skip docs without a cap id (e.g. candidate-measures.md)
    .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
}

function capTable(caps, cols) {
  const head = `| ${cols.map((c) => c.label).join(' | ')} |`;
  const rule = `| ${cols.map(() => '---').join(' | ')} |`;
  const rows = caps.map((c) => `| ${cols.map((col) => esc(fm1(c[col.key]))).join(' | ')} |`);
  return [head, rule, ...rows].join('\n');
}

// Apps & surfaces hub — the development capabilities (Andrey's view).
function appsPage(repo) {
  const caps = readCaps(resolve(repo, 'capabilities/development'));
  const live = caps.filter((c) => /live/i.test(String(c.state)) || c['dev-scope'] === 'live-verify').length;
  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Capability' },
    { key: 'surface', label: 'Surface' },
    { key: 'priority', label: 'Priority' },
    { key: 'dev-scope', label: 'Dev scope' },
    { key: 'status', label: 'Status' },
  ];
  return `---
title: Apps & surfaces
description: Patient + ops surfaces — the development capability set, derived from the per-capability notes.
---

The patient and provider/ops surfaces the program builds. This index is a **derived view** of the per-capability notes in \`capabilities/development/\` — the canonical source for any cap's scope, contract citation, and decisions log. Edit a cap note; rebuild; this table follows.

For app structure see \`patient-app-ia-v1.md\`; for the live operational dashboard see \`Capability matrix.md\` (Bases views, Obsidian-only). Build mode: IA v1 validated; Home/Assessments/Order slices built; build gated on stack (T0.1) + data layer (T0.2).

## Development capabilities (${caps.length})

${capTable(caps, cols)}

> Capability detail pages grow section-by-section as a real need appears (the hub-plus-matrix decision). The notes themselves are the canonical detail today.
`;
}

// Operations hub — the operations capabilities (Vanessa's view) + SOP pointer.
function operationsPage(repo) {
  const caps = readCaps(resolve(repo, 'capabilities/operations'));
  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Capability' },
    { key: 'surface', label: 'Surface' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
  ];
  return `---
title: Operations
description: Referral, enrollment, fulfillment, escalation — the operational capability set.
---

The operational backbone — referral intake, enrollment, fulfillment, escalation, and content. This index is a **derived view** of \`capabilities/operations/\`; edit a cap note to change a row. The procedures that operate these capabilities are tracked on the [SOPs](./sops.html) page (this pilot's slice of the org SOP taxonomy) — that is the single SOP surface.

## Operations capabilities (${caps.length})

${capTable(caps, cols)}
`;
}

// ---------------------------------------------------------------------------
// Markdown parsing helpers (for deriving the SOPs page from the SOP docs).
// ---------------------------------------------------------------------------
// Parse GFM tables that sit under headings of an exact level. Returns
// [{ heading, headers:[...], rows:[[cell,...],...] }]. Tolerant of rich cell
// text (emoji, italics, backticks) — cells are kept verbatim.
function parseTablesUnder(md, level) {
  const lines = md.split('\n');
  const hRe = new RegExp(`^#{${level}}\\s+(.*)$`);   // exact level (#### won't match #{3}\s)
  const anyH = /^#{1,6}\s/;
  const out = [];
  let cur = null;
  for (const line of lines) {
    const hm = line.match(hRe);
    if (hm) { cur = { heading: hm[1].trim(), headers: null, rows: [] }; out.push(cur); continue; }
    if (anyH.test(line)) { const lvl = line.match(/^#+/)[0].length; if (lvl <= level) cur = null; continue; }
    if (cur && line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^:?-+:?$/.test(c))) continue;       // separator row
      if (!cur.headers) cur.headers = cells; else cur.rows.push(cells);
    }
  }
  return out.filter((s) => s.rows.length);
}

// Extract the raw lines under a heading whose text starts with `startsWith`,
// up to the next heading. Used to surface the Coverage Map's sequence + decisions.
function linesUnderHeading(md, startsWith) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => /^#{1,6}\s/.test(l) && l.replace(/^#+\s+/, '').trim().startsWith(startsWith));
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out;
}

// Drafted role/process SOPs that have a rendered exemplar in the haven-ui
// Document district. Referenced (not live-linked) until co-emitted into this
// bundle — the exemplars use the pattern-library <load> preprocessor and are
// not self-contained static HTML.
const SOP_EXEMPLARS = {
  'Care Coordinator': 'doc-care-coordinator-sop.html',
  'Registered Dietitian': 'doc-rd-sop.html',
  'Administrator': 'doc-admin-sop.html',
  'Participant Enrollment & Onboarding': 'doc-enrollment-onboarding-sop.html',
};
function renderedRef(sopName) {
  for (const [k, file] of Object.entries(SOP_EXEMPLARS)) {
    if (sopName.startsWith(k)) return `\`${file}\``;
  }
  return '—';
}

// SOPs hub — DERIVED from the org SOP Master Taxonomy + the UConn Coverage Map.
// Org-level page (the taxonomy is org-common, by its own declaration) with the
// UConn pilot slice surfaced as the first program instance. One SOP surface.
function sopsPage(cenaRoot, repo) {
  const taxPath = resolve(cenaRoot, 'SOP Master Taxonomy.md');
  const mapPath = resolve(repo, 'SOP Coverage Map.md');
  const tax = existsSync(taxPath) ? readFileSync(taxPath, 'utf8') : '';
  const map = existsSync(mapPath) ? readFileSync(mapPath, 'utf8') : '';

  // Org master taxonomy: the per-department tables (### sections under "SOP master list").
  const taxSections = parseTablesUnder(tax, 3).filter((s) => s.headers && /scope/i.test(s.headers.join(' ')));
  const taxBlocks = taxSections.map((s) => {
    const cols = ['Task SOP', 'Scope', 'Storage', 'Status', 'Accountable'];
    const head = `| ${cols.join(' | ')} |`;
    const rule = `| ${cols.map(() => '---').join(' | ')} |`;
    const rows = s.rows.map((r) => `| ${cols.map((_, i) => esc(r[i] ?? '')).join(' | ')} |`);
    return `#### ${s.heading}\n\n${[head, rule, ...rows].join('\n')}`;
  }).join('\n\n');

  // UConn slice: the two Coverage-Map tables, with a Rendered-draft reference column.
  const mapTables = parseTablesUnder(map, 2);
  const uconnBlocks = mapTables
    .filter((s) => /SOP/i.test(s.headers?.[0] || ''))
    .map((s) => {
      const head = `| SOP | Covers | Status | Rendered draft |`;
      const rule = `| --- | --- | --- | --- |`;
      const rows = s.rows.map((r) => `| ${esc(r[0] ?? '')} | ${esc(r[1] ?? '')} | ${esc(r[2] ?? '')} | ${renderedRef(r[0] ?? '')} |`);
      return `#### ${s.heading}\n\n${[head, rule, ...rows].join('\n')}`;
    }).join('\n\n');

  const sequence = linesUnderHeading(map, 'Recommended sequence').filter((l) => l.trim()).join('\n');
  const decisions = linesUnderHeading(map, 'Open scope decisions').filter((l) => l.trim()).join('\n');

  return `---
title: SOPs
description: The org SOP taxonomy and the UConn pilot's coverage slice — derived from the canonical SOP docs.
---

Standard Operating Procedures, by role and department. The single term "SOP" hides **three document tiers** in the standard quality-management hierarchy (ISO 9001 / HACCP convention):

- **Procedure** *(role-level SOP)* — the agreed way a recurring activity is done so any qualified person in the role performs it consistently. Few per role. The 4 drafted launch-readiness documents (CC, RD, Admin, Enrollment) sit here.
- **Work instruction** — step-by-step for a *single task*; safety- or quality-critical. Many per Procedure. Most of the "hundreds" live here.
- **Standardized recipe** *(food-service)* — measurements, times, temps, yields; HACCP-adjacent. Recipe development & standardization is a work-instruction-tier procedure whose *output* is a Standardized Recipe.

An SOP's authored makeup is defined by the \`clinical-staff-sop\` deliverable spec. Where "hundreds" lives: in the Work Instruction + Recipe tiers — the master taxonomy below scaffolds them, and the **Director of Clinical Ops** + **Vanessa (kitchen SME)** are the enumeration owners.

:::callout{variant="info" title="This page is a derived view."}
The tables below are generated at build time from the two canonical SOP docs — the org **SOP Master Taxonomy** (\`SOP Master Taxonomy.md\`) and the UConn **SOP Coverage Map** (\`SOP Coverage Map.md\`). **Edit those docs; rebuild; this page follows.** Currency lives there, not here.
:::

Status: ✅ drafted · ◔ planned · ⬜ not started · ◐ partial/in-progress · ⛔ gap/undecided. Scope: **O** = org-common · **P** = program-specific.

## Org master taxonomy (cross-program)

The org-wide list of every SOP Cena expects to maintain — recorded, not remembered. Org-common SOPs are written once and reused; program-specific ones live with their program. Owner: Director of Clinical Operations.

${taxBlocks || '_(no taxonomy tables parsed — check SOP Master Taxonomy.md)_'}

## UConn pilot slice (first program instance)

The SOPs this pilot needs to execute the contract, and their draft status. Rendered drafts live in the haven-ui Document district (\`pattern-library/pages/doc-*-sop.html\`); the filename is noted where one exists. *(Co-deploying the rendered SOPs into this site so the references become live links is a tracked follow-up.)*

${uconnBlocks || '_(no coverage tables parsed — check SOP Coverage Map.md)_'}

### Recommended sequence to ready

${sequence || '_(see SOP Coverage Map.md)_'}

### Open scope decisions

${decisions || '_(see SOP Coverage Map.md)_'}

> **Editable source of truth:** the org list lives in \`SOP Master Taxonomy.md\`; the UConn slice in \`Partners/UCONN Health/SOP Coverage Map.md\`. This page never owns SOP rows — it renders theirs.
`;
}

// Meeting notes index — links to each dated note (emitted as its own page).
const NOTE_RE = /^\d{4}-\d{2}-\d{2}.*\.md$/;
export function meetingNotes(repo) {
  return readdirSync(repo)
    .filter((f) => NOTE_RE.test(f))
    .sort()
    .reverse()
    .map((f) => {
      const title = basename(f, '.md');
      const slug = 'meeting-' + title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
      return { file: f, title, slug, srcAbs: resolve(repo, f) };
    });
}

function meetingsPage(notes) {
  const rows = notes.map((n) => `- [${n.title}](./${n.slug}.html)`).join('\n');
  return `---
title: Meeting notes
description: The program's meetings — each note is the source of decisions the ledger records.
---

Every load-bearing decision in the **State ledger** traces back to a conversation. These are the dated meeting notes, newest first — the institutional memory behind the "why."

${rows}
`;
}

// Write all generated SoT content pages into contentDir; return meeting-note
// page descriptors for the emitter to render.
export function generateSotContent({ repo, cenaRoot, contentDir }) {
  mkdirSync(contentDir, { recursive: true });
  // uconn- prefix: these are the UConn program space's hub pages (the site is the
  // Cena org SoT; UConn is a child space). See ~/.claude/plans/uconn-sot-site/.
  writeFileSync(resolve(contentDir, 'uconn-apps.md'), appsPage(repo), 'utf8');
  writeFileSync(resolve(contentDir, 'uconn-operations.md'), operationsPage(repo), 'utf8');
  // SOPs: org-level page (the taxonomy is org-common) derived from both SOP docs.
  writeFileSync(resolve(contentDir, 'sops.md'), sopsPage(cenaRoot, repo), 'utf8');
  const notes = meetingNotes(repo);
  writeFileSync(resolve(contentDir, 'uconn-meetings.md'), meetingsPage(notes), 'utf8');
  console.log(`  sot-gen: apps/operations/sops/meetings indexes + ${notes.length} meeting-note pages`);
  return notes;
}
