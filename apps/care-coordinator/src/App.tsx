import { useEffect, useMemo, useRef, useState } from 'react';
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
import { MorningSummary } from './components/MorningSummary';
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
  // Filter pills — per-user persistence via localStorage (stub until real API).
  // Locked decision: per-user filter persistence (Gate 2-review #4).
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    try {
      return localStorage.getItem('user_prefs.queue_filter') ?? 'all';
    } catch {
      return 'all';
    }
  });
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    try {
      localStorage.setItem('user_prefs.queue_filter', filter);
    } catch {
      // localStorage unavailable — filter works for session only.
    }
  };
  const noteRef = useRef<HTMLTextAreaElement>(null);
  // Track which entries have been "first-opened" so auto-scroll fires once
  // per entry (Gate 2 #6: auto-scroll to active approval card on first
  // record-open; subsequent re-opens preserve user scroll).
  const firstOpenedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeId) return;
    if (firstOpenedRef.current.has(activeId)) return;
    const timer = window.setTimeout(() => {
      const card = document.querySelector('.thread-approval-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      firstOpenedRef.current.add(activeId);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [activeId]);

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

  // Patch E.2 — coordinator-self-initiated edit-mode entry path. Used by:
  //   1. Per-section "Edit" button on coordinator-pending sections (CarePlanViewer)
  //   2. "Edit again" link on the most-recent approval-response message
  // Decoupled from handleAction(messageId, 'edit') because the trigger is no
  // longer tied to an approval-request card — the original card is gone.
  const handleEnterEditMode = () => {
    if (!activeEntry) return;
    setCenterPaneModeByEntry((prev) => ({ ...prev, [activeEntry.id]: 'edit' }));
  };

  // Cancel an edit-mode session — discard inflight edits and return to view.
  // No thread message is written (cancellation is not an audit event).
  const handleCancelEdit = () => {
    if (!activeEntry || !activePatient) return;
    setInflightCarePlanEdits((prev) => {
      const { [activePatient.id]: _, ...rest } = prev;
      return rest;
    });
    setCenterPaneModeByEntry((prev) => ({ ...prev, [activeEntry.id]: 'view' }));
  };

  // Commit an edit-mode session as a coordinator-self-initiated approval-
  // response (no precedent approval-request). Mirrors the edit-approve branch
  // of handleAction but appends a fresh response instead of replacing a card.
  const handleCommitEdit = () => {
    if (!activeEntry || !activePatient) return;
    const baseline = committedPlan ?? originalCarePlan;
    if (!baseline || !inflightPlan) {
      // No-op: nothing to commit. Just exit edit mode.
      setCenterPaneModeByEntry((prev) => ({ ...prev, [activeEntry.id]: 'view' }));
      return;
    }
    const diffLines = computeMealDeliveryDiff(baseline, inflightPlan);
    const editsSummary = diffLines.length > 0 ? diffLines.join(', ') : undefined;
    const previousCommittedPlan = { patientId: activePatient.id, plan: committedPlan };
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const previousMessages = messages;
    const verb = editsSummary ? 'Updated the care plan' : 'Closed editing';
    const response: ThreadApprovalResponseRecord = {
      id: `${activeEntry.id}-coordinator-edit-${Date.now()}`,
      type: 'approval-response',
      outcome: 'approved',
      summary: (
        <>
          <strong>You</strong> {verb}
          {editsSummary ? ` — ${editsSummary}` : ''} · {time}
        </>
      ),
      time,
      detail: editsSummary ? (
        <p className="text-xs text-sand-500 px-4 py-2 bg-sand-50 rounded-lg">
          Saved just now. (Read-only re-expand of the edited fields would render here.)
        </p>
      ) : undefined,
    };
    writeMessages(activeEntry.id, [...messages, response]);
    if (editsSummary) {
      setCommittedPlanOverrides((prev) => ({ ...prev, [activePatient.id]: inflightPlan }));
    }
    setInflightCarePlanEdits((prev) => {
      const { [activePatient.id]: _, ...rest } = prev;
      return rest;
    });
    setCenterPaneModeByEntry((prev) => ({ ...prev, [activeEntry.id]: 'view' }));
    if (editsSummary) {
      setUndo({
        entryId: activeEntry.id,
        previousMessages,
        message: `Updated — ${editsSummary}.`,
        previousCommittedPlan,
      });
    }
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

  // Filter pill type → queue category match. Categories use exact strings
  // from queue.ts ("Care Plan" with capital P, "Referral", etc.).
  // "Discharges" and "Insurance" produce empty results at v1 (no fixture
  // data in those categories yet); pill set is locked at 5 per Gate 2.
  const FILTER_TYPES: Record<string, string[]> = {
    all: [],
    referrals: ['Referral'],
    'care-plans': ['Care Plan'],
    discharges: ['Discharge'],
    insurance: ['Insurance'],
  };
  const filterItems = (entries: QueueEntry[]) => {
    if (activeFilter === 'all') return entries;
    const allowed = FILTER_TYPES[activeFilter] ?? [];
    return entries.filter((e) => allowed.includes(e.category));
  };

  // Build all three sections, retaining empty tiers so per-tier empty notes
  // can render. `isQueueEmpty` is true only when all three filter to zero —
  // that surfaces the full data-empty-state instead of a stack of "Nothing"
  // notes (judgment call: full-empty over per-tier-emptiness when global).
  const allSections: NavSection[] = [
    section('urgent', 'Urgent', filterItems(urgent)),
    section('attention', 'Needs Attention', filterItems(attention)),
    section('info', 'Informational', filterItems(info)),
  ];
  const isQueueEmpty = allSections.every((s) => s.items.length === 0);

  const urgencyClass = (u: QueueItemUrgency) =>
    u === 'urgent' ? 'is-urgent' : u === 'attention' ? 'is-attention' : 'is-info';

  const urgencyIcon = (u: QueueItemUrgency) =>
    u === 'urgent'
      ? 'fa-solid fa-circle-exclamation'
      : u === 'attention'
        ? 'fa-solid fa-triangle-exclamation'
        : 'fa-solid fa-circle-info';

  const perTierEmptyNote = (u: QueueItemUrgency) =>
    u === 'urgent'
      ? 'Nothing urgent right now.'
      : u === 'attention'
        ? 'Nothing in needs-attention.'
        : 'No informational items.';

  return (
    <AgenticShell>
      <nav className="panel-nav" aria-label="Queue">
        <div className="queue-sidebar">
          <div className="queue-sidebar-brand">
            <div className="nav-header">
              <div className="nav-logo">
                <img src={logoSrc} alt="Cena Health" />
              </div>
            </div>
          </div>
          <div className="queue-sidebar-body">
            {/* Filter pills — layout-only utilities for spacing/wrap (per CLAUDE.md). */}
            <div className="flex flex-wrap gap-1.5 px-3 pb-3 pt-1">
              {(['all', 'referrals', 'care-plans', 'discharges', 'insurance'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-pill${activeFilter === f ? ' active' : ''}`}
                  aria-pressed={activeFilter === f}
                  onClick={() => handleFilterChange(f)}
                >
                  {f === 'all'
                    ? 'All'
                    : f === 'care-plans'
                      ? 'Care plans'
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {isQueueEmpty ? (
              /* Full-queue empty state. Locked copy from wireframe
                 shell-cc-coordinator.md "Empty State (no queue items at all)".
                 Class names are .empty-state / .empty-state-icon (PL canonical
                 — file is data-empty-state.html but classes drop the prefix). */
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="fa-regular fa-circle-check" aria-hidden="true" />
                </div>
                <h3>Nothing needs your attention right now</h3>
                <p>We'll surface anything urgent. Until then, you're caught up.</p>
              </div>
            ) : (
              allSections.map((s) => (
                <div key={s.urgency}>
                  <h2 className={`queue-section-header ${urgencyClass(s.urgency)}`}>
                    <i className={urgencyIcon(s.urgency)} aria-hidden="true" />
                    {s.label}
                    <span className="badge badge-pill badge-neutral badge-sm ms-auto">
                      {s.items.length}
                    </span>
                  </h2>
                  {s.items.length > 0 ? (
                    <ul className="queue-list">
                      {s.items.map((item) => (
                        <li key={`${s.urgency}-${item.name}`}>
                          <QueueItem {...item} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-sand-500 dark:text-sand-400 px-3 py-2">
                      {perTierEmptyNote(s.urgency)}
                    </p>
                  )}
                </div>
              ))
            )}
            {/* Secondary nav */}
            <div className="divider my-1" aria-hidden="true" />
            <nav aria-label="Secondary navigation">
              <ul className="sidebar-nav-list">
                <li>
                  <a href="/patients" className="sidebar-nav-item">
                    <i className="fa-regular fa-users" aria-hidden="true" />
                    <span>Patients</span>
                  </a>
                </li>
                <li>
                  <a href="/reports" className="sidebar-nav-item">
                    <i className="fa-regular fa-chart-bar" aria-hidden="true" />
                    <span>Reports</span>
                  </a>
                </li>
                <li>
                  <a href="/settings" className="sidebar-nav-item">
                    <i className="fa-regular fa-gear" aria-hidden="true" />
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          {/* User menu — pinned bottom of queue-sidebar */}
          <div className="mt-auto px-3 py-3 border-t border-sand-200 dark:border-sand-700">
            <div className="hs-dropdown relative flex items-center gap-2 w-full">
              <button
                type="button"
                className="hs-dropdown-toggle flex items-center gap-2 w-full text-left"
                aria-label="User menu"
              >
                <div className="avatar avatar-sm avatar-primary flex-shrink-0">
                  <span>SK</span>
                </div>
                <span className="text-sm font-medium text-sand-900 dark:text-sand-100 truncate">
                  Sarah K.
                </span>
                <i
                  className="fa-solid fa-chevron-up text-xs text-sand-400 ms-auto"
                  aria-hidden="true"
                />
              </button>
              <div className="hs-dropdown-menu" role="menu" aria-label="User options">
                <a className="hs-dropdown-item" href="/profile">
                  <i className="fa-regular fa-user me-2" aria-hidden="true" />
                  Profile
                </a>
                <a className="hs-dropdown-item" href="/help">
                  <i className="fa-regular fa-circle-question me-2" aria-hidden="true" />
                  Help
                </a>
                <div className="hs-dropdown-divider" role="separator" />
                <button
                  type="button"
                  className="hs-dropdown-item w-full text-left text-error-600 dark:text-error-400"
                >
                  <i
                    className="fa-regular fa-arrow-right-from-bracket me-2"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="panel-splitter"
        data-panel-splitter
        data-target="previous"
        data-min="220"
        data-max="320"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize queue panel"
        tabIndex={0}
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
                  onEditAgain={
                    centerPaneMode === 'view' ? handleEnterEditMode : undefined
                  }
                  onCancelReject={() => {
                    setRejectIntentByEntry((prev) => ({
                      ...prev,
                      [activeEntry.id]: undefined,
                    }));
                    setNoteByEntry((prev) => ({ ...prev, [activeEntry.id]: '' }));
                    setNoteInvalid(false);
                  }}
                />
              </div>
            </div>
            <div className="chat-input-area">
              <ThreadInput onSend={handleSend} />
            </div>
          </>
        ) : (
          <MorningSummary
            urgent={urgent}
            attention={attention}
            info={info}
            onItemClick={(id) => setActiveId(id)}
          />
        )}
      </main>

      <div
        className="panel-splitter"
        data-panel-splitter
        data-target="next"
        data-min="480"
        data-max="800"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize care plan panel"
        tabIndex={0}
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
              onEnterEdit={handleEnterEditMode}
              onCommitEdit={handleCommitEdit}
              onCancelEdit={handleCancelEdit}
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
      {/* ThreadUndoBar renders to document.body via ReactDOM.createPortal —
          document-level toast portal per Gate 2-review #2. Render position
          inside AgenticShell is irrelevant; the portal escapes the panel
          layout. JSX placement here keeps App() rooted in a single shell
          element (conform:app-shell gate). */}
      {undo && activeEntry && undo.entryId === activeEntry.id && (
        <ThreadUndoBar
          message={undo.message}
          actionLabel={undo.message.startsWith('Approved') ? 'Undo' : undefined}
          onAction={undo.message.startsWith('Approved') ? handleUndoAction : undefined}
          onDismiss={handleUndoDismiss}
        />
      )}
    </AgenticShell>
  );
}
