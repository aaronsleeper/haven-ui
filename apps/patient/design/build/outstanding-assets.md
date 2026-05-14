# Outstanding Assets — Dieckhaus Demo (May 22, 2026)

> **Auto-generated** from `apps/patient/src/lib/demo-patient.ts` PENDING map.
> Do not edit by hand — run `pnpm --filter @haven/app-patient pending` to regenerate.

Total outstanding: **8**

## Staff (pending Vanessa)

- **coordinatorName** → `Sarah Kim`
  - Source: Vanessa
  - Note: staff name confirmation (also open in IRB sub-investigator prep)
- **clinicalLeadName** → `Dr. Soto`
  - Source: Vanessa
  - Note: staff name confirmation

## Clinical copy

- **movementGoalEn** → `Walk 20 minutes most days`
  - Source: Vanessa or Dr. Soto
  - Note: clinical-care expert recommends conservative version pending verification for sedentary 52F
  - Alt: `Add 10 minutes of walking after dinner three times a week`
- **movementGoalEs** → `Camine 20 minutos casi todos los días`
  - Source: Vanessa or Dr. Soto
  - Note: clinical-care expert recommends conservative version pending verification for sedentary 52F
  - Alt: `Agregue 10 minutos de caminata después de la cena tres veces a la semana`
- **hivVisibility** → `(not surfaced in patient copy)`
  - Source: Aaron / Vanessa
  - Note: does Dieckhaus need HIV-explicit framing somewhere, or is the ART-metabolic-syndrome framing enough to signal his population?

## Data

- **careTeamPhone** → `(860) 555-1234`
  - Source: Vanessa
  - Note: phone number for onboarding footer + care contact

## Legal (pending legal review)

- **privacyUrl** → `/legal/privacy`
  - Source: legal
  - Note: final URL pending legal review
- **termsUrl** → `/legal/terms`
  - Source: legal
  - Note: final URL pending legal review

## Resolution

When external input arrives:

1. Edit `PENDING[key].value` in `apps/patient/src/lib/demo-patient.ts`.
2. Run `pnpm --filter @haven/app-patient pending` to regenerate this file.
3. (Optional) Remove the entry from `PENDING` and inline the literal at consumer sites once confirmed for ship.
