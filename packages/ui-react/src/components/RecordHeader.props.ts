import type { ReactNode } from 'react';

// Prop schema for RecordHeader. Mirror of
// packages/design-system/pattern-library/components/layout-record-header.html.

export interface RecordHeaderProps {
  /** Title text — Lora display per DESIGN.md §Typography. */
  title: ReactNode;
  /** Optional subtitle below the title (demographics line, patient name, etc.). */
  subtitle?: ReactNode;
  /** Optional trailing slot — typically a status badge + meta line. */
  trailing?: ReactNode;
  /** Optional meta label rendered below the trailing slot. */
  meta?: ReactNode;
  className?: string;
}
