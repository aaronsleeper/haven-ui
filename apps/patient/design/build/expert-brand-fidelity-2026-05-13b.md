# Brand Fidelity verdict — Cena patient app desktop ≥lg, pre-Dieckhaus demo (May 22, 2026)

**Reviewer:** Brand Fidelity expert
**Date:** 2026-05-13 (second pass, post-amendment cycle)
**Mode:** unprimed, evidence-grounded
**Viewport scope:** desktop ≥lg (Dieckhaus demo target)
**Prior verdict:** `apps/patient/design/build/expert-brand-fidelity-2026-05-13.md` (Q1 + Q2 framing); Q1 was settled by Aaron in favor of KEEP (patient teal, care team sand)

## Framing

The demo is a brand moment — Dieckhaus is the first paying client, the audience is clinical, and Cena is treating it as a calibration event for Haven's institutional voice. My job here is to call what would land cleanly and what would read as off-brand to a careful viewer. I am not relitigating Q1 (patient-as-protagonist register is settled). I am scoring against §Voice, §Button brand-taste, §Brand-expression, color discipline, hierarchy, and the demo arc.

## Per-surface verdicts

| Surface | Verdict | Score | Notes |
|---|---|---|---|
| Dashboard | **ship with notes** | 8/10 | GAD-7 done-state lands warmly; Sarah preview reads specific; one teal-discipline ambient observation |
| Messages | **ship — headline beat works** | 8/10 | Sarah's amended copy clears the §Voice observational-warmth bar; reply moment lands; one Send-button concern |
| Care | **ship** | 9/10 | "Your nutrition & wellness plan" + MNT-aligned goals read calmly; section composition is on-brand |
| Meals | **ship** | 8/10 | Wed/Thu swap names + Diabetic-friendly tags read coherent; banner alert is utility-flat, acceptable |
| My Health | **ship** | 8/10 | Trend-card composition restrained; sparklines are the right visual register for Tufte/Haven |
| Settings | **ship** | 9/10 | Segmented control + toggles + kv-table all on-brand; sign-out dialog teal is correctly placed |
| Onboarding (Welcome) | **iterate** | 6/10 | Continue/Continuar is `btn-primary` — advancement-on-teal violates §Button brand-taste |
| Onboarding (Consent A/B/C) | **iterate** | 6/10 | Same Continue-teal issue; Stage C "Continue" is the only stage where teal could arguably commit |
| Onboarding (Preferences) | **iterate** | 6/10 | "All done / Listo" is `btn-primary`; acceptable IF framed as commit; needs explicit ruling |
| GAD-7 Start | **ship** | 9/10 | CommitAction "Start" lands as a deliberate commit; centered composition is calm |
| GAD-7 Question | **iterate** | 6/10 | `Next` (Q1–Q6) is teal; same advancement-on-teal pattern as onboarding. Q7 "Submit" is correctly teal. |
| GAD-7 Complete | **ship** | 9/10 | Warm thank-you, no score-shown discipline preserved, "Done" via CommitAction |
| App shell ≥lg | **ship** | 9/10 | `.app-shell` sand-200 ground + `.app-shell-frame` sand-50 floating page + `.app-shell-sidebar` sand-100 chrome reads as Haven at a glance |
| Demo data layer | **ship** | 9/10 | Maria Rivera persona consistent; PENDING markers handled cleanly; Sarah's amended copy carries observational warmth |

**Verdict totals: 9 ship, 4 iterate, 0 block.**

## Scorecard (overall app)

