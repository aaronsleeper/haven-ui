import type { Meta, StoryObj } from '@storybook/react';
import { ThreadMessageSystem } from './ThreadMessageSystem';

// Canonical visual baseline for `thread-msg-system` in registry.json.
// Mirrors the three exemplars in thread-msg-system.html.

const meta: Meta<typeof ThreadMessageSystem> = {
  title: 'Thread/ThreadMessageSystem',
  component: ThreadMessageSystem,
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

type Story = StoryObj<typeof ThreadMessageSystem>;

export const Default: Story = {
  args: {
    text: 'Assessment complete. Initiating care plan.',
    time: '9:02am',
  },
};

export const Drafted: Story = {
  args: {
    text: 'Care plan draft sent to RDN queue.',
    time: '9:03am',
  },
};

export const Reviewed: Story = {
  args: {
    text: 'RDN reviewed nutrition section.',
    time: '9:45am',
  },
};
