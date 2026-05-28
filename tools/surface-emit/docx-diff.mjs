#!/usr/bin/env node
//
// docx-diff.mjs — parse tracked changes from a Drive-edited docx and emit a
// human-reviewable patch proposal anchored by heading hierarchy + paragraph
// index.
//
// Usage:
//   docx-diff.mjs <edited.docx> [--slug=<doc-slug>] [--out=<path>]
//
// Pipeline:
//   1. pandoc <edited.docx> --track-changes=all -o /tmp/<...>.md
//   2. Extract [content]{.insertion|deletion author="X" date="Y"} bracketed spans
//   3. Anchor each by walking the parsed markdown: section path (h1>h2>h3...)
//      + paragraph index within the section
//   4. Emit a patch proposal markdown for Aaron to review before merging.
//
// Anchor model: heading hierarchy + paragraph index (NOT directive-class recovery
// — Google Docs flattens style names, so anchoring by class would be unreliable).
// The source markdown's structural shape and the parsed markdown's structural
// shape are aligned because Pandoc preserves headings and paragraph order
// faithfully.
//
// v1 scope: insertions + deletions from suggesting-mode edits.
// Out of scope (v2+): Google Docs comments (live in word/comments.xml separately
// and are not surfaced by Pandoc's --track-changes pass), paragraph-insertion /
// paragraph-deletion markers, formatting-only changes.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, basename, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DIFFS_DIR = join(SCRIPT_DIR, 'diffs');

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: docx-diff.mjs <edited.docx> [--slug=<doc-slug>] [--out=<path>]');
    process.exit(64);
  }
  const positional = args.filter(a => !a.startsWith('--'));
  const flags = Object.fromEntries(
    args.filter(a => a.startsWith('--')).map(a => {
      const [k, ...v] = a.replace(/^--/, '').split('=');
      return [k, v.join('=') || true];
    })
  );
  const edited = resolve(positional[0]);
  if (!existsSync(edited)) {
    console.error(`File not found: ${edited}`);
    process.exit(66);
  }
  return { edited, slug: flags.slug, out: flags.out };
}

function runPandoc(editedPath) {
  const tmpOut = `/tmp/docx-diff-${process.pid}-${Date.now()}.md`;
  execSync(
    `pandoc "${editedPath}" --track-changes=all -o "${tmpOut}"`,
    { stdio: ['ignore', 'inherit', 'inherit'] }
  );
  return readFileSync(tmpOut, 'utf-8');
}

// Extract tracked-change bracketed spans. Pandoc emits:
//   [content]{.insertion author="X" date="Y"}
//   [content]{.deletion author="X" date="Y"}
// Content may contain nested brackets (e.g., markdown task lists `[ ]`, inline
// links, code spans). Naive non-greedy regex over-captures when earlier `[` in
// the document precedes a tracked-change closing `]{...}`.
//
// Strategy: anchor on the unambiguous suffix `]{.insertion ...}` / `]{.deletion ...}`,
// then walk BACKWARD from the `]` accounting for bracket balance to find the
// matching `[`. Whitespace in the content is normalized (pandoc wraps long lines).
function extractChanges(parsedMd) {
  const changes = [];
  const attrRe = /\]\{\.(insertion|deletion)\s+author="([^"]+)"\s+date="([^"]+)"\}/g;
  let m;
  while ((m = attrRe.exec(parsedMd)) !== null) {
    const closePos = m.index;
    const openPos = findMatchingOpenBracket(parsedMd, closePos);
    if (openPos === -1) continue;
    const rawContent = parsedMd.slice(openPos + 1, closePos);
    changes.push({
      type: m[1],
      author: m[2],
      date: m[3],
      content: normalizeWhitespace(rawContent),
      offset: openPos,
    });
  }
  return changes;
}

function findMatchingOpenBracket(text, closePos) {
  let depth = 1;
  for (let i = closePos - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === ']') depth += 1;
    else if (ch === '[') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function normalizeWhitespace(s) {
  // Pandoc wraps lines at ~80 columns; rejoin so single-paragraph insertions
  // read on one line. Preserve blank-line paragraph breaks.
  return s
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => p.length)
    .join('\n\n')
    .trim();
}

// Walk the parsed markdown line by line, tracking heading hierarchy and a
// running paragraph index per section. For each line, record its position
// metadata; we'll match changes to lines by character offset.
function buildLineIndex(parsedMd) {
  const lines = parsedMd.split('\n');
  const index = [];
  const headingStack = []; // entries: { level, text }
  let paragraphIdx = 0;
  let inParagraph = false;
  let offset = 0;

  for (const line of lines) {
    const lineLen = line.length + 1; // +1 for newline
    const start = offset;
    const end = offset + lineLen;

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      // Pop stack to current level
      while (headingStack.length && headingStack[headingStack.length - 1].level >= level) {
        headingStack.pop();
      }
      headingStack.push({ level, text });
      paragraphIdx = 0;
      inParagraph = false;
    } else if (line.trim() === '') {
      inParagraph = false;
    } else {
      if (!inParagraph) {
        paragraphIdx += 1;
        inParagraph = true;
      }
    }

    index.push({
      start,
      end,
      sectionPath: headingStack.map(h => h.text),
      paragraphIdx,
    });
    offset = end;
  }
  return index;
}

