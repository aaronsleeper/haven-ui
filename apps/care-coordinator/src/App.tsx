import { useMemo, useRef, useState } from 'react';
import { AgenticShell, QueueItem } from '@haven/ui-react';
import type {
  QueueItemProps,
  QueueItemUrgency,
} from '@haven/ui-react';
import logoSrc from '@haven/ui-react/assets/logo-cenahealth-teal.svg';
import { urgent, attention, info } from './data/queue';
import type { QueueEntry } from './data/queue';
import { getThreadFor } from './data/threads';
import type {
  ThreadApprovalRequest,
  ThreadApprovalResponseRecord,
  ThreadMessage,
} from './data/threads';
import { ThreadMessageList } from './components/thread/ThreadMessageList';
import { ThreadInput } from './components/thread/ThreadInput';
import { ThreadUndoBar } from './components/thread/ThreadUndoBar';
import { CarePlanViewer } from './components/care-plan/CarePlanViewer';
import {
  getCarePlanForPatient,
  getPatientForEntry,
} from './data/care-plans';
import type { CarePlan, MealDeliverySection } from './data/care-plans';

interface UndoState {
  /** Entry id whose thread the toast belongs to. */
  entryId: string;
  /** Original messages before the optimistic mutation. */
  previousMessages: ThreadMessage[];
  /** Verb past-tense for display (e.g., "Approved"). */
  message: string;
  /** When the undo restored a care-plan commit, this carries the
   *  previously-committed plan (or undefined if there was no committed
   *  override before the edit). Patient id keys the slice. */
  previousCommittedPlan?: { patientId: string; plan: CarePlan | undefined };
}

function stringifyValue(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return '';
}

function computeMealDeliveryDiff(original: CarePlan, edited: CarePlan): string[] {
  const findMD = (plan: CarePlan): MealDeliverySection | undefined =>
    plan.sections.find(
      (s): s is MealDeliverySection => s.type === 'meal-delivery',
    );
  const orig = findMD(original);
  const next = findMD(edited);
  if (!orig || !next) return [];
  const lines: string[] = [];
  for (let i = 0; i < orig.rows.length; i++) {
    const oRow = orig.rows[i];
    const eRow = next.rows[i];
    if (!oRow || !eRow) continue;
    const o = stringifyValue(oRow.value);
    const e = stringifyValue(eRow.value);
    if (o !== e) lines.push(`${oRow.label}: ${o} → ${e}`);
  }
  return lines;
}

function makeApprovalResponse(
  request: ThreadApprovalRequest,
  outcome: 'approved' | 'rejected',
  note?: string,
  editsSummary?: string,
): ThreadApprovalResponseRecord {
  const verb =
    outcome === 'rejected'
      ? 'Rejected'
      : editsSummary
        ? 'Approved with edits'
        : 'Approved';
  const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return {
    id: `${request.id}-response`,
    type: 'approval-response',
    approvalRequestId: request.id,
    outcome,
    summary: (
      <>
        <strong>You</strong> {verb}
        {editsSummary ? ` — ${editsSummary}` : ''}
        {note ? ` — ${note}` : ''} · {time}
      </>
    ),
    time,
    detail: (
      <p className="text-xs text-sand-500 px-4 py-2 bg-sand-50 rounded-lg">
        {verb} just now. (Read-only re-expand of the original card would render here.)
      </p>
    ),
  };
}

