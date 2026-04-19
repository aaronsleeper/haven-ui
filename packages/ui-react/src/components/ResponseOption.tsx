import type { ResponseOptionProps } from './ResponseOption.props';

export type { ResponseOptionProps } from './ResponseOption.props';

// Mirror of packages/design-system/pattern-library/components/response-option.html.
// Single numbered Likert/multi-choice option. Always rendered inside a ResponseOptionGroup,
// which owns roving tabindex and arrow-key navigation per the WAI-ARIA radiogroup pattern.

export function ResponseOption({
  index,
  label,
  checked = false,
  disabled = false,
  tabIndex = 0,
  onSelect,
}: ResponseOptionProps) {
  return (
    <button
      type="button"
      className="response-option"
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={() => !disabled && onSelect?.(index)}
    >
      <span className="response-option-index">
        <span className="response-option-index-num">{index}</span>
      </span>
      <span className="response-option-label">{label}</span>
      <i className="fa-solid fa-check response-option-check" aria-hidden="true"></i>
    </button>
  );
}
