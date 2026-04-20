import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { ResponseOptionGroupProps } from './ResponseOptionGroup.props';
import { ResponseOption } from './ResponseOption';

export type {
  ResponseOptionGroupProps,
  ResponseOptionData,
} from './ResponseOptionGroup.props';

// Mirror of packages/design-system/pattern-library/components/response-option-group.html.
// Wraps one assessment question + its N response-options. Handles keyboard nav and
// roving tabindex per the WAI-ARIA radiogroup pattern; selection follows focus.

const NAV_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

export function ResponseOptionGroup({
  promptId,
  prompt,
  options,
  selectedIndex: controlledSelected,
  onChange,
}: ResponseOptionGroupProps) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState<number | undefined>();
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : uncontrolledSelected;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (index: number) => {
      if (!isControlled) setUncontrolledSelected(index);
      onChange?.(index);
    },
    [isControlled, onChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!NAV_KEYS.has(event.key)) return;
      event.preventDefault();

      const buttons = Array.from(
        containerRef.current?.querySelectorAll<HTMLButtonElement>(
          'button[role="radio"]',
        ) ?? [],
      );
      if (buttons.length === 0) return;

      const activeIdx = buttons.findIndex((b) => b === document.activeElement);
      let nextIdx: number;
      if (event.key === 'Home') {
        nextIdx = 0;
      } else if (event.key === 'End') {
        nextIdx = buttons.length - 1;
      } else {
        const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        nextIdx =
          activeIdx === -1 ? 0 : (activeIdx + delta + buttons.length) % buttons.length;
      }

      const nextButton = buttons[nextIdx];
      if (!nextButton) return;
      nextButton.focus();

      const optionIndex = options[nextIdx]?.index;
      if (typeof optionIndex === 'number') handleSelect(optionIndex);
    },
    [options, handleSelect],
  );

  // Roving tabindex: focused option is the selected one, else the first.
  const focusedIdx =
    selected !== undefined ? options.findIndex((o) => o.index === selected) : 0;

  return (
    <div
      ref={containerRef}
      className="response-option-group"
      role="radiogroup"
      aria-labelledby={promptId}
      onKeyDown={handleKeyDown}
    >
      <p id={promptId} className="response-option-group-prompt">
        {prompt}
      </p>
      <div className="response-option-group-list">
        {options.map((option, idx) => (
          <ResponseOption
            key={option.index}
            index={option.index}
            label={option.label}
            checked={selected === option.index}
            tabIndex={idx === focusedIdx ? 0 : -1}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
