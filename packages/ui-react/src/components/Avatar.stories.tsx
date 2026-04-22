import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

// Canonical visual baselines for `avatar` in registry.json. Mirrors the
// exemplars in avatar.html: initials / image / icon × size/color variants.

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: {
    children: 'MR',
  },
};

export const IconXL: Story = {
  args: {
    size: 'xl',
    color: 'primary',
    alt: 'Behavioral assessment',
    children: <i className="fa-solid fa-brain avatar-icon" aria-hidden="true" />,
  },
};

export const NeutralSm: Story = {
  args: {
    size: 'sm',
    color: 'neutral',
    children: 'KL',
  },
};
