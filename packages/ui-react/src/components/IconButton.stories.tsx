import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

// Canonical visual baselines for `icon-button` in registry.json.
// Default mirrors btn-icon.html's neutral button exemplar (in-page action).
// Primary mirrors the .btn-icon-primary teal-fill variant. Anchor mirrors the
// header-back-chevron exemplar (anchor variant, common in mobile chrome).
// AsComponent mirrors the router-Link injection pattern used in apps/patient.

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
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

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: 'fa-solid fa-ellipsis-vertical',
    ariaLabel: 'More options',
  },
};

export const Primary: Story = {
  args: {
    icon: 'fa-solid fa-gear',
    ariaLabel: 'Settings',
    variant: 'primary',
  },
};

export const Anchor: Story = {
  args: {
    icon: 'fa-solid fa-chevron-left',
    ariaLabel: 'Previous question',
    href: '/assessment/gad-7/start',
  },
};

const StubLink = ({
  to,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  to?: string;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}) => (
  <a href={to} className={className} aria-label={ariaLabel} data-stub-link>
    {children}
  </a>
);

export const AsComponent: Story = {
  args: {
    icon: 'fa-solid fa-xmark',
    ariaLabel: 'Save and exit',
    asComponent: StubLink,
    linkProps: { to: '/' },
  },
};