| Dimension | Score | Rationale |
|---|---|---|
| D1 — Brand voice | 2/2 | Sarah's amended message ("Thanks for telling me, Maria. I shifted Wednesday to Sopa de Lentejas with vegetables — easier on digestion and still on plan…") clears the §Voice "warm + specific + observational" bar. Reference to the patient's earlier swap request is the §Voice exemplar in practice. The dashboard subline shifts contextually based on check-in completion ("Your check-in is in. Your care team will follow up if anything stands out.") — observational not performative. Multiple lines across Care, Meals, Settings preserve plain-language registers. |
| D2 — Visual hierarchy | 2/2 | App-shell composition is correct: sand-200 ground, sand-50 floating frame, sand-100 sidebar chrome, white cards. Pages are never pure white. `.app-shell-content` constrains the inner column to 48rem, preserving the phone-shape posture even at desktop. Cards use `rounded-md` (11px), no pill-shape drift on container surfaces. |
| D3 — Typography expression | 2/2 | `.page-title` uses Lora (Heading/01 27.65px) consistently. `.card-title` is Lora Medium. Body falls to Source Sans 3. No regression to sans-only headings. Font-feature settings inherited from app-level setup. |
| D4 — Primary teal discipline | **1/2** | The deduction: `btn-primary` is used on **advancement** buttons throughout onboarding (Welcome Continue, Consent A/B Continue, Preferences "All done") AND on GAD-7 Question Next (Q1–Q6). §Button brand-taste explicitly reserves teal for "commitments that change state — 'Book my visit,' 'Schedule Appointment,' 'Continue' in a destructive dialog, 'Send' in chat." Form advancement should be **secondary** stone. This is the single most consequential brand finding — and it's not a one-line fix because it touches every linear-flow CTA. Detail in F4 below. |
| D5 — Surface palette | 2/2 | Page bg is sand-50 (via frame inheritance); cards on white; chrome on sand-100. No `bg-white` page leaks observed. Translucent panes correctly reserved for the agentic shell (not used here — patient app uses the non-agentic app-shell). |

**Total: 9/10** — ship with iterate notes on D4 onboarding+assessment CTAs.

## Findings

### F1 — Brand-moment assessment of the message-reply demo headline (high priority for demo)

**The reply moment lands.** Sarah's amended message demonstrates §Voice observational-warmth: she references Maria's specific prior swap request ("Thanks for telling me, Maria"), names the actual swap she made ("Sopa de Lentejas with vegetables"), explains the clinical reasoning in plain language ("easier on digestion and still on plan"), and points forward with a soft deadline ("confirm by Wednesday at 5pm, or it'll auto-confirm"). This is the institution being present and specific — the §Voice register working live.

**What lands in the demo arc:**
- Cold-start: Maria's dashboard shows Sarah K., Care Coordinator with a "New" pill. Brand signal: institution is reaching the patient (sender label + pill carry the moment, even though the bubble register settled patient-teal).
- Navigation to Messages: the thread shows Maria's earlier specific question ("I had to swap the Wednesday meal last week because the noodles were hard to digest…") above Sarah's specific response. The specificity rhymes — observational warmth on both sides.
- Reply moment: textarea expands, patient types, Send fires teal. This is the §Button-brand-taste teal commit ("'Send' in chat" is named explicitly in the rule). The moment is *exactly* what teal is reserved for.
- Persistence: localStorage keeps the reply visible on demo refresh — no fragility cost during the live demo.

