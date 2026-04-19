import type { Meta, StoryObj } from '@storybook/react';
import { ResponseOptionGroup } from './ResponseOptionGroup';

// Canonical visual baseline for `response-option-group` in registry.json.
// Mirrors response-option-group.html's first variant — GAD-7 question 1 with
// option 0 ("Not at all") selected. An unanswered variant (selectedIndex
// undefined) is on the roadmap before step-10 visual gate ships.

const meta: Meta<typeof ResponseOptionGroup> = {
  title: 'UI/ResponseOptionGroup',
  component: ResponseOptionGroup,
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

type Story = StoryObj<typeof ResponseOptionGroup>;

export const Default: Story = {
  args: {
    promptId: 'q1-prompt',
    prompt:
      'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    selectedIndex: 0,
    options: [
      { index: 0, label: 'Not at all' },
      { index: 1, label: 'Several days' },
      { index: 2, label: 'More than half the days' },
      { index: 3, label: 'Nearly every day' },
    ],
  },
};
