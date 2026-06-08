// Generated from IconButtonProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - asComponent: ReactNode/JSX prop requires slotModel: "manual" (type: ElementType | ComponentType<Record<string, unknown>>)

export const iconButton = {
  render: 'IconButton',
  attributes: {
    icon: { type: String, required: true },
    ariaLabel: { type: String, required: true },
    variant: { type: String, required: false, matches: ["neutral", "primary"] },
    href: { type: String, required: false },
    type: { type: String, required: false, matches: ["submit", "button"] },
    linkProps: { type: Object, required: false },
  },
};
