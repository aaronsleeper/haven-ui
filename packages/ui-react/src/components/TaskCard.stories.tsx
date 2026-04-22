import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './TaskCard';

// Canonical visual baselines for `patient-task-card` in registry.json.
// Default mirrors the assess-intake "Anxiety check-in" exemplar in
// patient-task-card.html. Overdue mirrors the warning-border + badge variant.
// InProgress mirrors the teal-border + teal-meta variant. Completed mirrors
// the muted check-icon variant. AsComponent mirrors the router-Link injection
// pattern used by the patient app's Landing screen.

const meta: Meta<typeof TaskCard> = {
  title: 'UI/TaskCard',
  component: TaskCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-[430px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    name: 'How have you been feeling?',
    meta: 'About 2 min',
    iconClass: 'fa-solid fa-brain',
    href: '/assessment/gad-7',
  },
};

export const Overdue: Story = {
  args: {
    name: 'Weekly mood check-in',
    meta: 'About 1 min',
    iconClass: 'fa-solid fa-face-smile',
    state: 'overdue',
    href: '#',
  },
};

export const InProgress: Story = {
  args: {
    name: 'Housing and safety questions',
    meta: 'In progress',
    iconClass: 'fa-solid fa-people-group',
    avatarColor: 'secondary',
    state: 'in-progress',
    href: '#',
  },
};

export const Completed: Story = {
  args: {
    name: 'How have you been feeling?',
    meta: 'Completed Mar 28',
    iconClass: 'fa-solid fa-brain',
    state: 'completed',
  },
};

const StubLink = ({
  to,
  className,
  children,
}: {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <a href={to} className={className} data-stub-link>
    {children}
  </a>
);

export const AsComponent: Story = {
  args: {
    name: 'Anxiety check-in',
    meta: '7 questions · about 2 minutes',
    iconClass: 'fa-solid fa-brain',
    asComponent: StubLink,
    linkProps: { to: '/assessment/gad-7' },
  },
};
