import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from './Sparkline';

// Visual baselines for the Sparkline chart wrapper. Mirrors the
// chart-sparkline pattern in @haven/design-system (canvas inside
// chart-canvas-wrapper, smooth fill-line, no axes). Trend color is
// passed by the consumer per HAVEN palette — TREND_COLOR_MAP in
// apps/patient/src/screens/health drives the route-bound mapping.

const meta: Meta<typeof Sparkline> = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sparkline>;

const SIX_WEEK_TREND = [142, 138, 145, 141, 139, 134];

export const TrendDown: Story = {
  render: () => (
    <Sparkline
      data={SIX_WEEK_TREND}
      color="hsla(160, 28%, 36%, 1)"
      ariaLabel="Blood pressure trending down over the past 6 weeks"
    />
  ),
};

export const TrendUp: Story = {
  render: () => (
    <Sparkline
      data={[7.2, 7.1, 6.9, 6.8, 6.5, 6.3]}
      color="hsla(160, 28%, 36%, 1)"
      ariaLabel="A1C trending down over the past 6 weeks"
    />
  ),
};

export const Flat: Story = {
  render: () => (
    <Sparkline
      data={[120, 121, 119, 122, 120, 121]}
      color="hsla(36, 14%, 50%, 1)"
      ariaLabel="Weight stable over the past 6 weeks"
    />
  ),
};
