// Generated from QueueItemProps by generate-markdoc-schemas.ts — do not edit by hand.
//
// Unsupported props flagged — component requires slotModel: 'manual' in registry.json
// until these props are redesigned or removed from the Markdoc-authored surface:
//   - onClick: function prop cannot round-trip through Markdoc (type: () => void)

export const queueItem = {
  render: 'QueueItem',
  attributes: {
    urgency: { type: String, required: true, matches: ["urgent", "attention", "info"] },
    active: { type: Boolean, required: false, default: false },
    name: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    time: { type: String, required: true },
    sla: { type: Object, required: false },
    className: { type: String, required: false },
  },
};
