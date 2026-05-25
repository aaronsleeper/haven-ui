---
slot: 8
slot-name: content-model
primary-author: Content Strategist
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - ds-binding.md#token-map
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# App-level Content Model

App-wide entities, fields, validators, voice+tone, and copy patterns. Per-surface `strings.md` (slot 14) and `content-model` detail **consume** this. Field-level data shapes that depend on the backend are flagged as **T0.2-deferred** (Andrey) — this models the *content*, not the storage schema.

## Entities (patient-facing)

| Entity | Key fields (content-level) | Notes / OPEN |
|---|---|---|
| **Patient** | preferred name, preferred language (EN/ES; EN-only v1), local time | greeting personalizes on name+time; name-less fallback if not captured |
| **Program** | budget_rule {amount, period, scope}, markup_rule, duration (26wk) | **OPEN B1/B5** — amounts provisional `[VERIFY $200/wk × 26]` |
| **Menu** | week, publish-state, meals[] (7 hot + 7 cold) | G1 entry disabled if unpublished; G12 show all 14 always |
| **Meal** | name, type (hot/cold), price, care-plan-aligned? | G12 agent highlights aligned, hides none |
| **Order / Basket** | week, items[], channel (web/phone/assisted), fulfillment (pickup/delivery), status, edit-window | **OPEN B6** mutable+recalc+audit; **OPEN B9** cutoff |
| **Budget (per week)** | amount available, drawn (multi-channel), remaining | drawdown model (B5); reconciles off-app draws (cap-23); framed *available*, never *spent* |
| **Assessment instance** | instrument (HFIAS/HEI/WHOQOL-HIV BREF/NKQ), timepoint (M0/3/6/9), progress, answers[] | A5 every answer persists; **no-score to patient** (A4) |
| **Dietary recall** | date, food-list[] (qty+timing), pass-state | agent-led structured interview over the list; free-text v1 (C2) |
| **Survey** | satisfaction timepoint (M3/6/9), answers[] | shares assessment runner |
| **Outcome log** | measure (weight/A1C/BP/custom), value, date, in-range? | **OPEN B2** required subset; C3 out-of-range saves + flags, never blocks |
| **Appointment request** | preferred times, reason, status | **OPEN B7** request-only (Path A) v1 |
| **Notification / Message** | type, body, source-surface, read-state | routes into source surface; **OPEN B3** categories; **no clinical detail in push** |
| **Consent** | acknowledged?, timestamp | **OPEN B8** whether a Cena surface exists at all |

## Validators (content-level)

- **No-score invariant** (structural): computed assessment scores never render on a patient surface — only a plain acknowledgement. Enforced in `assessment-confirmation`.
- **Over-budget cart:** hard block on submit; red meter; **no auto-eviction** (G5). Copy notes the overage plainly, no shaming.
- **Empty-cart submit:** disabled — "Add at least one meal to send your order." (G15)
- **Required-item-blank (assessment):** submit disabled + helper text + soft-highlight first blank; **free-text never required** (A8).
- **Out-of-range outcome value:** saves with a gentle confirm, **never blocks**; routes to clinical review (C3).
- **Off-budget displayed figures:** any dollar figure is provisional until B1/B5 — flag `[VERIFY-primary-source]` wherever a number renders.
- **Reading level:** ~5th–6th grade; flag jargon ("assessment battery," "PRO instrument," "drawdown") for plain rephrase.

## Voice + tone (canonical — per-surface strings inherit)

Warm, plain, **second-person, present tense.** Like a person on your care team who knows you and isn't keeping score. Short lines, one idea per line. (Source: `patient-app-home-surface.md` §5 + DESIGN.md §Voice + brand-taste rules.)

**Never:**
- Clinical jargon to the patient.
- Gamification — "streak," "level up," "you're crushing it," completion %, confetti.
- Surveillance phrasing — "we noticed you haven't…", "you've been inactive."
- Guilt / shame — "you're behind," "overdue," red-alert deadline styling.
- Counts/scores/progress-on-people — tiles describe *state of things*, never *state of you*.

**Always:**
- Name the person where known; warm name-less fallback otherwise.
- "Talk to a person" / "Reach your care team" for human escalation — never "Chat with us" / "Ask the bot."
- Plain forward-orientation over obligation ("Your next order opens Friday" not "You must order by Friday").

## Copy patterns (reusable, per-state)

- **Greeting (Home):** state-aware. Caught-up: "Good morning, {name}. You're all set for today." One-item: "Hi {name}. One thing when you have a moment —". Several: "Hi {name}. Let's start with one thing —" (never a count).
- **Surfaced item card:** plain title + one context line + one primary action + quiet "Not now." No due-date red, no count badge.
- **Caught-up affirmation:** "Nothing needs your attention right now." + forward-orient line. NOT "0 tasks," NOT an empty-box illustration.
- **Tile (state of things):** label + value line — "This week's order → Ready to review"; "Food budget → $48 of $60 left this week" (available framing).
- **Assessment invite:** "A few quick questions, when you have a moment." + "It takes about 5 minutes. You can pause anytime." Action "Start" / "Not now."
- **Dietary recall invite:** "Let's go over what you ate yesterday." + "I'll walk you through it — a few questions, that's all." Action "Let's go." (never an empty chat field)
- **Confirmation (no-score):** acknowledgement only — "Thanks, {name}. That's all set." Never a number.
- **Error/empty/loading:** plain, non-alarming; "Talk to a person" reachable.

## Bilingual (cap-19, EN-only v1)

EN-only v1; the ES slot is reserved in the account corner. Copy patterns authored so an ES translation pass slots in later without restructuring. Tone rules are the canonical, translatable part; example strings are intent, not frozen.
