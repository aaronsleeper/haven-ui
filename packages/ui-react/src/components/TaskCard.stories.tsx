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
    iconName: 'psychology',
    href: '/assessment/gad-7',
  },
};

export const Overdue: Story = {
  args: {
    name: 'Weekly mood check-in',
    meta: 'About 1 min',
    iconName: 'mood',
    state: 'overdue',
    href: '#',
  },
};

export const InProgress: Story = {
  args: {
    name: 'Housing and safety questions',
    meta: 'In progress',
    iconName: 'groups',
    avatarColor: 'secondary',
    state: 'in-progress',
    href: '#',
  },
};

export const Completed: Story = {
  args: {
    name: 'How have you been feeling?',
    meta: 'Completed Mar 28',
    iconName: 'psychology',
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
    iconName: 'psychology',
    asComponent: StubLink,
    linkProps: { to: '/assessment/gad-7' },
  },
};
