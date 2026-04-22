// Prop schema for TaskCard. Mirror of
// packages/design-system/pattern-library/components/patient-task-card.html.

import type { ComponentType, ElementType } from 'react';
import type { AvatarColor } from './Avatar.props';

export type TaskCardState = 'default' | 'overdue' | 'in-progress' | 'completed';

export interface TaskCardProps {
  /** Primary task label. */
  name: string;
  /** Secondary text — time estimate, due date, completion date, etc. */
  meta: string;
  /** FontAwesome class fragment for the leading avatar icon (e.g. 'fa-solid fa-brain'). */
  iconClass: string;
  /** Avatar color modifier; defaults to 'primary'. */
  avatarColor?: AvatarColor;
  /**
   * Visual state. Drives the modifier class + the trailing icon (chevron-right
   * for actionable states, circle-check for completed). For 'overdue', an
   * "Overdue" badge is auto-prepended to the meta text. For 'in-progress',
   * the meta text picks up teal coloring via the .task-card-in-progress
   * descendant rule.
   */
  state?: TaskCardState;
  /** Destination URL. If provided (and state !== 'completed'), renders as <a>. */
  href?: string;
  /**
   * Render as a custom component (e.g. react-router <Link>) instead of <a>.
   * Ignored when state='completed' (the card is non-interactive in that state).
   */
  asComponent?: ElementType | ComponentType<Record<string, unknown>>;
  /** Props forwarded to `asComponent`. Use this for router-specific props like `to`. */
  linkProps?: Record<string, unknown>;
}
