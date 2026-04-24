// Prop schema for ThreadMessageHuman. Co-located .props.ts is the codegen
// target for Markdoc tag schemas.
//
// Mirror of packages/design-system/pattern-library/components/thread-msg-human.html.

import type { ReactNode } from 'react';

export interface ThreadMessageHumanProps {
  /** Author label (e.g., "You" or coordinator name). */
  author: string;
  /** Bubble content — typically the message text. */
  children: ReactNode;
  /** Timestamp rendered below the bubble. */
  time: string;
  className?: string;
}
