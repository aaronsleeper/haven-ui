// Prop schema for QueueItem. Co-located .props.ts is the codegen target for
// Markdoc tag schemas (see Lab/generative-ui-research/spikes/codegen/).
//
// Mirror of packages/design-system/pattern-library/components/queue-item.html.

export type QueueItemUrgency = 'urgent' | 'attention' | 'info';

export interface QueueItemSla {
  status: 'warning' | 'breached';
  text: string;
  /** Screen-reader-only label describing the status in words. */
  label: string;
}

export interface QueueItemProps {
  urgency: QueueItemUrgency;
  /** @default false */
  active?: boolean;
  onClick?: () => void;
  name: string;
  category: string;
  summary: string;
  time: string;
  sla?: QueueItemSla;
  className?: string;
}
