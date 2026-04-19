import type { Meta, StoryObj } from '@storybook/react';
import { QueueItem } from './QueueItem';

// Canonical visual baseline for `queue-item` in registry.json.
// Mirrors queue-item.html's first variant (urgent + active, Maria Garcia).
// Variant-matrix stories (is-urgent, is-breached, is-attention, is-info)
// are on the roadmap before step-10 visual gate ships.

const meta: Meta<typeof QueueItem> = {
  title: 'UI/QueueItem',
  component: QueueItem,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'pattern-library' },
  },
  decorators: [
    (Story) => (
      <ul className="queue-list max-w-[240px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof QueueItem>;

export const Default: Story = {
  args: {
    urgency: 'urgent',
    active: true,
    name: 'Maria Garcia',
    category: 'Care Plan',
    summary: 'Care plan ready for final approval',
    time: '2h ago',
    sla: {
      status: 'warning',
      text: 'Due in 1h',
      label: 'SLA warning: due in 1 hour',
    },
  },
};
