import type { Meta, StoryObj } from '@storybook/react';
import { MealDeliveryCard } from './MealDeliveryCard';

// Canonical visual baselines for `meal-delivery-card` in registry.json. Mirrors
// the four states from layout meal-delivery-card.html: default with tags,
// missing image (placeholder), swapped, and bottom-sheet (no swap button).
// Attribute-tag register applied automatically via the `.meal-delivery-card-tags
// .badge` selector — descriptive metadata reads sentence-case, not uppercase.

const meta: Meta<typeof MealDeliveryCard> = {
  title: 'UI/MealDeliveryCard',
  component: MealDeliveryCard,
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

type Story = StoryObj<typeof MealDeliveryCard>;

export const Default: Story = {
  render: () => (
    <MealDeliveryCard
      name="Grilled chicken with brown rice"
      day="Monday"
      tags={[
        { label: 'Low sodium', variant: 'info' },
        { label: 'Heart-healthy', variant: 'secondary' },
      ]}
      onSwap={() => undefined}
    />
  ),
};

export const NoImage: Story = {
  render: () => (
    <MealDeliveryCard
      name="Lentil soup with vegetables"
      day="Tuesday"
      tags={[{ label: 'Vegetarian', variant: 'info' }]}
      onSwap={() => undefined}
    />
  ),
};

export const Swapped: Story = {
  render: () => (
    <MealDeliveryCard
      name="Salmon with quinoa pilaf"
      day="Wednesday"
      tags={[{ label: 'Heart-healthy', variant: 'secondary' }]}
      isSwapped
    />
  ),
};

export const BottomSheetCandidate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In swap bottom-sheet contexts the card represents a substitute candidate — omit onSwap to hide the swap button.',
      },
    },
  },
  render: () => (
    <MealDeliveryCard
      name="Black beans and brown rice bowl"
      day="Wednesday"
      tags={[
        { label: 'Diabetic-friendly', variant: 'info' },
        { label: 'Vegetarian', variant: 'info' },
      ]}
    />
  ),
};
