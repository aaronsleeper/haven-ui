// Generated from CommitActionProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - asComponent: ReactNode/JSX prop requires slotModel: "manual" (type: ElementType | ComponentType<Record<string, unknown>>)

export const commitAction = {
  render: 'CommitAction',
  attributes: {
    label: { type: String, required: true },
    href: { type: String, required: false },
    type: { type: String, required: false, matches: ["submit", "button"] },
    block: { type: Boolean, required: false },
    linkProps: { type: Object, required: false },
  },
};
