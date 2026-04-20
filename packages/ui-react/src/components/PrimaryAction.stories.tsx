import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryAction } from './PrimaryAction';

// Canonical visual baseline for `primary-action` in registry.json.
// Mirrors primary-action.html's anchor variant (most common on multi-step
// assessment flows). Button-variant (no href) story deferred to the variant
// matrix roadmap item before the step-10 visual gate ships.

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
