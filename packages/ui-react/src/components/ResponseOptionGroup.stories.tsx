import type { Meta, StoryObj } from '@storybook/react';
import { ResponseOptionGroup } from './ResponseOptionGroup';

// Canonical visual baselines for `response-option-group` in registry.json.
// Default mirrors response-option-group.html's answered exemplar (GAD-7 Q1
// with option 0 "Not at all" selected). Unanswered mirrors the second
// exemplar (selectedIndex undefined — nothing selected).

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

export const Unanswered: Story = {
  args: {
    promptId: 'q2-prompt',
    prompt:
      'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
    options: [
      { index: 0, label: 'Not at all' },
      { index: 1, label: 'Several days' },
      { index: 2, label: 'More than half the days' },
      { index: 3, label: 'Nearly every day' },
    ],
  },
};
