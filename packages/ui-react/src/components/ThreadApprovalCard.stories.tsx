import type { Meta, StoryObj } from '@storybook/react';
import { ThreadApprovalCard } from './ThreadApprovalCard';

// Canonical visual baselines for `thread-approval-card` in registry.json.
// Mirrors the four exemplars in thread-approval-card.html post-iterate
// (Standard, RejectIntent, Urgent, Warning, Historical). Reassign is dropped
// from Standard per IA review (wireframe flagged it as future feature).
// Voice rewrites applied per brand-fidelity review on Urgent + Historical.

const meta: Meta<typeof ThreadApprovalCard> = {
  title: 'Thread/ThreadApprovalCard',
  component: ThreadApprovalCard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[380px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ThreadApprovalCard>;

export const Standard: Story = {
  args: {
    title: 'Final Approval — Care Plan v1.0',
    contextTitle: 'Care plan draft · Maria Garcia',
    contextMeta: 'All clinical sections approved · 3 min ago',
    summary: (
      <>
        <p className="text-xs font-medium text-sand-500">Goals (2)</p>
        <ul>
          <li>HbA1c &lt; 8.0% within 6 months</li>
          <li>Weight loss 5–8% within 6 months</li>
        </ul>
        <p className="text-xs mt-2">
          1800 cal/day · &lt;1800mg sodium · Diabetic-appropriate · Nut-free
        </p>
      </>
    ),
    effects: {
      label: 'Approving will:',
      items: [
        'Set patient status to active',
        'Start meal prescription matching',
        'Schedule first RDN visit',
        'Begin AVA check-in calls',
        'Notify patient — welcome message',
      ],
    },
    attachment: {
      label: '1 document — not viewed',
      viewLabel: 'View',
      viewHref: '#',
      viewed: false,
    },
    actions: (
      <>
        <button type="button" className="btn-primary btn-sm">Approve</button>
        <button type="button" className="btn-outline btn-sm">Edit first</button>
        <button type="button" className="btn-outline btn-sm">Reject with note</button>
      </>
    ),
  },
};

export const RejectIntent: Story = {
  args: {
    title: 'Final Approval — Care Plan v1.0',
    contextTitle: 'Care plan draft · Maria Garcia',
    contextMeta: 'All clinical sections approved · 3 min ago',
    summary: <p>Approving will commit the agent's draft. Rejecting requires a note.</p>,
    attachment: {
      label: '1 attachment',
      viewLabel: 'View',
      viewHref: '#',
      viewed: true,
    },
    actions: (
      <>
        <button type="button" className="btn-primary btn-sm">Approve</button>
        <button type="button" className="btn-outline btn-sm">Edit first</button>
        <button type="button" className="btn-outline btn-sm">Confirm rejection</button>
      </>
    ),
    noteMode: 'required',
    noteLabel: 'Rejection note (required)',
    notePlaceholder: 'Why is this being rejected?',
  },
};

export const Urgent: Story = {
  args: {
    variant: 'urgent',
    title: 'Eligibility Issue',
    contextTitle: 'Robert Thompson — Anthem BCBS',
    contextMeta: 'FAM benefit not covered under current plan',
    summary: <p>PMPM contract with Anthem may still cover this patient — worth a check.</p>,
    effects: {
      label: 'Pursuing alternative will:',
      items: ['Initiate PMPM eligibility check', 'Notify partner of status change'],
    },
    actions: (
      <>
        <button type="button" className="btn-primary btn-sm">Pursue alternative</button>
        <button type="button" className="btn-outline btn-sm">Decline — notify referral source</button>
        <button type="button" className="btn-outline btn-sm">Hold — need more info</button>
      </>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Review Recommended',
    contextTitle: 'Lisa Chen — UConn Health referral',
    contextMeta: 'Two flagged sections need clinical sign-off',
    summary: (
      <p>
        Two items in the proposed plan exceed the standard nutritional cap. Review before approving.
      </p>
    ),
    effects: {
      label: 'Approving will:',
      items: ['Send to RDN review queue', 'Notify referring provider'],
    },
    actions: (
      <>
        <button type="button" className="btn-primary btn-sm">Approve</button>
        <button type="button" className="btn-outline btn-sm">Edit plan</button>
        <button type="button" className="btn-outline btn-sm">Send back for revision</button>
      </>
    ),
    noteMode: 'required',
    noteLabel: 'Approval note (required for warning approvals)',
    notePlaceholder: 'Note your review reasoning',
  },
};

export const Historical: Story = {
  args: {
    variant: 'historical',
    title: 'RDN Review — Nutrition Plan',
    contextTitle: 'Nutrition plan · Maria Garcia',
    contextMeta: 'Reviewed by Dr. Priya M. · Mar 26',
    summary: <p>Approved · Dr. Priya tightened sodium to 1800mg.</p>,
  },
};
