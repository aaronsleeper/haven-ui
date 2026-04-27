import type { Meta, StoryObj } from '@storybook/react';
import { RecordHeader } from './RecordHeader';

// Canonical visual baselines for `record-header` in registry.json.
// Mirrors the three exemplars in layout-record-header.html: referral context
// (patient identity + status), care-plan context (plan version + patient
// subtitle), and diff context (version range badge, no meta line).

const meta: Meta<typeof RecordHeader> = {
  title: 'UI/RecordHeader',
  component: RecordHeader,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof RecordHeader>;

export const Referral: Story = {
  render: () => (
    <RecordHeader
      title="Maria Garcia"
      subtitle="62, F · DOB Mar 15, 1964"
      trailing={<span className="badge badge-success">Eligible</span>}
      meta="via UConn Health · FHIR"
    />
  ),
};

export const CarePlan: Story = {
  render: () => (
    <RecordHeader
      title="Care Plan v1.0"
      subtitle="Maria Garcia"
      trailing={<span className="badge badge-warning">Coordinator Review</span>}
      meta="Created Mar 26, 2026"
    />
  ),
};

export const Diff: Story = {
  render: () => (
    <RecordHeader
      title="Care Plan Update"
      subtitle="Maria Garcia"
      trailing={<span className="badge badge-sm badge-neutral">v1.0 → v1.1</span>}
    />
  ),
};
