// Prop schema for ThreadMessageSystem. Co-located .props.ts is the codegen
// target for Markdoc tag schemas.
//
// Mirror of packages/design-system/pattern-library/components/thread-msg-system.html.

export interface ThreadMessageSystemProps {
  /** The system event text rendered on the left. */
  text: string;
  /** Timestamp rendered on the right. */
  time: string;
  className?: string;
}
