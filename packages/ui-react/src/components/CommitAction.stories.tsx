import type { Meta, StoryObj } from '@storybook/react';
import { CommitAction } from './CommitAction';

// Canonical visual baselines for `commit-action` in registry.json.
// Submit mirrors commit-action.html's form-submit exemplar. Anchor mirrors the
// navigate-and-commit exemplar. Start mirrors the initiate-flow exemplar.
// All render btn-primary per DESIGN.md §Brand-taste.

const meta: Meta<typeof CommitAction> = {
  title: 'UI/CommitAction',
  component: CommitAction,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-[640px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CommitAction>;

export const Default: Story = {
  args: {
    label: 'Submit',
  },
};

export const Anchor: Story = {
  args: {
    label: 'Submit',
    href: '/assessment/gad-7/complete',
  },
};

export const Start: Story = {
  args: {
    label: 'Start',
    type: 'button',
  },
};

// Block variant — full-width via .btn-block modifier. Mirrors the sticky-footer
// "Start" / "Done" CTAs in apps/patient/src/screens/gad-7/{start,complete}.tsx.
export const Block: Story = {
  args: {
    label: 'Submit',
    block: true,
  },
};

// asComponent variant — renders via a caller-supplied component (router Link
// stand-in here). The design system stays router-agnostic; the caller injects
// the navigation primitive. linkProps is forwarded onto the component.
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
    label: 'Start',
    asComponent: StubLink,
    block: true,
    linkProps: { to: '/assessment/gad-7/question/1' },
  },
};
