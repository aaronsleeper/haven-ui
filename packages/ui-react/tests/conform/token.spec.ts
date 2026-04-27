import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { normalizeColor } from './utils/normalizeColor';
import { parseTokensCSS } from './utils/parseTokensCSS';
import { waitForFonts } from './utils/waitForFonts';

const HERE = resolve(fileURLToPath(import.meta.url), '..');
const DS_TOKENS_DIR = resolve(
  HERE,
  '../../../design-system/src/styles/tokens',
);

// Inverted discovery: every `tokens/*.css` file IS a token spec by default.
// Exclusions are named explicitly here. Landing a new `tokens/foo.css` picks
// it up automatically — no gate-file edit required. Prior include-list policy
// silently missed `radius.css` between authoring (2026-04-19) and gate-update
// (2026-04-20); this inversion closes that class of failure structurally.
const EXCLUDED_FROM_GATE = new Set<string>([
  'components.css', // @apply consumer layer — references tokens, does not declare them
]);

async function discoverTokenFiles(): Promise<string[]> {
  const entries = await readdir(DS_TOKENS_DIR);
  return entries
    .filter((f) => f.endsWith('.css'))
    .filter((f) => !EXCLUDED_FROM_GATE.has(f))
    .sort();
}

// Token-conformance gate. For each pilot story, reads the rendered component's
// root element and asserts its six core computed properties (backgroundColor,
// color, fontFamily, fontSize, fontWeight, borderRadius) each resolve to a
// value in the live registered token set.
//
// The "registered set" is discovered from :root at page load — it includes
// Haven-authored @theme declarations PLUS Tailwind 4 defaults (e.g. --color-
// white, --radius-sm, --text-sm, --font-weight-normal) that flow through
// unchanged. Reading source files alone would miss defaults and false-fail
// every story that legitimately uses a Tailwind-default utility.
//
// Pilot scope: set-membership check (SPEC §6). Raw hex, off-scale sizes,
// unregistered fonts all fail. Specific per-component expected-token mapping
// is v2 (after pilot ships).

// Values we accept regardless of category — legitimate unset / inherit /
// transparent outcomes.
const UNIVERSAL_EXEMPTIONS = new Set<string>([
  'rgba(0, 0, 0, 0)',
  'transparent',
  'initial',
  'inherit',
  'unset',
  'normal',
  'auto',
  '0px',
]);

// Haven's three authored font families. Observed fontFamily is a CSS font
// stack; match if any family appears.
const REGISTERED_FONT_FAMILIES = ['Lora', 'Source Sans 3', 'Source Code Pro'];

type Story = { id: string; selector: string };

const STORIES: Story[] = [
  { id: 'ui-queueitem--default', selector: '.queue-item' },
  { id: 'ui-queuesectionheader--default', selector: '.queue-section-header' },
  { id: 'ui-queuesidebar--default', selector: '.queue-sidebar' },
  { id: 'ui-responseoption--default', selector: '.response-option' },
  { id: 'ui-responseoptiongroup--default', selector: '.response-option-group' },
  { id: 'ui-progressbarpagination--default', selector: '.progress-bar-pagination' },
  { id: 'ui-assessmentheader--default', selector: '.assessment-header' },
];

type TokenSets = {
  colors: Set<string>;
  fontSizes: Set<string>;
  fontWeights: Set<string>;
  borderRadii: Set<string>;
};

