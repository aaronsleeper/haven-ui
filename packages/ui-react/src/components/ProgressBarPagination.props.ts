// Prop schema for ProgressBarPagination. Mirror of
// packages/design-system/pattern-library/components/progress-bar-pagination.html.

export interface ProgressBarPaginationStep {
  /** @default "not-started" */
  status?: 'complete' | 'in-progress' | 'not-started';
  /** Screen-reader label, e.g., "Question 3 — in progress". */
  label: string;
}

export interface ProgressBarPaginationProps {
  steps: ProgressBarPaginationStep[];
  /** Landmark label, e.g., "Assessment progress: question 3 of 7". */
  ariaLabel: string;
}
