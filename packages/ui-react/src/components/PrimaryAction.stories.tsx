import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryAction } from './PrimaryAction';

// Canonical visual baselines for `primary-action` in registry.json.
// Default mirrors primary-action.html's anchor exemplar (href provided —
// navigation use case). Button mirrors the second exemplar (no href — form
// submit or client-side handler). Renders match DESIGN.md §Brand-taste
// "Primary teal fill reserved for commits; Next buttons are secondary."

const meta: Meta<typeof PrimaryAction> = {
  title: 'UI/PrimaryAction',
  component: PrimaryAction,
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

type Story = StoryObj<typeof PrimaryAction>;

export const Default: Story = {
  args: {
    label: 'Continue',
    href: '/assessment/gad-7/question/4',
  },
};

export const Button: Story = {
  args: {
    label: 'Continue',
  },
};
