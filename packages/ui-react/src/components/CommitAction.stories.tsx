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
