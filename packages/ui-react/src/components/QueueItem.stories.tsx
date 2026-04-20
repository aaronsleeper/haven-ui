import type { Meta, StoryObj } from '@storybook/react';
import { QueueItem } from './QueueItem';

// Canonical visual baselines for `queue-item` in registry.json.
// Each story mirrors one exemplar from queue-item.html — Default covers the
// urgent+active+warning-SLA tier (Maria Garcia); Urgent covers the
// urgent+breached-SLA tier (Robert Thompson); Attention and Info cover the
// lower two tiers (Lisa Chen, Patricia Moore).

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

export const Urgent: Story = {
  args: {
    urgency: 'urgent',
    name: 'Robert Thompson',
    category: 'Eligibility',
    summary: 'Eligibility failed — alternative path available',
    time: '4h ago',
    sla: {
      status: 'breached',
      text: '2h overdue',
      label: 'SLA breached: 2 hours overdue',
    },
  },
};

export const Attention: Story = {
  args: {
    urgency: 'attention',
    name: 'Lisa Chen',
    category: 'Referral',
    summary: 'New referral from UConn Health',
    time: '45m ago',
  },
};

export const Info: Story = {
  args: {
    urgency: 'info',
    name: 'Patricia Moore',
    category: 'Enrolled',
    summary: 'Enrolled successfully',
    time: '1h ago',
  },
};
