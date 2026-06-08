// Generated from TaskCardProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - asComponent: ReactNode/JSX prop requires slotModel: "manual" (type: ElementType | ComponentType<Record<string, unknown>>)

export const taskCard = {
  render: 'TaskCard',
  attributes: {
    name: { type: String, required: true },
    meta: { type: String, required: true },
    iconClass: { type: String, required: true },
    avatarColor: { type: String, required: false, matches: ["primary", "secondary", "neutral"] },
    state: { type: String, required: false, matches: ["default", "overdue", "in-progress", "completed"] },
    href: { type: String, required: false },
    linkProps: { type: Object, required: false },
  },
};