async function discoverTokens(page: Page): Promise<TokenSets> {
  // Union of two sources:
  //
  //   1. Source tokens — Haven's token CSS files parsed at Node side. Includes
  //      declared-but-unused tokens that Tailwind 4's @theme tree-shakes from
  //      compiled output (e.g., --font-weight-regular: 400, declared in
  //      typography.css but only referenced indirectly at use sites).
  //
  //   2. Runtime tokens — every <style>-tag declaration in the Storybook
  //      iframe, parsed with the same parser. Includes Tailwind defaults that
  //      Haven doesn't redeclare (--color-white, --radius-sm, --font-weight-
  //      bold, etc.) when a utility references them.
  //
  // Either source alone misses cases. Union matches the operator's mental
  // model: "any value that Haven or Tailwind 4 declared is registered."
  //
  // getComputedStyle(document.documentElement) doesn't enumerate custom props
  // (browser spec gap); style-tag concat is the correct runtime path.

  const tokenFiles = await discoverTokenFiles();
  const sourceText = (
    await Promise.all(
      tokenFiles.map((f) => readFile(resolve(DS_TOKENS_DIR, f), 'utf-8')),
    )
  ).join('\n');
  const sourceTokens = parseTokensCSS(sourceText);

  const runtimeText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
  });
  const runtimeTokens = parseTokensCSS(runtimeText);

  const allTokens: Record<string, string> = { ...runtimeTokens, ...sourceTokens };

  const colors = new Set<string>();
  const fontSizes = new Set<string>();
  const fontWeights = new Set<string>();
  const borderRadii = new Set<string>();

  for (const [name, value] of Object.entries(allTokens)) {
    if (!value) continue;
    if (name.startsWith('--color-')) {
      try {
        colors.add(normalizeColor(value));
      } catch {
        // oklch/named/hsla — parseTokensCSS passes through, normalizeColor
        // may throw on hex-only path; skip those, the browser resolves them
        // to rgb() at use-site and those will be set-matched via computed.
      }
    } else if (name.startsWith('--text-') && /^[\d.]+(?:px|rem)$/.test(value)) {
      fontSizes.add(value);
    } else if (name.startsWith('--font-weight-') && /^\d+$/.test(value)) {
      fontWeights.add(value);
    } else if (name.startsWith('--radius-') && /^[\d.]+(?:px|rem)$/.test(value)) {
      borderRadii.add(value);
    }
  }

  return { colors, fontSizes, fontWeights, borderRadii };
}

// Tailwind 4 authors sizes in rem; computed styles come back in px. Convert
// a rem registered-set into a px-normalized clone so the observed "14px"
// matches a registered "0.875rem" (= 14px at 16px root).
function expandRemToPx(set: Set<string>): Set<string> {
  const expanded = new Set(set);
  for (const value of set) {
    const rem = value.match(/^([\d.]+)rem$/);
    if (rem) {
      const px = parseFloat(rem[1]) * 16;
      expanded.add(`${px}px`);
    }
  }
  return expanded;
}

function assertColorRegistered(
  observed: string,
  property: string,
  selector: string,
  colors: Set<string>,
): void {
  if (UNIVERSAL_EXEMPTIONS.has(observed)) return;
  const normalized = normalizeColor(observed);
  expect
    .soft(
      colors.has(normalized),
      `${selector} ${property} — observed "${observed}" (normalized "${normalized}") is not a registered color token`,
    )
    .toBe(true);
}

function assertFontFamilyRegistered(observed: string, selector: string): void {
  if (UNIVERSAL_EXEMPTIONS.has(observed)) return;
  const matches = REGISTERED_FONT_FAMILIES.some((family) =>
    observed.toLowerCase().includes(family.toLowerCase()),
  );
  expect
    .soft(
      matches,
      `${selector} fontFamily — observed "${observed}" does not contain a registered Haven family (${REGISTERED_FONT_FAMILIES.join(', ')})`,
    )
    .toBe(true);
}

function assertInSet(
  observed: string,
  property: string,
  selector: string,
  set: Set<string>,
): void {
  if (UNIVERSAL_EXEMPTIONS.has(observed)) return;
  expect
    .soft(
      set.has(observed),
      `${selector} ${property} — observed "${observed}" is not a registered token value (${set.size} registered)`,
    )
    .toBe(true);
}

for (const story of STORIES) {
  test(`token conformance — ${story.id} (${story.selector})`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForLoadState('domcontentloaded');
    await waitForFonts(page);

    const tokens = await discoverTokens(page);
    const fontSizes = expandRemToPx(tokens.fontSizes);
    const borderRadii = expandRemToPx(tokens.borderRadii);

    const element = page.locator(story.selector).first();
    await expect(element, `selector ${story.selector} not found`).toBeVisible();

    const observed = await element.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        borderRadius: cs.borderTopLeftRadius,
      };
    });

    assertColorRegistered(observed.backgroundColor, 'backgroundColor', story.selector, tokens.colors);
    assertColorRegistered(observed.color, 'color', story.selector, tokens.colors);
    assertFontFamilyRegistered(observed.fontFamily, story.selector);
    assertInSet(observed.fontSize, 'fontSize', story.selector, fontSizes);
    assertInSet(observed.fontWeight, 'fontWeight', story.selector, tokens.fontWeights);
    assertInSet(observed.borderRadius, 'borderRadius', story.selector, borderRadii);
  });
}