**One caveat on the headline beat.** The Send button is `btn-primary btn-sm` (teal-600). The outgoing patient bubble (per Aaron's Q1 settled framing) is also teal — `.message-bubble-out` is `bg-primary-500`. Two teals one tone apart, side-by-side at the commit moment. Brand-fidelity reading: the *thread is already teal* by the time the Send fires; the commit moment competes for visual weight with the bubble it just produced. This is the structural cost of patient-teal-as-protagonist that I argued against in Q1. Aaron settled it; I'm noting the residual cost so the demo team knows where the visual rhythm is softest. It still lands — but a viewer who's not already invested in the framing will read the Send-fires-teal moment as "another teal thing in a teal thread" rather than "the commit moment teal was reserved for."

**Confidence: high.** The reply moment is the strongest beat the demo has. The bubble-register cost is real but secondary; the §Voice payload (Sarah's copy) is doing the heavy brand work and it's pulling its weight.

### F2 — Onboarding + GAD-7 advancement buttons violate §Button brand-taste (DESIGN.md §Component archetypes → Button)

**File: `apps/patient/src/screens/onboarding/welcome.tsx:178`** — Continue is `btn-primary btn-block`.
**File: `apps/patient/src/screens/onboarding/consent.tsx:215`** — "I agree" (Stage A, B) + "Continue" (Stage C) all use `btn-primary btn-block`.
**File: `apps/patient/src/screens/onboarding/preferences.tsx:262`** — "All done / Listo" uses `btn-primary btn-block`.
**File: `apps/patient/src/screens/gad-7/question.tsx:133`** — Next (Q1–Q6) and Submit (Q7) both use `btn-primary btn-block`.

**Why this is a finding:** DESIGN.md §Component archetypes → Button → Brand-taste rule: *"primary teal is reserved for user commitments that change state — 'Book my visit,' 'Schedule Appointment,' 'Continue' in a destructive dialog, 'Send' in chat. … Advancement through forms (Next) and navigation (Previous) is secondary, not primary. The teal earns its weight by being used sparingly."*

The Dieckhaus demo will land on the dashboard, but the onboarding flow is *the entry path for any new clinician evaluating the app*. If Dieckhaus or his team walks the onboarding to sanity-check the patient experience, four screens in a row will fire teal on every advancement, draining the reserve. By the time the patient reaches the dashboard and sees the Sarah/New-pill teal accent or fires the message Send, teal has lost its "this is a commitment" charge.

**Severity: high** — affects D4 by 1 point and dilutes the teal commit signal across the demo arc. Not blocking ship for Friday because the demo doesn't *require* walking onboarding, but the onboarding screens are visible to a curious clinician.

**Confidence: high (9/10).** DESIGN.md is unambiguous on this point. The retro-log precedent (Patch 13, 2026-04-21) reinforces it: when the question was teal vs sand on a generic button rule, sand won. The exception in Patch 8 (active-state edges) names a narrow carve-out for *selection commits*, not advancement.

**Required changes (iterate):**
- Onboarding Continue / "I agree" / Continue / All done — swap `btn-primary` → `btn-secondary` (sand-100 fill, border/default, on-light text). The Stage A "I agree" is arguably a commit (consent change-of-state); brand-taste reading: the *act of completing all three consents* is the commit, not each stage. Keep the per-stage advancement as secondary; only consider teal on a final "Finish onboarding" action if one is introduced. Given the current flow ends on Preferences with "All done," that *could* legitimately be teal as "complete account setup, change account state from pre-onboarded to onboarded." The interpretation is defensible either way; my recommendation is to demote all four to secondary and keep teal off this flow entirely — the consistency reads cleaner than the surgical exception.
- GAD-7 Question Next (Q1–Q6) — same demote to `btn-secondary`. Submit (Q7) — keep `btn-primary` because submitting an assessment IS a state-change commit. The button needs a conditional class: `className={isLast ? 'btn-primary btn-block' : 'btn-secondary btn-block'}`.

This is two small edits (onboarding step components, GAD-7 question) but it's not a one-liner because there are five files. Hence iterate, not ship-with-note.

### F3 — Message-bubble-out radius (`rounded-2xl` = 16px) drifts from §Card-canonical-radius (11px)

**File: `packages/design-system/src/styles/tokens/components.css:6112–6116`** — `.message-bubble-out` uses `rounded-2xl px-4 py-2` with `border-bottom-right-radius: 4px` tail. Tailwind's `rounded-2xl` = 1rem = 16px. DESIGN.md §Card-canonical-radius prescribes `border-radius/md` (11px) for chat bubbles explicitly: *"This includes every named card type in this spec — Ava recommended-content card, **user chat bubble**, floating tip / coach-mark card, …"*

**Severity: low.** The visual difference between 11px and 16px on a chat bubble is sub-perceptual at the bubble's typical height; the iMessage-tail asymmetry (4px on one corner) carries the chat-archetype reading more than the base radius does. The `conform:radius-pill` gate doesn't fire because `rounded-2xl` is 16px, not the 54px pill it's designed to catch. But the §Card-canonical-radius rule is canonical and explicit, and the divergence is a debt item — when the conform-radius gate widens to enforce all named-card radii, this rule will fail.

**Confidence: medium-high (7/10).** DESIGN.md is explicit; the visual cost is small but the spec violation is real.

**Required changes (optional polish, not ship-blocking):**
- `.message-bubble-out` and `.message-bubble-in` — swap `rounded-2xl` → `rounded-md`, preserve the tail asymmetry override. Two lines, one file.

### F4 — Sidebar nav active state uses teal-700 color + bold weight (§Voice line authorized; calibration note)

**File: `packages/design-system/src/styles/tokens/components.css:10200–10203`** — `.nav-item.active` sets `color: var(--color-teal-700); @apply font-bold;`.

**Why this is a finding (informational, not a violation):** DESIGN.md §Voice brand-taste rule says *"Active nav state = Source Sans 3 Bold, not a background color. Weight change carries the signal; color stays consistent with the rest of the nav."* The CSS adds bold weight (correct) AND a teal-700 color shift (additional signal). The rule doesn't forbid the color, but the rule's intent ("weight carries the signal; color stays consistent") suggests the color shift may be over-doing it.

**Severity: low — calibration question, not a defect.** The teal-on-active-row precedent from Patch 8 (active-state edges legal under teal-discipline because selection-of-record is a commit) supports teal on the active nav item. Nav active state IS selection-of-record. The current treatment is defensible.

**Confidence: medium (5/10).** I'm naming this so the brand-fidelity-expert state isn't silently absorbing the addition. If Aaron's preference is "weight only," demote the color back to the inherited sand-700.

**Recommendation:** no change; document the precedent in retro-log if Aaron concurs.

### F5 — `material-symbols-outlined` is the canonical icon font (DESIGN.md is stale)

**Files:** Sidebar, BottomNav, OfflineBanner, Dashboard, Messages, Care, Meals, MyHealth, Settings, all onboarding screens, all GAD-7 screens, all use `<span className="material-symbols-outlined">`.

**Why this is a finding:** DESIGN.md §Iconography line 264 still names FontAwesome Pro v7.1.0 as canonical. Vault project memory (`project_haven_ui_icon_canon`) records the directive to switch to Material Design Icons (no FA Pro license from Andrey). The code has converged on Material Symbols Outlined (consistent across every patient surface). DESIGN.md is the lagging document.

**Severity: none for brand-fidelity; this is a DESIGN.md delta proposal.** The icon system is consistent across the app; the icons read calmly; the variable-font axes are tuned (FILL=0, wght=400, GRAD=0, opsz=24). No brand-fidelity defect.

**Confidence: high (9/10).** This is a DESIGN.md update obligation, not a code finding. Already overdue.

**Required change (DESIGN.md edit, not code):**
- §Iconography — update to name Material Symbols Outlined as canonical; document the variable-font axis tuning; preserve historical FA Pro reference in §Change log.

### F6 — Welcome affirmation reads warmly ("Looks good" / "Passwords match")

**File: `apps/patient/src/screens/onboarding/welcome.tsx:103–113, 159–167`** — affirmative state on password criteria-met uses `text-success-600` with check icon + "Looks good" / "Bien" / "Passwords match" / "Coinciden."

**Why this is a finding (positive):** This is observational-warmth in micro. Earlier draft would have left the field neutral on success; the explicit affirmative lift matches §Voice exemplar *"Your A1C dropped like it's hot"* register at a smaller scale. The success-green color keeps it off the teal-discipline channel.

**Severity: none — confidence-bump.** Worth flagging because the small lifts compound across the onboarding flow.

**Confidence: high.**

## Punch list (ordered by severity)

1. **[iterate, high]** Demote advancement buttons from `btn-primary` to `btn-secondary` across onboarding (Welcome, Consent A/B/C, Preferences) and GAD-7 Question (Next for Q1–Q6). Keep `btn-primary` on GAD-7 Submit (Q7), Meals "Confirm my meals," Messages Send, Settings sign-out dialog. Files: `apps/patient/src/screens/onboarding/{welcome,consent,preferences}.tsx`, `apps/patient/src/screens/gad-7/question.tsx`. Severity bumped by the Dieckhaus-first-paying-client framing — these are visible if anyone walks the patient flow.
2. **[ship-with-note, medium]** Message-reply demo headline: Sarah's amended copy carries the §Voice payload; the bubble-register cost from Q1 is real but the moment still lands. Demo team should know the Send-fires-teal moment competes visually with the teal thread above it.
3. **[optional polish, low]** `.message-bubble-{in,out}` radius — swap `rounded-2xl` to `rounded-md` per §Card-canonical-radius. Defer to post-demo unless touched.
4. **[DESIGN.md delta, none-for-code]** §Iconography — name Material Symbols Outlined as canonical (project memory `project_haven_ui_icon_canon` directive already settled this). DESIGN.md is the lagging doc.
5. **[calibration note]** Sidebar `.nav-item.active` adds teal-700 color on top of bold weight; §Voice rule names weight as the signal carrier. Treatment is defensible under Patch-8 selection-of-record precedent. Recommend leaving as-is; document in retro-log.
6. **[confidence-bump]** Welcome affirmative "Looks good" / "Passwords match" states clear §Voice observational-warmth bar at micro-interaction scale. Worth flagging for the pattern (not for a change).

## Brand-moment assessment — the message-reply Send

Aaron flagged this as the demo headline. Brand-fidelity reading:

**The moment lands.** Sarah's amended copy is the strongest §Voice payload in the demo — specific, observational, references the patient's prior action, explains clinical reasoning in plain language, names a soft deadline without urgency-pressure. The patient's reply textarea expansion is clean; Send fires teal at the brand-taste-rule-named moment ("'Send' in chat"). Persistence via localStorage means the demo can refresh without the moment evaporating.

**Residual brand cost from Q1 settled register.** The thread is already teal (patient-protagonist) by the time Send fires. The commit-moment teal competes visually with the bubble-just-produced teal. This is the structural cost Aaron accepted when he kept the original register. The moment still works because the §Voice payload is doing the heavy brand lifting, but a brand-attentive viewer will read the Send button as "another teal thing" not "the teal moment." If the demo can spotlight the Send button — slight delay before firing, micro-celebration on send-complete, screen attention narrowing — the moment can re-claim the brand register. That's choreography, not brand-fidelity.

**Single highest-leverage improvement for the demo:** dim or visually quiet the thread *before* Send fires — make the Send button the loudest thing on screen at the commit moment. This converts the teal-thread-already-loud cost into a contrast advantage (quiet thread → loud commit). UX/design-lead call, not brand-fidelity.

**Confidence: high (8/10) that the moment lands as-is. Medium-high (7/10) that it lands *better* than the pre-amendment state**, which I assessed at "specific not generic" confidence-bump territory.

## Defer to other experts

- **Pattern-library steward:** confirm the message-bubble radius drift (`rounded-2xl` vs `rounded-md`) is on the conform-radius-gate roadmap, not just a one-off.
- **ux-design-lead:** the F2 advancement-button demote is a touch-target / hierarchy question as much as a brand-fidelity one; confirm secondary-button is visually distinct enough on the sticky-footer composition to read as "this is the next step."
- **Accessibility:** if F2 demote ships, re-verify the `btn-secondary` text contrast on sand-100 fill clears WCAG at the button's text size.

## DESIGN.md deltas surfaced

1. **§Iconography update** — Material Symbols Outlined replaces FontAwesome Pro v7.1.0 as canonical (per `project_haven_ui_icon_canon` directive); preserve historical reference in §Change log.
2. **§Voice → Active nav state** — clarify whether teal-color shift on `.nav-item.active` is authorized under Patch-8 selection-of-record precedent or whether the rule means weight-only. Current code adds color; retro-log doesn't explicitly bless it for nav.

## Calibration note

This is the patient app's first formal brand-fidelity verdict at the shipped-app level (prior verdicts have been slice-level). The findings cluster heavily on D4 (teal discipline), specifically on advancement-button reuse of `btn-primary`. The pattern is twice-observed across patient surfaces (onboarding + GAD-7 question). If a third surface ships with the same advancement-teal pattern, this calibrates as a system-level expectation rather than a per-slice oversight — propose a `conform:button-role` gate that flags `btn-primary` on buttons whose label matches `Next|Continue|Continuar` regex with no surrounding destructive-confirm context.

The §Voice findings cluster positively — Sarah's amended copy, Welcome affirmation, dashboard subline contextual shift, "Your nutrition & wellness plan" — these are all observational-warmth lifts compared to a generic-app baseline. Voice is doing what the brand promises.

---

**Verdict counts:** 9 ship · 4 iterate · 0 block
**Demo readiness for May 22 Dieckhaus:** ready to ship with optional F2 (advancement-button demote) ideally before the demo, mandatorily before any clinician walks the onboarding flow.
