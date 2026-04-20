import type { Page } from '@playwright/test';

// Awaits webfont load before asserting token-computed styles. Haven's fonts
// (Lora, Inter, JetBrains Mono) shift fontFamily fallback-stack evaluation
// and font-metrics-sensitive properties (letter-spacing, line-height) until
// they're fully loaded. Per spike PROTOTYPE-REPORT phase-0 recommendation.
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
  });
  await page.waitForTimeout(100);
}
