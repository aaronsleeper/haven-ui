// Placeholder thread data for the cc-02 thread panel slice.
// Real data wiring lands when a backend contract is defined.

import type { ReactNode } from 'react';
import type {
  ThreadApprovalCardVariant,
  ThreadApprovalEffects,
  ThreadApprovalAttachment,
  ThreadMessageResponseOutcome,
} from '@haven/ui-react';

/** Thread message discriminated union. */
export type ThreadMessage =
  | ThreadMessageSystem
  | ThreadMessageToolCall
  | ThreadMessageHuman
  | ThreadApprovalRequest
  | ThreadApprovalResponseRecord;

interface BaseMessage {
  id: string;
  /** Display timestamp (e.g., '9:02am'). */
  time: string;
}

export interface ThreadMessageSystem extends BaseMessage {
  type: 'system';
  text: string;
}

export interface ThreadMessageToolCall extends BaseMessage {
  type: 'tool-call';
  toolName: string;
  resultSummary: string;
  detail: ReactNode;
}

export interface ThreadMessageHuman extends BaseMessage {
  type: 'human';
  author: string;
  text: string;
}

export interface ThreadApprovalRequest extends BaseMessage {
  type: 'approval-request';
  variant: ThreadApprovalCardVariant;
  icon?: string;
  title: string;
  contextTitle: string;
  contextMeta: string;
  summary?: ReactNode;
  effects?: ThreadApprovalEffects;
  attachment?: ThreadApprovalAttachment;
  /** Action menu shape for this approval. */
  actions: {
    primary: { label: string; intent: 'approve' };
    edit?: { label: string; intent: 'edit' };
    reject?: { label: string; intent: 'reject' };
  };
}

export interface ThreadApprovalResponseRecord extends BaseMessage {
  type: 'approval-response';
  /** Pairs back to the original approval-request message id. */
  approvalRequestId: string;
  outcome: ThreadMessageResponseOutcome;
  /** Pre-rendered toggle text (e.g., "Sarah K. Approved with edits..."). */
  summary: ReactNode;
  /** Optional read-only detail re-expand content. */
  detail?: ReactNode;
}

const mariaThread: ThreadMessage[] = [
  {
    id: 'maria-sys-1',
    type: 'system',
    text: 'Assessment complete. Initiating care plan.',
    time: '9:02am',
  },
  {
    id: 'maria-tool-1',
    type: 'tool-call',
    toolName: '◎ read_patient_assessment',
    resultSummary: '→ { phq9: 7, sdoh: 3 }',
    time: '9:02am',
    detail: (
      <pre className="whitespace-pre-wrap">{`{
  "phq9_score": 7,
  "gad7_score": 4,
  "sdoh_risk": 3,
  "dietary_restrictions": ["tree nuts"],
  "cultural_preferences": ["Latin-inspired"],
  "conditions": ["E11.65 — Type 2 DM"]
}`}</pre>
    ),
  },
  {
    id: 'maria-tool-2',
    type: 'tool-call',
    toolName: '◎ generate_care_plan_draft',
    resultSummary: '→ draft ready, 5 goals',
    time: '9:03am',
    detail: (
      <pre className="whitespace-pre-wrap">{`{
  "goals_count": 5,
  "nutrition_plan": "generated",
  "calories": "1600-1800",
  "sodium": "<1800mg"
}`}</pre>
    ),
  },
  {
    id: 'maria-sys-2',
    type: 'system',
    text: 'Care plan draft sent to RDN queue.',
    time: '9:03am',
  },
  {
    id: 'maria-human-1',
    type: 'human',
    author: 'You',
    text: 'Looks good — please also confirm secondary insurance before I approve.',
    time: '9:18am',
  },
  {
    id: 'maria-tool-3',
    type: 'tool-call',
    toolName: '◎ check_secondary_insurance',
    resultSummary: '→ none on file',
    time: '9:19am',
    detail: <pre className="whitespace-pre-wrap">{`{ "secondary": null }`}</pre>,
  },
  {
    id: 'maria-approval-1',
    type: 'approval-request',
    variant: 'standard',
    title: 'Final Approval — Care Plan v1.0',
    contextTitle: 'Care plan draft · Maria Rivera',
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
    actions: {
      primary: { label: 'Approve', intent: 'approve' },
      edit: { label: 'Edit first', intent: 'edit' },
      reject: { label: 'Reject with note', intent: 'reject' },
    },
    time: '9:20am',
  },
];

