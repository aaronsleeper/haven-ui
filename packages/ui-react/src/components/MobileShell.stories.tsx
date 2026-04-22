import type { Meta, StoryObj } from '@storybook/react';
import { MobileShell } from './MobileShell';

// Canonical visual baseline for `mobile-shell` in registry.json.
// Mirrors the lone exemplar in layout-mobile-shell.html. The .mobile-app body
// class is applied via useEffect so Storybook preview shows the correct warm
// background behind the shell.

const meta: Meta<typeof MobileShell> = {
  title: 'UI/MobileShell',
  component: MobileShell,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MobileShell>;

export const Default: Story = {
  render: () => (
    <MobileShell>
      <div className="px-4 py-6">
        <p className="text-sm text-gray-500">Mobile shell — max 430px, centered</p>
      </div>
    </MobileShell>
  ),
};
