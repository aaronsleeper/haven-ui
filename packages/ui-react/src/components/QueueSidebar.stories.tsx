import type { Meta, StoryObj } from '@storybook/react';
import { QueueSidebar } from './QueueSidebar';
import logoSrc from '../assets/logo-cenahealth-teal.svg';

// Canonical visual baseline for `queue-sidebar` in registry.json.
// Mirrors queue-sidebar.html byte-for-byte: 3 urgency-tiered sections
// (urgent · 2, attention · 2, info · 1) with the canonical roster.

const meta: Meta<typeof QueueSidebar> = {
  title: 'UI/QueueSidebar',
  component: QueueSidebar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'pattern-library' },
  },
};
export default meta;

type Story = StoryObj<typeof QueueSidebar>;

export const Default: Story = {
  args: {
    brand: {
      logoSrc,
      logoAlt: 'Cena Health',
    },
    sections: [
      {
        header: { urgency: 'urgent', label: 'Urgent' },
        items: [
          {
            urgency: 'urgent',
            active: true,
            name: 'Maria Rivera',
            category: 'Care Plan',
            summary: 'Care plan ready for final approval',
            time: '2h ago',
            sla: {
              status: 'warning',
              text: 'Due in 1h',
              label: 'SLA warning: due in 1 hour',
            },
          },
          {
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
        ],
      },
      {
        header: { urgency: 'attention', label: 'Needs Attention' },
        items: [
          {
            urgency: 'attention',
            name: 'Lisa Chen',
            category: 'Referral',
            summary: 'New referral from UConn Health',
            time: '45m ago',
          },
          {
            urgency: 'attention',
            name: 'David Kim',
            category: 'Clinical',
            summary: 'RDN note awaiting review',
            time: '1h ago',
          },
        ],
      },
      {
        header: { urgency: 'info', label: 'Informational' },
        items: [
          {
            urgency: 'info',
            name: 'Patricia Moore',
            category: 'Enrolled',
            summary: 'Enrolled successfully',
            time: '1h ago',
          },
        ],
      },
    ],
  },
};
