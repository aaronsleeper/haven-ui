// Generated from ResponseOptionGroupProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - onChange: function prop cannot round-trip through Markdoc (type: (index: number) => void)

export const responseOptionGroup = {
  render: 'ResponseOptionGroup',
  attributes: {
    promptId: { type: String, required: true },
    prompt: { type: String, required: true },
    options: { type: Array, required: true },
    selectedIndex: { type: Number, required: false },
  },
};