function anchorChange(change, lineIndex) {
  // Find the line whose range contains change.offset
  for (const entry of lineIndex) {
    if (change.offset >= entry.start && change.offset < entry.end) {
      return {
        sectionPath: entry.sectionPath.slice(),
        paragraphIdx: entry.paragraphIdx,
      };
    }
  }
  return { sectionPath: [], paragraphIdx: 0 };
}

function inferSlug(editedPath, explicit) {
  if (explicit) return explicit;
  const base = basename(editedPath, '.docx');
  // Strip trailing -edited, -review, -<date>, etc.
  return base
    .replace(/-edited$/i, '')
    .replace(/-review$/i, '')
    .replace(/-\d{4}-\d{2}-\d{2}$/, '');
}

function pickReviewer(changes) {
  if (!changes.length) return 'unknown';
  // Most common author across changes
  const counts = {};
  for (const c of changes) counts[c.author] = (counts[c.author] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function reviewerSlug(name) {
  return name
    .toLowerCase()
    .replace(/dr\.?\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function pickDate(changes) {
  if (!changes.length) return new Date().toISOString().slice(0, 10);
  const dates = changes.map(c => c.date).sort();
  return dates[dates.length - 1].slice(0, 10);
}

function formatChange(change, anchor, idx) {
  const sectionPath = anchor.sectionPath.length
    ? anchor.sectionPath.join(' → ')
    : '(document root)';
  const typeLabel = change.type === 'insertion' ? 'Insertion' : 'Deletion';
  const verb = change.type === 'insertion' ? 'wants to add' : 'wants to remove';
  return [
    `## Change ${idx + 1}: ${typeLabel} in ${sectionPath}`,
    '',
    `- **Author:** ${change.author}`,
    `- **Date:** ${change.date}`,
    `- **Paragraph index within section:** ${anchor.paragraphIdx}`,
    '',
    `${change.author} ${verb}:`,
    '',
    '> ' + change.content.split('\n').join('\n> '),
    '',
    'Disposition: [ ] absorb  [ ] reject  [ ] discuss',
    '',
    'Notes:',
    '',
    '---',
    '',
  ].join('\n');
}

function emitPatch({ changes, anchors, editedPath, slug, reviewer, date }) {
  const lines = [];
  lines.push(`# Review feedback — ${slug} — ${reviewer} — ${date}`);
  lines.push('');
  lines.push(`Edited docx: \`${editedPath}\``);
  lines.push('');
  if (!changes.length) {
    lines.push('No tracked changes found.');
    lines.push('');
    lines.push('_Note: this tool extracts suggesting-mode insertions and deletions only._');
    lines.push('_Google Docs comments live in `word/comments.xml` and are not yet surfaced (v2 scope)._');
    return lines.join('\n');
  }
  lines.push(`**${changes.length} tracked change${changes.length === 1 ? '' : 's'}** found across the docx.`);
  lines.push('');
  lines.push('Each change is anchored by section path + paragraph index within that section. Review each, choose a disposition, then apply absorbed changes to the markdown SoT before bumping the version.');
  lines.push('');
  lines.push('---');
  lines.push('');
  for (let i = 0; i < changes.length; i++) {
    lines.push(formatChange(changes[i], anchors[i], i));
  }
  lines.push('## Disposition summary');
  lines.push('');
  lines.push('After working through each change, capture the result:');
  lines.push('');
  lines.push('- Absorbed: __ of ' + changes.length);
  lines.push('- Rejected: __ of ' + changes.length);
  lines.push('- Discuss: __ of ' + changes.length);
  lines.push('');
  lines.push('_Note: Google Docs comments aren\'t in this report (v2 scope)._');
  return lines.join('\n');
}

// --- Main ---
const { edited, slug: slugArg, out: outArg } = parseArgs(process.argv);
const parsedMd = runPandoc(edited);
const changes = extractChanges(parsedMd);
const lineIndex = buildLineIndex(parsedMd);
const anchors = changes.map(c => anchorChange(c, lineIndex));

const slug = inferSlug(edited, slugArg);
const reviewer = pickReviewer(changes);
const reviewerSlugged = reviewerSlug(reviewer);
const date = pickDate(changes);

const outPath = outArg
  ? resolve(outArg)
  : join(DIFFS_DIR, `${slug}-${reviewerSlugged}-${date}.patch.md`);

if (!existsSync(dirname(outPath))) {
  mkdirSync(dirname(outPath), { recursive: true });
}

const patch = emitPatch({
  changes,
  anchors,
  editedPath: edited,
  slug,
  reviewer,
  date,
});

writeFileSync(outPath, patch);
console.log(`  ✓ ${outPath} (${changes.length} change${changes.length === 1 ? '' : 's'})`);
