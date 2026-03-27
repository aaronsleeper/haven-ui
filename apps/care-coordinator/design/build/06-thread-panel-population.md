# Task 06: Thread Panel Population

## Scope
App only

## Context
Populates the thread panel with a realistic care plan approval thread for "Maria Garcia" — the active queue item. Shows all 5 message types culminating in a pending approval card.

## Prerequisites
- Task 02 (thread message components in pattern library)
- Task 03 (approval card in pattern library)
- Task 04 (three-panel shell exists)

## Files to Read First
- `apps/care-coordinator/index.html` — current shell
- `pattern-library/components/thread-msg-system.html` — copy
- `pattern-library/components/thread-msg-tool-call.html` — copy
- `pattern-library/components/thread-msg-human.html` — copy
- `pattern-library/components/thread-msg-response.html` — copy
- `pattern-library/components/thread-approval-card.html` — copy
- `apps/care-coordinator/design/wireframes/cc-02-thread-panel.md` — content spec

## Instructions

### Step 1: Update thread header

Replace the placeholder thread header text with the contextual title for the active item:

```html
<span class="text-sm font-semibold text-gray-900 dark:text-white">Thread · Maria Garcia</span>
```

### Step 2: Replace empty state with thread messages

Replace the empty state in the thread scrollable area with the following message sequence. Copy HTML structures from pattern library files. Use realistic Cena Health data:

**Message sequence (chronological, oldest first):**

1. **System message:** "Assessment complete. Initiating care plan." — 9:02am
2. **Tool call:** `◎ read_patient_assessment` → `{ phq9: 7, sdoh: 3, allergies: ["tree nuts"] }` — 9:02am (expandable detail with full JSON payload)
3. **Tool call:** `◎ query_clinical_guidelines` → `ADA nutrition therapy, T2DM with obesity` — 9:02am
4. **Tool call:** `◎ generate_care_plan_draft` → `draft ready, 5 goals, nutrition plan generated` — 9:03am
5. **System message:** "Care plan draft sent to RDN queue." — 9:03am
6. **System message:** "RDN reviewed nutrition section." — 9:45am
7. **Approval response (approved):** "[Dr. Priya M.] Approved nutrition plan — sodium target reduced to 1800mg · 9:47am" (expandable to read-only approval card)
8. **System message:** "BHN review not required (PHQ-9: 7, below threshold)." — 9:47am
9. **System message:** "Care plan ready for coordinator approval." — 9:48am
10. **Approval card (PENDING — THE HERO):** Standard variant with:
    - Header: "Final Approval — Care Plan v1.0"
    - Context: "Care plan draft · Maria Garcia" / "All clinical sections approved · 3 min ago"
    - Summary: 2 goals listed (HbA1c < 8.0%, Weight loss 5-8%)
    - Nutrition summary: "1800 cal/day · <1800mg sodium · Diabetic-appropriate · Nut-free"
    - Downstream effects: "Set patient status to active", "Start meal prescription matching", "Schedule first RDN visit", "Begin AVA check-in calls", "Notify patient — welcome message"
    - Attachment: "1 attachment · View" (the care plan PDF)
    - Actions: Approve (primary), Edit first, Reject with note, Reassign
    - Note field: "Add a note (optional)"

### Step 3: Keep the thread input at the bottom

The input should already be in place from Task 04. Verify it's still visible below the messages.

## Expected Result
- Thread panel shows a realistic 10-message care plan workflow
- Mix of system, tool call, approval response, and pending approval card messages
- Tool calls have expandable detail (Preline collapse)
- Past approval response is expandable to read-only card
- Active approval card is the visual hero — amber background, shadow, full action buttons
- Thread scrolls to show the approval card near the bottom
- Input field remains fixed at bottom

## Verification
- [ ] 10 messages visible in thread panel
- [ ] System messages render as compact, muted lines
- [ ] Tool calls show agent icon, monospace names, expandable detail
- [ ] Approval response shows green checkmark, expandable
- [ ] Active approval card has amber background, shadow, 4 action buttons, note field
- [ ] Approval card downstream effects list is visible
- [ ] Thread input is visible and fixed at bottom
- [ ] Preline collapse works on tool calls and approval response
- [ ] HTML copies from pattern library — not regenerated
- [ ] ANDREY-README.md updated: not applicable
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If the thread doesn't scroll to show the approval card, the scrollable container may need `scroll-behavior: smooth` and initial scroll-to-bottom.
- If Preline collapse IDs conflict, ensure each collapse has a unique ID (e.g., `#tool-detail-1`, `#tool-detail-2`, `#response-detail-1`).
