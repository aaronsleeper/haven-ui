import type { Preview } from '@storybook/react';

// Load the Haven design-system token cascade (Tailwind 4 @theme + semantic
// component classes) so stories render against the same CSS the pattern-library
// pages use. FontAwesome is served via staticDirs (see main.ts) and linked
// via preview-head.html.
import '@haven/design-system/styles';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'haven-surface',
      values: [
        { name: 'haven-surface', value: '#ffffff' },
        { name: 'pattern-library', value: '#f3f4f6' },
      ],
    },
  },
};

export default preview;
