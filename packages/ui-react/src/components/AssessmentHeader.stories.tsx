import type { Meta, StoryObj } from '@storybook/react';
import { AssessmentHeader } from './AssessmentHeader';

// Canonical visual baseline for `assessment-header` in registry.json.
// Mirrors assessment-header.html's first variant — GAD-7, question 3 of 7.
// Start-state, PHQ-9, and no-meta variants are on the roadmap before the
// step-10 visual gate ships.

const meta: Meta<typeof AssessmentHeader> = {
  title: 'UI/AssessmentHeader',
  component: AssessmentHeader,
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

type Story = StoryObj<typeof AssessmentHeader>;

export const Default: Story = {
  args: {
    title: 'GAD-7',
    meta: 'Question 3 of 7',
    progress: {
      ariaLabel: 'Assessment progress: question 3 of 7',
      steps: [
        { status: 'complete', label: 'Question 1 — complete' },
        { status: 'complete', label: 'Question 2 — complete' },
        { status: 'in-progress', label: 'Question 3 — in progress' },
        { status: 'not-started', label: 'Question 4 — not started' },
        { status: 'not-started', label: 'Question 5 — not started' },
        { status: 'not-started', label: 'Question 6 — not started' },
        { status: 'not-started', label: 'Question 7 — not started' },
      ],
    },
  },
};
