#!/usr/bin/env tsx
// Parse + validate a .mdoc wireframe against the generated registry tag schemas.
// Exits 0 on clean parse + zero validation errors; non-zero otherwise, with
// file:line:col output per Markdoc's error envelope.
//
// Usage: tsx scripts/validate-mdoc.ts <path-to-mdoc> [...more-paths]

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import * as schemas from '../schema/index.js';

const config = {
  tags: {
    'assessment-header': schemas.assessmentHeader,
    'primary-action': schemas.primaryAction,
    'progress-bar-pagination': schemas.progressBarPagination,
    'queue-item': schemas.queueItem,
    'queue-sidebar': schemas.queueSidebar,
    'response-option': schemas.responseOption,
    'response-option-group': schemas.responseOptionGroup,
  },
};

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error('usage: tsx scripts/validate-mdoc.ts <path.mdoc> [...]');
  process.exit(2);
}

let hadError = false;
for (const rel of paths) {
  const abs = resolve(process.cwd(), rel);
  const source = readFileSync(abs, 'utf8');
  const ast = Markdoc.parse(source);
  const errors = Markdoc.validate(ast, config);

  const critical = errors.filter(
    (e) => e.error.level === 'critical' || e.error.level === 'error'
  );

  if (critical.length === 0) {
    console.log(`ok   ${rel}`);
  } else {
    hadError = true;
    console.log(`FAIL ${rel}  (${critical.length} error${critical.length > 1 ? 's' : ''})`);
    for (const e of critical) {
      const loc = e.location?.start
        ? `${rel}:${e.location.start.line}:${e.location.start.character ?? 0}`
        : rel;
      console.log(`  ${loc}  [${e.error.level}] ${e.error.id}: ${e.error.message}`);
    }
  }
}

process.exit(hadError ? 1 : 0);
