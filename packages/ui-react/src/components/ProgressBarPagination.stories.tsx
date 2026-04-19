import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBarPagination } from './ProgressBarPagination';

// Canonical visual baseline for `progress-bar-pagination` in registry.json.
// Mirrors progress-bar-pagination.html's "mid" variant — GAD-7 question 4 of 7
// (3 complete, 1 in-progress, 3 not-started). Start, end, and shorter-scale
// (PHQ-2) variants are on the roadmap before step-10 visual gate ships.

const meta: Meta<typeof ProgressBarPagination> = {
  title: 'UI/ProgressBarPagination',
  component: ProgressBarPagination,
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

type Story = StoryObj<typeof ProgressBarPagination>;

export const Default: Story = {
  args: {
    ariaLabel: 'Assessment progress: question 4 of 7',
    steps: [
      { status: 'complete', label: 'Question 1 — complete' },
      { status: 'complete', label: 'Question 2 — complete' },
      { status: 'complete', label: 'Question 3 — complete' },
      { status: 'in-progress', label: 'Question 4 — in progress' },
      { status: 'not-started', label: 'Question 5 — not started' },
      { status: 'not-started', label: 'Question 6 — not started' },
      { status: 'not-started', label: 'Question 7 — not started' },
    ],
  },
};