const robertThread: ThreadMessage[] = [
  {
    id: 'robert-sys-1',
    type: 'system',
    text: 'Eligibility check initiated.',
    time: '5:00am',
  },
  {
    id: 'robert-tool-1',
    type: 'tool-call',
    toolName: '◎ check_eligibility',
    resultSummary: '→ FAM benefit not covered',
    time: '5:01am',
    detail: (
      <pre className="whitespace-pre-wrap">{`{
  "patient": "Robert Thompson",
  "carrier": "Anthem BCBS",
  "fam_benefit": "not_covered",
  "alt_pathways": ["pmpm_contract"]
}`}</pre>
    ),
  },
  {
    id: 'robert-approval-1',
    type: 'approval-request',
    variant: 'urgent',
    title: 'Eligibility Issue',
    contextTitle: 'Robert Thompson — Anthem BCBS',
    contextMeta: 'FAM benefit not covered under current plan',
    summary: <p>PMPM contract with Anthem may still cover this patient — worth a check.</p>,
    effects: {
      label: 'Pursuing alternative will:',
      items: ['Initiate PMPM eligibility check', 'Notify partner of status change'],
    },
    actions: {
      primary: { label: 'Pursue alternative', intent: 'approve' },
      reject: { label: 'Decline — notify referral source', intent: 'reject' },
    },
    time: '5:02am',
  },
];

const lisaThread: ThreadMessage[] = [
  {
    id: 'lisa-sys-1',
    type: 'system',
    text: 'Referral received from UConn Health.',
    time: '8:15am',
  },
  {
    id: 'lisa-tool-1',
    type: 'tool-call',
    toolName: '◎ extract_referral_packet',
    resultSummary: '→ 2 flagged sections',
    time: '8:15am',
    detail: (
      <pre className="whitespace-pre-wrap">{`{
  "patient": "Lisa Chen",
  "flags": [
    "calorie_target_above_cap",
    "sodium_target_above_cap"
  ]
}`}</pre>
    ),
  },
  {
    id: 'lisa-approval-1',
    type: 'approval-request',
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
    actions: {
      primary: { label: 'Approve', intent: 'approve' },
      edit: { label: 'Edit plan', intent: 'edit' },
      reject: { label: 'Send back for revision', intent: 'reject' },
    },
    time: '8:16am',
  },
];

const davidThread: ThreadMessage[] = [
  {
    id: 'david-sys-1',
    type: 'system',
    text: 'RDN reviewed nutrition section.',
    time: 'Yesterday',
  },
  {
    id: 'david-response-1',
    type: 'approval-response',
    approvalRequestId: 'archived',
    outcome: 'approved',
    summary: (
      <>
        <strong>Dr. Priya M.</strong> Approved · Dr. Priya tightened sodium to 1800mg · Yesterday
      </>
    ),
    time: 'Yesterday',
    detail: (
      <p className="text-xs text-sand-500 px-4 py-2 bg-sand-50 rounded-lg">
        Read-only approval card would render here with the original context, summary, and decision.
      </p>
    ),
  },
];

const patriciaThread: ThreadMessage[] = [
  {
    id: 'patricia-sys-1',
    type: 'system',
    text: 'Patient enrolled successfully.',
    time: '1h ago',
  },
  {
    id: 'patricia-sys-2',
    type: 'system',
    text: 'Welcome message sent.',
    time: '1h ago',
  },
];

const threadByEntryId: Record<string, ThreadMessage[]> = {
  'q-maria-rivera': mariaThread,
  'q-robert-thompson': robertThread,
  'q-lisa-chen': lisaThread,
  'q-david-kim': davidThread,
  'q-patricia-moore': patriciaThread,
};

export function getThreadFor(entryId: string): ThreadMessage[] {
  return threadByEntryId[entryId] ?? [];
}
