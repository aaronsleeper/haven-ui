// Prop schema for ThreadMessageResponse. Co-located .props.ts is the codegen
// target for Markdoc tag schemas.
//
// Mirror of packages/design-system/pattern-library/components/thread-msg-response.html.

import type { ReactNode } from 'react';

export type ThreadMessageResponseOutcome = 'approved' | 'rejected';

export interface ThreadMessageResponseProps {
  /** Decision outcome — drives the modifier class and the leading icon. */
  outcome: ThreadMessageResponseOutcome;
  /**
   * Toggle row content rendered next to the icon. Typically a JSX fragment
   * with `<strong>{author}</strong> {summary} · {time}` per the PL exemplar.
   */
  toggleContent: ReactNode;
  /** Read-only re-expand content (the original approval card, rendered historical). */
  children: ReactNode;
  /**
   * Optional explicit id — used by Preline HSCollapse to pair toggle ↔ panel.
   * If omitted, a stable React-generated id is used.
   */
  id?: string;
  /** Whether the detail panel is initially expanded. Default: false. */
  defaultExpanded?: boolean;
  className?: string;
}
