import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryAction } from './PrimaryAction';

// Canonical visual baselines for `primary-action` in registry.json.
// Default mirrors primary-action.html's anchor exemplar (href provided —
// navigation use case). Button mirrors the second exemplar (no href — form
// submit or client-side handler). Renders match DESIGN.md §Brand-taste
// "Primary teal fill reserved for commits; Next buttons are secondary."

const meta: Meta<typeof PrimaryAction> = {
  title: 'UI/PrimaryAction',
  component: PrimaryAction,
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

type Story = StoryObj<typeof PrimaryAction>;

export const Default: Story = {
  args: {
    label: 'Continue',
    href: '/assessment/gad-7/question/4',
  },
};

export const Button: Story = {
  args: {
    label: 'Continue',
  },
};

// Block variant — full-width via .btn-block modifier. Mirrors the sticky-footer
// CTA pattern in apps/patient/src/screens/gad-7/question.tsx.
export const Block: Story = {
  args: {
    label: 'Continue',
    block: true,
  },
};

// asComponent variant — renders via a caller-supplied component (router Link
// stand-in here). The design system stays router-agnostic; the caller injects
// the navigation primitive. linkProps is forwarded onto the component.
const StubLink = ({
  to,
  className,
  children,
}: {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <a href={to} className={className} data-stub-link>
    {children}
  </a>
);

export const AsComponent: Story = {
  args: {
    label: 'Continue',
    asComponent: StubLink,
    linkProps: { to: '/assessment/gad-7/question/4' },
  },
};
