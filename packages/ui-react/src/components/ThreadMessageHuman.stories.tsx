import type { Meta, StoryObj } from '@storybook/react';
import { ThreadMessageHuman } from './ThreadMessageHuman';

// Canonical visual baseline for `thread-msg-human` in registry.json.
// Mirrors the two exemplars in thread-msg-human.html.

const meta: Meta<typeof ThreadMessageHuman> = {
  title: 'Thread/ThreadMessageHuman',
  component: ThreadMessageHuman,
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

type Story = StoryObj<typeof ThreadMessageHuman>;

export const Default: Story = {
  args: {
    author: 'You',
    children: 'Check if this patient has secondary insurance',
    time: '9:15am',
  },
};

export const Followup: Story = {
  args: {
    author: 'You',
    children:
      'Looks good — please also check if the referral order is on file before I approve.',
    time: '9:18am',
  },
};
