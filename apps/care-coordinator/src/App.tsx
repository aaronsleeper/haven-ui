import { useMemo, useRef, useState } from 'react';
import {
  QueueSidebar,
  ThreePanelShell,
  ThreePanelShellCenter,
  ThreadPanel,
  ThreadPanelEmpty,
} from '@haven/ui-react';
import type {
  QueueItemProps,
  QueueItemUrgency,
  QueueSidebarSection,
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
import { getCarePlanForEntry, getPatientForEntry } from './data/care-plans';

interface UndoState {
  /** Entry id whose thread the toast belongs to. */
  entryId: string;
  /** Original messages before the optimistic mutation. */
  previousMessages: ThreadMessage[];
  /** Verb past-tense for display (e.g., "Approved"). */
  message: string;
}

function makeApprovalResponse(
  request: ThreadApprovalRequest,
  outcome: 'approved' | 'rejected',
  note?: string,
): ThreadApprovalResponseRecord {
  const verb = outcome === 'approved' ? 'Approved' : 'Rejected';
  const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return {
    id: `${request.id}-response`,
    type: 'approval-response',
    approvalRequestId: request.id,
    outcome,
    summary: (
      <>
        <strong>You</strong> {verb}
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
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const activeEntry = useMemo(() => {
    const all = [...urgent, ...attention, ...info];
    return all.find((entry) => entry.id === activeId);
  }, [activeId]);

  const messages: ThreadMessage[] = useMemo(() => {
    if (!activeEntry) return [];
    return threadOverrides[activeEntry.id] ?? getThreadFor(activeEntry.id);
  }, [activeEntry, threadOverrides]);

  const rejectIntentId = activeEntry ? rejectIntentByEntry[activeEntry.id] : undefined;
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
      // Stub: real flow opens center-pane edit mode (lives with cc-05).
      console.info('[edit-first stub] would open center-pane edit for', request.title);
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
    const next = messages.map((m) =>
      m.id === messageId
        ? makeApprovalResponse(request, 'approved', note || undefined)
        : m,
    );
    writeMessages(entryId, next);
    setNoteByEntry((prev) => ({ ...prev, [entryId]: '' }));
    setNoteInvalid(false);
    setUndo({
      entryId,
      previousMessages,
      message: 'Approved.',
    });
  };

  const handleUndoAction = () => {
    if (!undo) return;
    writeMessages(undo.entryId, undo.previousMessages);
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
        setActiveId(entry.id);
        // Reset transient per-entry interaction state on selection change.
        setNoteInvalid(false);
      },
    }));

  const section = (
    urgency: QueueItemUrgency,
    label: string,
    entries: QueueEntry[],
  ): QueueSidebarSection => ({
    header: { urgency, label },
    items: toItems(entries),
  });

  const sections: QueueSidebarSection[] = [
    section('urgent', 'Urgent', urgent),
    section('attention', 'Needs Attention', attention),
    section('info', 'Informational', info),
  ].filter((s) => s.items.length > 0);

  return (
    <ThreePanelShell>
      <QueueSidebar
        brand={{ logoSrc, logoAlt: 'Cena Health' }}
        sections={sections}
      />

      <ThreePanelShellCenter>
        {activeEntry ? (
          (() => {
            const carePlan = getCarePlanForEntry(activeEntry.id);
            const patient = getPatientForEntry(activeEntry.id);
            if (carePlan && patient) {
              return <CarePlanViewer plan={carePlan} patient={patient} />;
            }
            return (
              <section className="p-6">
                <h1 className="section-title">{activeEntry.name}</h1>
                <p className="prose-section mt-2">
                  {activeEntry.category} — {activeEntry.summary}
                </p>
              </section>
            );
          })()
        ) : (
          <section className="p-6">
            <h1 className="section-title">Select a queue item</h1>
            <p className="prose-section mt-2">
              Choose an item from the queue to load a record.
            </p>
          </section>
        )}
      </ThreePanelShellCenter>

      <ThreadPanel>
        {activeEntry ? (
          <>
            <ThreadMessageList
              messages={messages}
              onAction={handleAction}
              rejectIntentId={rejectIntentId}
              noteValue={noteValue}
              onNoteChange={(value) =>
                setNoteByEntry((prev) => ({ ...prev, [activeEntry.id]: value }))
              }
              noteRef={noteRef}
              noteInvalid={noteInvalid}
            />
            {undo && undo.entryId === activeEntry.id && (
              <ThreadUndoBar
                message={undo.message}
                actionLabel={undo.message === 'Approved.' ? 'Undo' : undefined}
                onAction={undo.message === 'Approved.' ? handleUndoAction : undefined}
                onDismiss={handleUndoDismiss}
              />
            )}
            <ThreadInput onSend={handleSend} />
          </>
        ) : (
          <ThreadPanelEmpty>
            Select a queue item to see its activity.
          </ThreadPanelEmpty>
        )}
      </ThreadPanel>
    </ThreePanelShell>
  );
}
