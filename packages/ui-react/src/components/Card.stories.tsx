import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter } from './Card';

// Canonical visual baselines for `card` in registry.json. Mirrors the four
// exemplars in layout-card.html: basic body-only, header + body, header +
// body + footer with actions, title-in-body.

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-[420px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardBody>
        <p className="text-gray-500 dark:text-neutral-400">
          Basic card with body content only. Use for simple content blocks.
        </p>
      </CardBody>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Summary</CardTitle>
        <CardSubtitle>Last updated Feb 2026</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p className="text-gray-500 dark:text-neutral-400">Card body content goes here.</p>
      </CardBody>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Edit Patient</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-gray-500 dark:text-neutral-400">Form fields or content here.</p>
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <button type="button" className="btn-outline btn-sm">Cancel</button>
        <button type="button" className="btn-primary btn-sm">Save</button>
      </CardFooter>
    </Card>
  ),
};
