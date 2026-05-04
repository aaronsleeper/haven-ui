import {
  ThreadApprovalCard,
  ThreadMessageHuman,
  ThreadMessageResponse,
  ThreadMessageSystem,
  ThreadMessageToolCall,
} from '@haven/ui-react';
import type { Ref } from 'react';
import type { ThreadMessage } from '../../data/threads';

export interface ThreadMessageListProps {
  messages: ThreadMessage[];
  onAction: (
    messageId: string,
    intent: 'approve' | 'edit' | 'reject',
  ) => void;
  /** When set, the approval card with this id renders in noteMode='required'. */
  rejectIntentId?: string;
  /** When set, the approval card with this id is the active edit-flow card —
   *  primary button relabels to "Approve with edits" and the Edit-first
   *  button hides (already editing). */
  editIntentId?: string;
  noteValue: string;
  onNoteChange: (value: string) => void;
  noteRef?: Ref<HTMLTextAreaElement>;
  noteInvalid?: boolean;
  /** Cancel an in-progress reject flow — clears the reject intent for the
   *  active entry and hides the note field. Wireframe-locked: Cancel is
   *  `btn-ghost btn-sm` next to the `btn-danger` Send reject button. */
  onCancelReject?: () => void;
  /** Container className applied to the outer log element. Defaults to
   *  `thread-panel-body` (legacy three-panel-shell context, padding+flex).
   *  Pass an empty string when rendering inside `chat-thread-inner` —
   *  the parent already owns padding, max-width, and gap. */
  containerClassName?: string;
  /** When set, the most recent approved approval-response message gets a
   *  trailing "Edit again" link that calls this handler — discovery on-ramp
   *  for re-entering edit mode after a commit. Pass undefined when edit
   *  mode is already active (avoids re-entry while editing). */
  onEditAgain?: () => void;
}

export function ThreadMessageList({
  messages,
  onAction,
  rejectIntentId,
  editIntentId,
  noteValue,
  onNoteChange,
  noteRef,
  noteInvalid,
  containerClassName = 'thread-panel-body',
  onEditAgain,
  onCancelReject,
}: ThreadMessageListProps) {
  // Index of the last approved approval-response — only that one gets the
  // "Edit again" link so older commits don't compete for the affordance.
  const lastApprovedResponseId = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m && m.type === 'approval-response' && m.outcome === 'approved') return m.id;
    }
    return undefined;
  })();

  return (
    <div
      className={containerClassName}
      role="log"
      aria-live="polite"
      aria-label="Thread activity"
    >
      {messages.map((m) => {
        switch (m.type) {
          case 'system':
            return <ThreadMessageSystem key={m.id} text={m.text} time={m.time} />;
          case 'tool-call':
            return (
              <ThreadMessageToolCall
                key={m.id}
                toolName={m.toolName}
                resultSummary={m.resultSummary}
                time={m.time}
              >
                {m.detail}
              </ThreadMessageToolCall>
            );
          case 'human':
            return (
              <ThreadMessageHuman key={m.id} author={m.author} time={m.time}>
                {m.text}
              </ThreadMessageHuman>
            );
          case 'approval-response': {
            const isLastApproved = m.id === lastApprovedResponseId;
            const showEditAgain = isLastApproved && onEditAgain;
            return (
              <ThreadMessageResponse
                key={m.id}
                outcome={m.outcome}
                toggleContent={
                  showEditAgain ? (
                    <>
                      {m.summary}
                      {' · '}
                      <button
                        type="button"
                        className="text-link text-body-04"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAgain();
                        }}
                      >
                        Edit again
                      </button>
                    </>
                  ) : (
                    m.summary
                  )
                }
              >
                {m.detail ?? null}
              </ThreadMessageResponse>
            );
          }
          case 'approval-request': {
            const isRejectIntent = rejectIntentId === m.id;
            const isEditIntent = editIntentId === m.id;
            const primaryLabel = isEditIntent
              ? 'Approve with edits'
              : m.actions.primary.label;
            return (
              <ThreadApprovalCard
                key={m.id}
                variant={m.variant}
                title={m.title}
                contextTitle={m.contextTitle}
                contextMeta={m.contextMeta}
                summary={m.summary}
                effects={m.effects}
                attachment={m.attachment}
                noteMode={isRejectIntent || m.variant === 'warning' ? 'required' : 'hidden'}
                noteLabel={
                  isRejectIntent
                    ? 'Reason for rejection (required)'
                    : 'Approval note (required for warning approvals)'
                }
                notePlaceholder={
                  isRejectIntent
                    ? 'Tell the team what needs to change…'
                    : 'Note your review reasoning'
                }
                noteValue={noteValue}
                onNoteChange={onNoteChange}
                noteRef={noteRef}
                noteInvalid={noteInvalid}
                actions={
                  isRejectIntent ? (
                    /* Reject confirmation: Send reject (btn-danger) + Cancel
                       (btn-ghost) per wireframe cc-01 §"Click Reject". */
                    <>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => onAction(m.id, 'reject')}
                      >
                        Send reject
                      </button>
                      <button
                        type="button"
                        className="btn-ghost btn-sm"
                        onClick={() => onCancelReject?.()}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    /* Locked action ordering (NN/G dangerous-UX, Gate 2 #1):
                       [Approve][Edit first][Reassign][Reject] — Reject
                       rightmost with ms-4 (16px) gap to prevent tap-buddying. */
                    <>
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={() => onAction(m.id, m.actions.primary.intent)}
                      >
                        {primaryLabel}
                      </button>
                      {m.actions.edit && !isEditIntent && (
                        <button
                          type="button"
                          className="btn-outline btn-sm"
                          onClick={() => onAction(m.id, m.actions.edit!.intent)}
                        >
                          {m.actions.edit.label}
                        </button>
                      )}
                      {/* Reassign — team-only at v1; modal deferred from this slice. */}
                      <button
                        type="button"
                        className="btn-ghost btn-sm"
                        aria-label="Reassign to a teammate"
                      >
                        Reassign
                      </button>
                      {m.actions.reject && (
                        <button
                          type="button"
                          className="btn-outline btn-sm ms-4"
                          onClick={() => onAction(m.id, m.actions.reject!.intent)}
                        >
                          {m.actions.reject.label}
                        </button>
                      )}
                    </>
                  )
                }
              />
            );
          }
        }
      })}
    </div>
  );
}
