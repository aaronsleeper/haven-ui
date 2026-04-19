import type { QueueItemProps, QueueItemUrgency } from './QueueItem.props';

// Prop schema for QueueSidebar. Mirror of
// packages/design-system/pattern-library/components/queue-sidebar.html.

export interface QueueSidebarBrand {
  logoSrc: string;
  logoAlt: string;
}

export interface QueueSidebarSectionHeader {
  urgency: QueueItemUrgency;
  label: string;
}

export interface QueueSidebarSection {
  header: QueueSidebarSectionHeader;
  items: QueueItemProps[];
}

export interface QueueSidebarProps {
  brand: QueueSidebarBrand;
  sections: QueueSidebarSection[];
  /** @default "Queue sidebar" */
  label?: string;
}
