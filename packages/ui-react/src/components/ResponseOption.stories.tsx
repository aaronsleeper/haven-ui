import type { Meta, StoryObj } from '@storybook/react';
import { ResponseOption } from './ResponseOption';

// Canonical visual baselines for `response-option` in registry.json.
// Default covers the selected state (aria-checked="true"); Unselected covers
// the unselected state. A disabled exemplar is not yet rendered in
// response-option.html; story parked until the pattern-library HTML adds it.
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

export const Unselected: Story = {
  args: {
    index: 1,
    label: 'Several days',
    checked: false,
  },
};
