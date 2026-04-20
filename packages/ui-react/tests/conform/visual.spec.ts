import { test, expect } from '@playwright/test';
import { waitForFonts } from './utils/waitForFonts';

// Visual-regression gate. For each pilot story, captures a component-precise
// screenshot via locator.screenshot() (no Storybook shell, no decorator
// padding) and diffs against a committed baseline.
//
// CI-ONLY per SPEC v0.4 §7. macOS dev environments produce different font-
// hinting and antialiasing than Linux CI runners; local baselines drift on
// every PR. The test.skip() guard below is the policy enforcement.
//
// Baselines commit to packages/ui-react/tests/conform/__screenshots__/ —
// treat them like source. First-run generation: PR workflow invokes
// `playwright test --update-snapshots` on the Linux runner.

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

test.describe('visual regression', () => {
  test.skip(
    !process.env.CI,
    'Visual baselines are CI-only per SPEC §7 — macOS/Linux font rendering drift invalidates local baselines',
  );

  for (const story of STORIES) {
    test(story.id, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState('domcontentloaded');
      await waitForFonts(page);

      const element = page.locator(story.selector).first();
      await expect(element).toBeVisible();
      await expect(element).toHaveScreenshot(`${story.id}.png`);
    });
  }
});
