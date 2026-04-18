// Placeholder queue data for the first vertical slice.
// Real data wiring lands when a backend contract is defined.

import type { QueueItemProps } from '@haven/ui-react';

export type QueueEntry = Omit<QueueItemProps, 'className' | 'active' | 'onClick'> & {
  id: string;
};

export const urgent: QueueEntry[] = [
  {
    id: 'q-maria-garcia',
    urgency: 'urgent',
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
  {
    id: 'q-robert-thompson',
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
];

export const attention: QueueEntry[] = [
  {
    id: 'q-lisa-chen',
    urgency: 'attention',
    name: 'Lisa Chen',
    category: 'Referral',
    summary: 'New referral from UConn Health',
    time: '45m ago',
  },
  {
    id: 'q-david-kim',
    urgency: 'attention',
    name: 'David Kim',
    category: 'Clinical',
    summary: 'RDN note awaiting review',
    time: '1h ago',
  },
];

export const info: QueueEntry[] = [
  {
    id: 'q-patricia-moore',
    urgency: 'info',
    name: 'Patricia Moore',
    category: 'Enrolled',
    summary: 'Enrolled successfully',
    time: '1h ago',
  },
];
