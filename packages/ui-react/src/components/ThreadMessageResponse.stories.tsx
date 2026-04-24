import type { Meta, StoryObj } from '@storybook/react';
import { ThreadMessageResponse } from './ThreadMessageResponse';

// Canonical visual baseline for `thread-msg-response` in registry.json.
// Mirrors the two exemplars in thread-msg-response.html.

const meta: Meta<typeof ThreadMessageResponse> = {
  title: 'Thread/ThreadMessageResponse',
  component: ThreadMessageResponse,
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

type Story = StoryObj<typeof ThreadMessageResponse>;

export const Approved: Story = {
  args: {
    outcome: 'approved',
    toggleContent: (
      <>
        <strong>Dr. Priya M.</strong> Approved nutrition plan — sodium target reduced to 1800mg ·
        9:47am
      </>
    ),
    children: (
      <p className="text-xs text-sand-500 px-4 py-2 bg-sand-50 rounded-lg">
        Read-only approval card would render here with the original context, summary, and decision.
      </p>
    ),
  },
};

export const Rejected: Story = {
  args: {
    outcome: 'rejected',
    toggleContent: (
      <>
        <strong>Sarah K.</strong> Rejected — caloric target too aggressive for patient activity
        level · 10:12am
      </>
    ),
    children: (
      <p className="text-xs text-sand-500 px-4 py-2 bg-sand-50 rounded-lg">
        Read-only approval card would render here with rejection note and original context.
      </p>
    ),
  },
};
