// Prop schema for ThreadMessageToolCall. Co-located .props.ts is the codegen
// target for Markdoc tag schemas.
//
// Mirror of packages/design-system/pattern-library/components/thread-msg-tool-call.html.

import type { ReactNode } from 'react';

export interface ThreadMessageToolCallProps {
  /** Tool name rendered with a leading marker (e.g., "read_patient_assessment"). */
  toolName: string;
  /** One-line condensed result rendered after the tool name. */
  resultSummary: string;
  /** Timestamp rendered to the right of the result. */
  time: string;
  /** Expanded payload content (renders inside the collapsed detail panel). */
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
