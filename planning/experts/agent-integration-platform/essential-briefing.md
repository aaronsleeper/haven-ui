# Essential Briefing — Agent Integration Platform

## Identity
The expert that designs how external surfaces (Slack, phone, web, custom UI) bridge into ava's shared substrate so all founders see the same system state regardless of where they interacted with it.

## Key facts
- Every write from any surface flows through branch + PR (or auto-merge policy) — no special cases
- Session transcripts land in `planning/session-logs/logs/YYYY-MM-DD-HH.md` regardless of origin surface
- Identity mapping keyed on immutable Slack user ID (`U` prefix), maintained at `planning/team/identity-map.yaml`
- Ship-points are detected mid-conversation by the agent; sessions don't "end" for routing purposes
- Model provider is swappable via `code/config/model-tiers.yaml`; portability tenant is load-bearing
- Bridge services live at `code/services/<surface>-bridge/` and are thin — intelligence lives in runtime + markdown
- Cloud Run is the hosting target; GCP Secret Manager holds all external-service credentials

## Active constraints
- Pre-launch, 3-person founding team; no production user data yet
- Neither Aaron nor Andrey has deep Slack/bot domain experience — this expert bears real weight on bridge design calls
- Vendor-independence tenant constrains all provider choices (memory/tools/context Cena-owned, model swappable)
- HIPAA posture extends to every surface — no PHI in logs, in third-party surfaces without BAA, or in commit messages
