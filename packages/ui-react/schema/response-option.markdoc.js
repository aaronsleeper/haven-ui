// Generated from ResponseOptionProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - onSelect: function prop cannot round-trip through Markdoc (type: (index: number) => void)

export const responseOption = {
  render: 'ResponseOption',
  attributes: {
    index: { type: Number, required: true },
    label: { type: String, required: true },
    checked: { type: Boolean, required: false, default: false },
    disabled: { type: Boolean, required: false, default: false },
    tabIndex: { type: Number, required: false, default: 0 },
  },
};
