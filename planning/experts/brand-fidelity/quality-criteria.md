# Quality Criteria

## A slice that "feels like Haven" has

- [ ] Page background `stone/50` (not white)
- [ ] Shell container with 3px `stone/150` outer border + `border-radius/md`
- [ ] Panes translucent white over stone
- [ ] Cards on white or `stone/100` — no visible shadow at rest
- [ ] Lora for headings, Inter for body, JetBrains Mono for code
- [ ] `font-feature-settings` canonical string applied globally to Inter
- [ ] Typography tokens from Figma (Display, Heading, Body, Utility families)
- [ ] Primary teal (`teal/700`) only on user-commits that change state
- [ ] Advancement buttons (Next, Continue-to-next-step) are secondary stone
- [ ] Active nav state via Inter **Bold** weight, not bg color
- [ ] Warm shadows (`rgba(4,3,1,n)`) — not pure black
- [ ] `elevation/01`–`/05` tokens for floating surfaces — not ad-hoc shadow compositions
- [ ] If chat is in scope: Ava avatar in chat (44px), dot-sparkle leading indicator on Ava messages, bordered bubble on user messages
- [ ] If agent represents itself outside chat: Ava avatar attribution on action citations
- [ ] Cena logo only in nav header — not mixed with Ava
- [ ] Copy reads as warm-specific-observational — not clinical, not generic
- [ ] `data-density="comfortable"` as the parent or default
- [ ] Measurement tokens snap to Tailwind 4px scale (`p-4`, `gap-2`, `m-6`, etc.)

## A review worth shipping has

- [ ] Scorecard filled with per-dimension rationale, not just a total
- [ ] Every finding ties to a file path / line / Figma frame
- [ ] Required changes are unambiguous — a junior engineer could execute without asking
- [ ] Optional polish flagged separately from required changes
- [ ] DESIGN.md references are section-specific (not just "per DESIGN.md")
- [ ] No generic statements like "make it more Haven" — every finding is specific

## Review verdict calibration

Calibration gets tracked in retro-log.md. Every 5 slices, check:

- Is the 7/10 ship threshold producing slices Aaron would sign off on?
- Are "iterate" calls converging after one pass, or creating loops?
- Are "block" calls catching real failures, or being used for minor polish?

Adjust thresholds only after retro-log analysis, not in-the-moment.
