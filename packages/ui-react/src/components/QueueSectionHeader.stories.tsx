import type { Meta, StoryObj } from '@storybook/react';
import { QueueSectionHeader } from './QueueSectionHeader';

// Canonical visual baselines for `queue-section-header` in registry.json.
// One story per urgency tier mirroring queue-section-header.html (is-urgent,
// is-attention, is-info). This component is exempt from the no-passthrough
// rule — it carries free-form label text via children.

const meta: Meta<typeof QueueSectionHeader> = {
  title: 'UI/QueueSectionHeader',
  component: QueueSectionHeader,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'pattern-library' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[240px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof QueueSectionHeader>;

export const Default: Story = {
  args: {
    tier: 'urgent',
    children: 'Urgent · 2',
  },
};

export const Attention: Story = {
  args: {
    tier: 'attention',
    children: 'Needs Attention · 7',
  },
};

export const Info: Story = {
  args: {
    tier: 'info',
    children: 'Informational · 3',
  },
};
