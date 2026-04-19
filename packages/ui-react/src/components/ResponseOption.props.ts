// Prop schema for ResponseOption. Mirror of
// packages/design-system/pattern-library/components/response-option.html.

export interface ResponseOptionProps {
  /** Numeric index shown in the square (e.g., 0–3 for GAD-7). */
  index: number;
  label: string;
  /** @default false */
  checked?: boolean;
  /** @default false */
  disabled?: boolean;
  /** Roving tabindex: 0 when focusable, -1 when programmatic-only. @default 0 */
  tabIndex?: number;
  onSelect?: (index: number) => void;
}
