import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBarPagination } from './ProgressBarPagination';

// Canonical visual baselines for `progress-bar-pagination` in registry.json.
// One story per exemplar in progress-bar-pagination.html:
//   Default — mid state (GAD-7 question 4 of 7)
//   Start   — first question, none filled (GAD-7 question 1 of 7)
//   End     — final question, all prior filled (GAD-7 question 7 of 7)
//   Phq2    — shorter-scale variant (PHQ-2 question 1 of 2)

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

export const Start: Story = {
  args: {
    ariaLabel: 'Assessment progress: question 1 of 7',
    steps: [
      { status: 'in-progress', label: 'Question 1 — in progress' },
      { status: 'not-started', label: 'Question 2 — not started' },
      { status: 'not-started', label: 'Question 3 — not started' },
      { status: 'not-started', label: 'Question 4 — not started' },
      { status: 'not-started', label: 'Question 5 — not started' },
      { status: 'not-started', label: 'Question 6 — not started' },
      { status: 'not-started', label: 'Question 7 — not started' },
    ],
  },
};

export const End: Story = {
  args: {
    ariaLabel: 'Assessment progress: question 7 of 7',
    steps: [
      { status: 'complete', label: 'Question 1 — complete' },
      { status: 'complete', label: 'Question 2 — complete' },
      { status: 'complete', label: 'Question 3 — complete' },
      { status: 'complete', label: 'Question 4 — complete' },
      { status: 'complete', label: 'Question 5 — complete' },
      { status: 'complete', label: 'Question 6 — complete' },
      { status: 'in-progress', label: 'Question 7 — in progress' },
    ],
  },
};

export const Phq2: Story = {
  args: {
    ariaLabel: 'Assessment progress: question 1 of 2',
    steps: [
      { status: 'in-progress', label: 'Question 1 — in progress' },
      { status: 'not-started', label: 'Question 2 — not started' },
    ],
  },
};
