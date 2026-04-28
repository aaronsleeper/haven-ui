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
}: ThreadMessageListProps) {
  return (
    <div
      className="thread-panel-body"
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
          case 'approval-response':
            return (
              <ThreadMessageResponse
                key={m.id}
                outcome={m.outcome}
                toggleContent={m.summary}
              >
                {m.detail ?? null}
              </ThreadMessageResponse>
            );
          case 'approval-request': {
            const isRejectIntent = rejectIntentId === m.id;
            const isEditIntent = editIntentId === m.id;
            const primaryLabel = isRejectIntent
              ? 'Confirm rejection'
              : isEditIntent
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
                    ? 'Rejection note (required)'
                    : 'Approval note (required for warning approvals)'
                }
                notePlaceholder={
                  isRejectIntent ? 'Why is this being rejected?' : 'Note your review reasoning'
                }
                noteValue={noteValue}
                onNoteChange={onNoteChange}
                noteRef={noteRef}
                noteInvalid={noteInvalid}
                actions={
                  <>
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() =>
                        onAction(
                          m.id,
                          isRejectIntent ? 'reject' : m.actions.primary.intent,
                        )
                      }
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
                    {m.actions.reject && !isRejectIntent && (
                      <button
                        type="button"
                        className="btn-outline btn-sm"
                        onClick={() => onAction(m.id, m.actions.reject!.intent)}
                      >
                        {m.actions.reject.label}
                      </button>
                    )}
                  </>
                }
              />
            );
          }
        }
      })}
    </div>
  );
}
