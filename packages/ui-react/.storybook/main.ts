import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

// Storybook config for @haven/ui-react.
//
// One story per registry.json entry; each mirrors its pattern-library HTML
// exemplar 1:1. Stories are the canonical visual baselines for the step-10
// visual-regression gate (Playwright toHaveScreenshot).
//
// Tailwind 4 is wired via @tailwindcss/vite inside viteFinal — the design-
// system and every app use the same plugin (see packages/design-system/
// vite.config.ts and apps/*/vite.config.ts). Without it, @apply semantic
// classes and @theme tokens don't compile and stories render unstyled.
//
// FontAwesome is mounted via staticDirs so stories can <link> the same
// /vendor/fontawesome/css/all.css URL the pattern-library pages use.

const config: StorybookConfig = {
  stories: ['../src/components/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [
    {
      from: '../../design-system/src/vendor/fontawesome',
      to: '/vendor/fontawesome',
    },
  ],
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
};

export default config;
