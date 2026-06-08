// Generated from AvatarProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - children: ReactNode/JSX prop requires slotModel: "manual" (type: ReactNode)

export const avatar = {
  render: 'Avatar',
  attributes: {
    size: { type: String, required: false, matches: ["xs", "sm", "md", "lg", "xl"] },
    color: { type: String, required: false, matches: ["primary", "secondary", "neutral"] },
    alt: { type: String, required: false },
  },
};
