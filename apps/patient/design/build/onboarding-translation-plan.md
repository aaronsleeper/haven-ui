# Onboarding Translation Plan — Spark → Haven-ui

**Date:** 2026-05-13
**Source files:** `Lab/cena-health-spark/design/patient-app/wireframes/onb-{01,02,03}-*.md`
**Target files:** `Lab/haven-ui/apps/patient/design/wireframes/onb-{01,02,03}-*.md` (to author next)
**Decisions reflected:** Aaron's Phase 2 approval — spark + translate (Q4); AVA → voice-call reframe (recommended option A: rename to "Voice Call Preferences," keep opt-out concept)

---

## Per-screen translation summary

### onb-01-welcome (welcome + password setup)

| Aspect | Spark source | Haven-ui target |
|---|---|---|
| Route | `/onboarding/welcome` | `/onboarding/welcome` |
| Shell | Mobile, no bottom nav | `shell-pt-mobile` minus bottom-nav (onboarding suppresses persistent nav per spark spec) |
| Header `<h1>` | "Welcome to Cena Health" — Lora large | `.page-title` "Welcome to Cena Health" / "Bienvenida a Cena Health" |
| Subhead | "Your meals and care team are ready. Let's set up your account." | Same. Sand-500 muted. |
| Progress | "Step 1 of 3" | Use `.onb-progress` (PL component shipped) — `aria-label="Step 1 of 3"` |
| Form | Two password inputs (create + confirm) with show/hide toggle | `.field-row` per input + show/hide via `fa-eye` / `fa-eye-slash` icon button; helper text "At least 8 characters" |
| CTA | `.btn-primary` "Continue" full width | `.btn-primary` `.btn-block` "Continue" (disabled until valid match) |

**Open questions to resolve at build:**
- Patient's name in headline ("Welcome, Maria") vs. generic? Recommend personalized when name is available from referral; fallback to generic.
- Care team phone number — who provides? Defer to Vanessa.

### onb-02-consent (three consent stages walked in sequence)

| Aspect | Spark source | Haven-ui target |
|---|---|---|
| Route | `/onboarding/consent` (single route, 3 internal stages) | Same |
| Shell | Mobile, no bottom nav, back chevron after stage 1 | Same |
| Header | Step label uppercase + plain-language headline (Lora) + 2-3 sentence summary | `.page-title` for headline; `text-xs uppercase tracking-wide text-sand-500` for step label |
| Read aloud | `.btn-outline` `fa-volume-high` "Read this aloud" | **Resolved 2026-05-13: defer to post-demo.** Read-aloud button is not rendered in v1; revisit if accessibility review flags. |
| Full text accordion | `hs-accordion` single-item | Same (Preline pattern) |
| Stage 3 (was AVA consent) | "AVA Voice Interaction Consent (opt-out allowed)" with `bg-warning-50` card + 2 radio options | **Reframe — resolved 2026-05-13:** rename to "Voice Call Preferences." Voice calls are **from humans** (care coordinators) for v1; Cena has no agent calling capabilities yet, so AVA branding is dropped entirely. Card copy: "Your care coordinator may call you about appointments, deliveries, or check-ins. You can opt out of voice calls and keep using the app and messages instead." Two radio options: "Yes, calls from my care team are okay" (default) / "No, please don't call me." **Future scope flag:** when AVA voice-calling capability ships, this consent likely needs revisit — patients consented to human voice in v1, not AI voice. Logged in plan as post-demo follow-up. |
| CTA | `.btn-primary` "I agree" (stages 1-2) / "Continue" (stage 3) | Same |

**Open questions to resolve at build:**
- Plain-language summaries for HIPAA + Program agreements — does legal need to pre-approve? Recommend draft + flag for legal review.
- Download-a-copy option — recommend defer to v1.1 (out of scope for demo)

### onb-03-preferences (language + food preferences + comms)

| Aspect | Spark source | Haven-ui target |
|---|---|---|
| Route | `/onboarding/preferences` | Same |
| Shell | Mobile, no bottom nav, back chevron | Same |
| Header `<h1>` | "Let's personalize your experience" — Lora large | `.page-title` |
| Subhead | "You can always update these later." | Same. Sand-500. |
| Language section | `fieldset` + `legend` + 2 radio cards in `.grid-2` | Same — use `radio-label` PL class for card-style radios; immediate UI re-render on selection |
| Food preferences section | `fieldset` + `legend` + 5 visual checkbox cards in `.grid-2` (Latin American, Soul Food, Mediterranean, Asian, No preference) | Same. **Images — resolved 2026-05-13: skip for v1.** Text + icons only. Programmatic or manual sourcing is a later step. |
| Communication section | Contact method (3 radio cards) + Best times (3 checkbox cards) | Same |
| CTA | `.btn-primary` "All done" full width | `.btn-primary` `.btn-block` "All done" |
| Skip behavior | Tapping with nothing selected applies defaults and proceeds | Same |

**Open questions to resolve at build:**
- Food category images — source or skip-at-v1? Recommend skip (text + icons only).
- Dietary restrictions: surface read-only on this screen, or only in Profile? Recommend Profile-only at v1.

---

## Global token replacements (search/replace during translation)

| Spark token | Haven-ui token |
|---|---|
| `text-gray-500` | `text-sand-500` |
| `text-gray-400` | `text-sand-400` |
| `text-gray-300` | `text-sand-300` |
| `text-gray-600` | `text-sand-600` |
| `text-gray-700` | `text-sand-700` |
| `bg-stone-50` | `bg-sand-50` (verify against current `colors.css`) |
| `text-error-600` | `text-error-600` (likely current; verify) |
| `text-primary-600` | `text-primary-600` (current; verify) |
| `bg-warning-50 border border-warning-200` | Same (current Haven tokens) |
| `Inter` font references | `font-sans` (Source Sans 3 per current typography spec) |

Verify each against `packages/design-system/src/styles/tokens/colors.css` before committing the translated wireframes.

---

## Build scope summary

- 3 new wireframes in `apps/patient/design/wireframes/`:
  - `onb-01-welcome.md`
  - `onb-02-consent.md`
  - `onb-03-preferences.md`
- All compose existing PL primitives (no new component ports required if food images skipped)
- Each wireframe declares `shells: [{ name: mobile-shell, pl_shell_version: <current sha256> }]` per haven-ui wireframe contract

## Estimated effort

- Wireframe authoring (haven-ui-ize spark): ~3 hours total (3 screens × ~1 hour each)
- Screen build (after wireframes): ~8-10 hours (4-5 actual screen views composing PL primitives + form state + i18n strings)
- Total onboarding flow: **~1.5 days**

## Sequence

1. Resolve AVA opt-out reframe (confirmed at May 15 meeting)
2. Resolve open questions: food images, read-aloud, plain-language summaries, care team phone number
3. Author 3 haven-ui wireframes from spark sources + this plan
4. Build screens — `apps/patient/src/screens/onboarding/{welcome,consent,preferences}.tsx`
5. Wire route in `App.tsx` — `/onboarding/welcome`, `/onboarding/consent`, `/onboarding/preferences`
6. Bottom-nav suppression: route detection in `App.tsx` (extend existing `ASSESSMENT_PREFIXES` pattern with `/onboarding/`)
