import type { ReactNode } from 'react';
import { Avatar } from './Avatar';
import type { TaskCardProps, TaskCardState } from './TaskCard.props';

export type { TaskCardProps, TaskCardState } from './TaskCard.props';

// Mirror of packages/design-system/pattern-library/components/patient-task-card.html.
// Tappable row for a patient task. Composes Avatar (sm) on the left, name + meta
// in the middle, and a trailing chevron (or check, when completed). State drives
// the modifier class (.task-card-overdue / -in-progress / -completed) and the
// trailing-icon glyph; the in-progress meta picks up teal text via the
// `.task-card-in-progress .task-card-meta` descendant rule (no inline style).
//
// Render branches:
//   state === 'completed' → <div> (non-interactive; ignores href / asComponent).
//   asComponent set → <AsComponent {...linkProps}> — for router-Link injection.
//   href set → <a href>.
//   neither → <div> (presentational; no interaction).

const STATE_CLASS: Record<TaskCardState, string> = {
  default: '',
  overdue: ' task-card-overdue',
  'in-progress': ' task-card-in-progress',
  completed: ' task-card-completed',
};

export function TaskCard({
  name,
  meta,
  iconClass,
  avatarColor = 'primary',
  state = 'default',
  href,
  asComponent: AsComponent,
  linkProps,
}: TaskCardProps) {
  const className = `task-card${STATE_CLASS[state]}`;
  const trailing =
    state === 'completed' ? (
      <i className="fa-solid fa-circle-check text-success-500" aria-hidden="true" />
    ) : (
      <i className="fa-solid fa-chevron-right text-sand-300" aria-hidden="true" />
    );

  const body: ReactNode = (
    <>
      <div className="task-card-icon">
        <Avatar size="sm" color={avatarColor}>
          <i className={`${iconClass} avatar-icon`} aria-hidden="true" />
        </Avatar>
      </div>
      <div className="task-card-content">
        <p className="task-card-name">{name}</p>
        <p className="task-card-meta">
          {state === 'overdue' ? (
            <>
              <span className="badge badge-warning badge-sm">Overdue</span>
              {' · '}
              {meta}
            </>
          ) : (
            meta
          )}
        </p>
      </div>
      {trailing}
    </>
  );

  if (state === 'completed') {
    return <div className={className}>{body}</div>;
  }
  if (AsComponent) {
    return (
      <AsComponent {...linkProps} className={className}>
        {body}
      </AsComponent>
    );
  }
  if (href) {
    return (
      <a href={href} className={className}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}
