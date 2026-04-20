import type { Meta, StoryObj } from '@storybook/react';
import { AssessmentHeader } from './AssessmentHeader';

// Canonical visual baselines for `assessment-header` in registry.json.
// One story per exemplar in assessment-header.html:
//   Default — Anxiety check-in, question 3 of 7 (title + progress + meta)
//   Start   — Mood check-in, question 1 of 9 (first question, 9-step scale)
//   NoMeta  — title + progress only; meta line omitted
// Patient-voice titles per plain-language gate (Patch 9, 2026-04-20):
// "[topic] check-in" parallel-structure across assessment family.

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
    title: 'Anxiety check-in',
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

export const Start: Story = {
  args: {
    title: 'Mood check-in',
    meta: 'Question 1 of 9',
    progress: {
      ariaLabel: 'Assessment progress: question 1 of 9',
      steps: [
        { status: 'in-progress', label: 'Question 1 — in progress' },
        { status: 'not-started', label: 'Question 2 — not started' },
        { status: 'not-started', label: 'Question 3 — not started' },
        { status: 'not-started', label: 'Question 4 — not started' },
        { status: 'not-started', label: 'Question 5 — not started' },
        { status: 'not-started', label: 'Question 6 — not started' },
        { status: 'not-started', label: 'Question 7 — not started' },
        { status: 'not-started', label: 'Question 8 — not started' },
        { status: 'not-started', label: 'Question 9 — not started' },
      ],
    },
  },
};

export const NoMeta: Story = {
  args: {
    title: 'Weekly check-in',
    progress: {
      ariaLabel: 'Assessment progress: question 2 of 3',
      steps: [
        { status: 'complete', label: 'Question 1 — complete' },
        { status: 'in-progress', label: 'Question 2 — in progress' },
        { status: 'not-started', label: 'Question 3 — not started' },
      ],
    },
  },
};