export function App() {
  const [activeId, setActiveId] = useState<string>();
  const [threadOverrides, setThreadOverrides] = useState<Record<string, ThreadMessage[]>>({});
  const [rejectIntentByEntry, setRejectIntentByEntry] = useState<Record<string, string | undefined>>({});
  const [noteByEntry, setNoteByEntry] = useState<Record<string, string>>({});
  const [noteInvalid, setNoteInvalid] = useState(false);
  const [undo, setUndo] = useState<UndoState | undefined>();
  // Center-pane mode per entry. 'edit' is set when the coordinator clicks
  // "Edit first" on an approval card; commit-with-edits or selecting another
  // entry resets to 'view'.
  const [centerPaneModeByEntry, setCenterPaneModeByEntry] = useState<Record<string, 'view' | 'edit'>>({});
  // Two-slice care-plan override state, keyed by patientId per Frontend
  // Architecture verdict (queue entries are transient; patients outlive
  // queue trips).
  // - committedPlanOverrides: survives entry-switch; represents the plan
  //   the coordinator has formally committed via Approve-with-edits.
  // - inflightCarePlanEdits: only exists during 'edit' mode; cleared on
  //   commit OR entry-switch-while-editing. Render precedence:
  //   inflight > committed > original-fixture.
  const [committedPlanOverrides, setCommittedPlanOverrides] = useState<Record<string, CarePlan>>({});
  const [inflightCarePlanEdits, setInflightCarePlanEdits] = useState<Record<string, CarePlan>>({});
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const activeEntry = useMemo(() => {
    const all = [...urgent, ...attention, ...info];
    return all.find((entry) => entry.id === activeId);
  }, [activeId]);

  const messages: ThreadMessage[] = useMemo(() => {
    if (!activeEntry) return [];
    return threadOverrides[activeEntry.id] ?? getThreadFor(activeEntry.id);
  }, [activeEntry, threadOverrides]);

  const activePatient = activeEntry ? getPatientForEntry(activeEntry.id) : undefined;
  const originalCarePlan = activePatient ? getCarePlanForPatient(activePatient.id) : undefined;
  const committedPlan = activePatient ? committedPlanOverrides[activePatient.id] : undefined;
  const inflightPlan = activePatient ? inflightCarePlanEdits[activePatient.id] : undefined;
  // Render precedence: inflight (if editing) > committed > original.
  const activeCarePlan = inflightPlan ?? committedPlan ?? originalCarePlan;
  const centerPaneMode: 'view' | 'edit' = activeEntry
    ? (centerPaneModeByEntry[activeEntry.id] ?? 'view')
    : 'view';

  const rejectIntentId = activeEntry ? rejectIntentByEntry[activeEntry.id] : undefined;
  // Mark which approval-request card is currently in edit mode so
  // ThreadMessageList can relabel its primary button to "Approve with edits".
  const editIntentId =
    centerPaneMode === 'edit'
      ? messages.find((m) => m.type === 'approval-request')?.id
      : undefined;
  const noteValue = activeEntry ? (noteByEntry[activeEntry.id] ?? '') : '';

  const writeMessages = (entryId: string, next: ThreadMessage[]) => {
    setThreadOverrides((prev) => ({ ...prev, [entryId]: next }));
  };

  const handleAction = (
    messageId: string,
    intent: 'approve' | 'edit' | 'reject',
  ) => {
    if (!activeEntry) return;
    const entryId = activeEntry.id;
    const request = messages.find(
      (m): m is ThreadApprovalRequest =>
        m.type === 'approval-request' && m.id === messageId,
    );
    if (!request) return;

    if (intent === 'edit') {
      setCenterPaneModeByEntry((prev) => ({ ...prev, [entryId]: 'edit' }));
      return;
    }

    if (intent === 'reject') {
      const isAlreadyRejecting = rejectIntentId === messageId;
      if (!isAlreadyRejecting) {
        setRejectIntentByEntry((prev) => ({ ...prev, [entryId]: messageId }));
        setNoteInvalid(false);
        // Move focus to the textarea on next render.
        setTimeout(() => noteRef.current?.focus(), 0);
        return;
      }
      // Confirm-rejection flow.
      const note = (noteByEntry[entryId] ?? '').trim();
      if (!note) {
        setNoteInvalid(true);
        noteRef.current?.focus();
        return;
      }
      const previousMessages = messages;
      const next = messages.map((m) =>
        m.id === messageId ? makeApprovalResponse(request, 'rejected', note) : m,
      );
      writeMessages(entryId, next);
      setRejectIntentByEntry((prev) => ({ ...prev, [entryId]: undefined }));
      setNoteByEntry((prev) => ({ ...prev, [entryId]: '' }));
      setNoteInvalid(false);
      // Rejections do not get an undo per the wireframe; show a brief
      // confirmation but no Undo action.
      setUndo({
        entryId,
        previousMessages,
        message: 'Rejected.',
      });
      return;
    }

    // intent === 'approve'
    // Warning variant requires a note before approving.
    if (request.variant === 'warning') {
      const note = (noteByEntry[entryId] ?? '').trim();
      if (!note) {
        setNoteInvalid(true);
        noteRef.current?.focus();
        return;
      }
    }
    const previousMessages = messages;
    const note = (noteByEntry[entryId] ?? '').trim();

    // Edit-mode approve: diff inflight against committed-or-original; if
    // anything changed, promote inflight → committed and fold the diff into
    // the response message. If nothing changed, just exit edit mode.
    let editsSummary: string | undefined;
    let previousCommittedPlan: { patientId: string; plan: CarePlan | undefined } | undefined;
    const isEditApprove = centerPaneMode === 'edit' && activePatient && inflightPlan;
    if (isEditApprove) {
      const baseline = committedPlan ?? originalCarePlan;
      if (baseline) {
        const diffLines = computeMealDeliveryDiff(baseline, inflightPlan);
        editsSummary = diffLines.length > 0 ? diffLines.join(', ') : undefined;
      }
      previousCommittedPlan = { patientId: activePatient.id, plan: committedPlan };
    }

    const next = messages.map((m) =>
      m.id === messageId
        ? makeApprovalResponse(request, 'approved', note || undefined, editsSummary)
        : m,
    );
    writeMessages(entryId, next);
    if (isEditApprove && activePatient) {
      // Promote inflight to committed (only if there was a real diff;
      // otherwise leave committed as-is and just discard the inflight).
      if (editsSummary) {
        setCommittedPlanOverrides((prev) => ({ ...prev, [activePatient.id]: inflightPlan }));
      }
      setInflightCarePlanEdits((prev) => {
        const { [activePatient.id]: _, ...rest } = prev;
        return rest;
      });
      setCenterPaneModeByEntry((prev) => ({ ...prev, [entryId]: 'view' }));
    }
    setNoteByEntry((prev) => ({ ...prev, [entryId]: '' }));
    setNoteInvalid(false);
    const undoMessage = editsSummary
      ? `Approved with edits — ${editsSummary}.`
      : 'Approved.';
    setUndo({
      entryId,
      previousMessages,
      message: undoMessage,
      previousCommittedPlan,
    });
  };

  const handleUndoAction = () => {
    if (!undo) return;
    writeMessages(undo.entryId, undo.previousMessages);
    // If the approve also committed a care-plan edit, revert that commit
    // to whatever was committed before (or remove the entry entirely).
    if (undo.previousCommittedPlan) {
      const { patientId, plan } = undo.previousCommittedPlan;
      setCommittedPlanOverrides((prev) => {
        const { [patientId]: _, ...rest } = prev;
        return plan ? { ...rest, [patientId]: plan } : rest;
      });
    }
    setUndo(undefined);
  };

  const handleUndoDismiss = () => {
    setUndo(undefined);
  };

  const handleSend = (text: string) => {
    if (!activeEntry) return;
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const next: ThreadMessage[] = [
      ...messages,
      {
        id: `${activeEntry.id}-human-${Date.now()}`,
        type: 'human',
        author: 'You',
        text,
        time,
      },
      {
        id: `${activeEntry.id}-sys-ack-${Date.now()}`,
        type: 'system',
        text: 'Agent queued your message.',
        time,
      },
    ];
    writeMessages(activeEntry.id, next);
  };

  const toItems = (entries: QueueEntry[]): QueueItemProps[] =>
    entries.map((entry) => ({
      urgency: entry.urgency,
      name: entry.name,
      category: entry.category,
      summary: entry.summary,
      time: entry.time,
      sla: entry.sla,
      active: entry.id === activeId,
      onClick: () => {
        // If leaving an entry that's mid-edit, drop its in-flight edits so
        // the next visit starts clean. Committed overrides survive.
        if (activeEntry && activeEntry.id !== entry.id && activePatient) {
          const wasEditing = (centerPaneModeByEntry[activeEntry.id] ?? 'view') === 'edit';
          if (wasEditing) {
            setInflightCarePlanEdits((prev) => {
              const { [activePatient.id]: _, ...rest } = prev;
              return rest;
            });
            setCenterPaneModeByEntry((prev) => ({ ...prev, [activeEntry.id]: 'view' }));
          }
        }
        setActiveId(entry.id);
        // Reset transient per-entry interaction state on selection change.
        setNoteInvalid(false);
      },
    }));

  interface NavSection {
    urgency: QueueItemUrgency;
    label: string;
    items: QueueItemProps[];
  }

  const section = (
    urgency: QueueItemUrgency,
    label: string,
    entries: QueueEntry[],
  ): NavSection => ({
    urgency,
    label,
    items: toItems(entries),
  });

  const sections: NavSection[] = [
    section('urgent', 'Urgent', urgent),
    section('attention', 'Needs Attention', attention),
    section('info', 'Informational', info),
  ].filter((s) => s.items.length > 0);

  return (
    <AgenticShell>
      <nav className="panel-nav" aria-label="Queue">
        <div className="nav-header">
          <div className="nav-logo">
            <img src={logoSrc} alt="Cena Health" />
          </div>
        </div>
        {sections.map((s) => (
          <div className="nav-section" key={s.urgency}>
            <div className="nav-section-label">
              <span>{s.label}</span>
            </div>
            <ul className="queue-list">
              {s.items.map((item) => (
                <li key={`${s.urgency}-${item.name}`}>
                  <QueueItem {...item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className="panel-splitter"
        data-panel-splitter
        data-target="previous"
        data-min="180"
        data-max="360"
        aria-hidden="true"
      />

      <main className="panel-chat" aria-label="Activity">
        {activeEntry ? (
          <>
            <div className="chat-thread">
              <div className="chat-thread-inner">
                <ThreadMessageList
                  messages={messages}
                  onAction={handleAction}
                  rejectIntentId={rejectIntentId}
                  editIntentId={editIntentId}
                  noteValue={noteValue}
                  onNoteChange={(value) =>
                    setNoteByEntry((prev) => ({ ...prev, [activeEntry.id]: value }))
                  }
                  noteRef={noteRef}
                  noteInvalid={noteInvalid}
                  containerClassName=""
                />
                {undo && undo.entryId === activeEntry.id && (
                  <ThreadUndoBar
                    message={undo.message}
                    actionLabel={undo.message.startsWith('Approved') ? 'Undo' : undefined}
                    onAction={
                      undo.message.startsWith('Approved') ? handleUndoAction : undefined
                    }
                    onDismiss={handleUndoDismiss}
                  />
                )}
              </div>
            </div>
            <div className="chat-input-area">
              <ThreadInput onSend={handleSend} />
            </div>
          </>
        ) : (
          /* Empty-state per ux-design-lead verdict (2026-04-28): no global
             composer; coordinator IA is strictly entry-scoped. Vertically
             centered in panel-chat to read as an intentional state, not a
             placeholder. Aligned with thread-panel.html / three-panel-shell.html. */
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <p className="text-base font-medium text-sand-900">
                Pick a queue item to start.
              </p>
              <p className="text-sm text-sand-600 mt-2">
                Each conversation lives with a specific patient or referral, so
                the activity stays on the record.
              </p>
            </div>
          </div>
        )}
      </main>

      <div
        className="panel-splitter"
        data-panel-splitter
        data-target="next"
        data-min="320"
        data-max="640"
        aria-hidden="true"
      />

      {/* Record-led panel-content per agentic-shell PL doc, mode B (carve-out
          added 2026-04-28). RecordHeader inside CarePlanViewer carries the
          identity layer; content-header is intentionally omitted. */}
      <aside className="panel-content" aria-label="Care plan">
        {activeEntry && activeCarePlan && activePatient ? (
          <div className="flex-1 overflow-y-auto">
            <CarePlanViewer
              plan={activeCarePlan}
              patient={activePatient}
              mode={centerPaneMode}
              onPlanChange={(next) =>
                setInflightCarePlanEdits((prev) => ({
                  ...prev,
                  [activePatient.id]: next,
                }))
              }
            />
          </div>
        ) : activeEntry ? (
          <div className="content-body">
            <h2 className="section-title">{activeEntry.name}</h2>
            <p className="prose-section mt-2">
              {activeEntry.category} — {activeEntry.summary}
            </p>
          </div>
        ) : (
          <div className="content-body">
            <p className="text-sm text-sand-500">
              Select a queue item to load a record.
            </p>
          </div>
        )}
      </aside>
    </AgenticShell>
  );
}
