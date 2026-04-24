// Prop schema for ThreadApprovalCard. Co-located .props.ts is the codegen
// target for Markdoc tag schemas.
//
// Mirror of packages/design-system/pattern-library/components/thread-approval-card.html.
//
// THE HERO COMPONENT. Brand-fidelity-weighted per Lab/haven-ui CLAUDE.md
// (4-expert panel review applied on first port; iterate pass 2026-04-24
// surfaced semantic landmark + heading + label + noteMode + attachment.viewed
// + voice fixes — all incorporated).

import type { ReactNode, Ref } from 'react';

export type ThreadApprovalCardVariant =
  | 'standard'
  | 'urgent'
  | 'warning'
  | 'historical';

/**
 * Note disclosure mode. Tied to the parent's reject/approve flow:
 *   - 'hidden'   — textarea not rendered (default)
 *   - 'optional' — rendered, no aria-required
 *   - 'required' — rendered with aria-required="true"; parent should focus it
 *                  via noteRef when entering this mode (e.g., on Reject click).
 */
export type ThreadApprovalNoteMode = 'hidden' | 'optional' | 'required';

export interface ThreadApprovalAttachment {
  /** Visible label (e.g., "1 attachment", "1 document — not viewed"). */
  label: string;
  /** Action link label (e.g., "View"). */
  viewLabel: string;
  /**
   * Whether the attachment has been viewed. When false, the attachment line
   * gets warning-weight styling (amber color, fa-circle-exclamation icon)
   * to surface the silent-failure risk per IA review.
   * @default true
   */
  viewed?: boolean;
  /** Optional href for the View link. */
  viewHref?: string;
  /** Optional click handler for the View link. */
  onView?: () => void;
}

export interface ThreadApprovalEffects {
  /** Section label (e.g., "Approving will:" or "Pursuing alternative will:"). */
  label: string;
  /** Bulleted items describing downstream effects. */
  items: ReactNode[];
}

export interface ThreadApprovalCardProps {
  /** Variant — drives the modifier class. Default: 'standard' (no modifier). */
  variant?: ThreadApprovalCardVariant;
  /** FontAwesome icon class for the header. Default: 'fa-hand'. */
  icon?: string;
  /** Header label rendered next to the icon (e.g., "Final Approval — Care Plan v1.0"). */
  title: string;
  /**
   * Heading level for the title element. Default: 3 (cards live inside the
   * thread-panel <aside> which is h2 per cc-02 §Accessibility).
   */
  headingLevel?: 2 | 3 | 4 | 5;
  /** Top context line — bold (e.g., "Care plan draft · Maria Garcia"). */
  contextTitle: string;
  /** Sub-context line (e.g., "All clinical sections approved · 3 min ago"). */
  contextMeta: string;
  /** Summary section content — varies by approval type (goals list, alt path, etc.). */
  summary?: ReactNode;
  /** Downstream effects — label + bulleted items. */
  effects?: ThreadApprovalEffects;
  /** Optional attachment indicator. */
  attachment?: ThreadApprovalAttachment;
  /** Action buttons slot. Compose <button class="btn-primary btn-sm"> + <button class="btn-outline btn-sm"> per PL exemplar. */
  actions?: ReactNode;
  /**
   * Note textarea disclosure mode. Default: 'hidden'.
   * Required interaction: parent flips to 'required' on Reject click and
   * calls noteRef.current?.focus() to move focus to the textarea.
   */
  noteMode?: ThreadApprovalNoteMode;
  /**
   * Accessible label for the note textarea (sr-only). Required when noteMode
   * is 'optional' or 'required' per WCAG 4.1.2 (placeholders are not labels).
   * Default: "Approval note" — caller should override with intent
   * (e.g., "Rejection note (required)").
   */
  noteLabel?: string;
  /** Note textarea placeholder. Default: "Add a note (optional)". */
  notePlaceholder?: string;
  /** Note textarea rows. Default: 2. */
  noteRows?: number;
  /** Controlled note value. */
  noteValue?: string;
  /** Note change handler. */
  onNoteChange?: (value: string) => void;
  /** Forwarded ref to the textarea — parent calls .focus() to move focus on Reject intent. */
  noteRef?: Ref<HTMLTextAreaElement>;
  /** When true, applies aria-invalid to the textarea (e.g., empty required note). */
  noteInvalid?: boolean;
  className?: string;
}
