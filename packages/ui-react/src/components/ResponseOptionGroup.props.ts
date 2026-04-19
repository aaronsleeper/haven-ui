// Prop schema for ResponseOptionGroup. Mirror of
// packages/design-system/pattern-library/components/response-option-group.html.

export interface ResponseOptionData {
  index: number;
  label: string;
}

export interface ResponseOptionGroupProps {
  /** DOM id for the prompt element; referenced by aria-labelledby on the radiogroup. */
  promptId: string;
  prompt: string;
  options: ResponseOptionData[];
  /** Index of the selected option; undefined means unanswered. */
  selectedIndex?: number;
  onChange?: (index: number) => void;
}
