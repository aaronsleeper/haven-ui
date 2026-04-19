import type { Meta, StoryObj } from '@storybook/react';
import { ResponseOption } from './ResponseOption';

// Canonical visual baseline for `response-option` in registry.json.
// Mirrors response-option.html's "Selected" variant (index 0, "Not at all",
// aria-checked="true"). Unselected and disabled variants are on the roadmap
// before step-10 visual gate ships.
//
// In production this component renders inside a ResponseOptionGroup, which
// owns roving tabindex and keyboard nav. Rendered standalone here to isolate
// the visual baseline.

const meta: Meta<typeof ResponseOption> = {
  title: 'UI/ResponseOption',
  component: ResponseOption,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-[325px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ResponseOption>;

export const Default: Story = {
  args: {
    index: 0,
    label: 'Not at all',
    checked: true,
  },
};
