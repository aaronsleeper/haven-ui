import type { Meta, StoryObj } from '@storybook/react';
import { ThreadMessageToolCall } from './ThreadMessageToolCall';

// Canonical visual baseline for `thread-msg-tool-call` in registry.json.
// Mirrors the two exemplars in thread-msg-tool-call.html.

const meta: Meta<typeof ThreadMessageToolCall> = {
  title: 'Thread/ThreadMessageToolCall',
  component: ThreadMessageToolCall,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[380px] bg-white border border-sand-200 rounded-lg py-2">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ThreadMessageToolCall>;

export const Default: Story = {
  args: {
    toolName: '◎ read_patient_assessment',
    resultSummary: '→ { phq9: 7, sdoh: 3 }',
    time: '9:02am',
    children: (
      <pre className="whitespace-pre-wrap">{`{
  "phq9_score": 7,
  "gad7_score": 4,
  "sdoh_risk": 3,
  "dietary_restrictions": ["tree nuts"],
  "cultural_preferences": ["Latin-inspired"],
  "conditions": ["E11.65 — Type 2 DM"]
}`}</pre>
    ),
  },
};

export const Generated: Story = {
  args: {
    toolName: '◎ generate_care_plan_draft',
    resultSummary: '→ draft ready, 5 goals',
    time: '9:03am',
    children: (
      <pre className="whitespace-pre-wrap">{`{
  "goals_count": 5,
  "nutrition_plan": "generated",
  "calories": "1600-1800",
  "sodium": "<1800mg"
}`}</pre>
    ),
  },
};

export const Expanded: Story = {
  args: {
    toolName: '◎ read_patient_assessment',
    resultSummary: '→ { phq9: 7, sdoh: 3 }',
    time: '9:02am',
    defaultExpanded: true,
    children: (
      <pre className="whitespace-pre-wrap">{`{ "phq9_score": 7, "gad7_score": 4 }`}</pre>
    ),
  },
};
