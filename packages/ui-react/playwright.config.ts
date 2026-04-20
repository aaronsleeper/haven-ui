import { defineConfig, devices } from '@playwright/test';

// Playwright config for @haven/ui-react conformance gates (token + visual).
//
// webServer behavior switches on CI:
// - Local (no CI env): spawn `storybook dev` on :5178, reuse existing server
//   so iterative runs don't bounce the server between tests.
// - CI (CI=true): build static storybook and serve it via http-server on
//   :5178. Static matches production behavior (no Vite dev transforms) and
//   stabilizes visual baselines across runs.
//
// Visual baselines commit to __screenshots__/ next to each spec. Per SPEC v0.4
// §7, baselines are Linux-only — visual.spec.ts guards against local runs via
// process.env.CI. This config doesn't enforce that — it's the spec's job.

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/conform',
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  workers: isCI ? 2 : undefined,
  use: {
    baseURL: 'http://localhost:5178',
    trace: isCI ? 'retain-on-failure' : 'off',
  },
  webServer: {
    command: isCI ? 'pnpm storybook:serve' : 'pnpm storybook',
    url: 'http://localhost:5178',
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
    },
  },
});
