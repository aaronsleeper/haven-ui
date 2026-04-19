import type { ProgressBarPaginationProps } from './ProgressBarPagination.props';

// Prop schema for AssessmentHeader. Mirror of
// packages/design-system/pattern-library/components/assessment-header.html.

export interface AssessmentHeaderProps {
  title: string;
  progress: ProgressBarPaginationProps;
  /** e.g., "Question 3 of 7" — omit to hide the meta line. */
  meta?: string;
}
