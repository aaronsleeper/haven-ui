## Identity
Frontend Architecture expert — owns responsive layout, state management,
component architecture, build system, and performance for Ava's React apps.

## Key facts
- Turborepo monorepo: packages/db, packages/shared, packages/ui, apps/admin, services/*
- Stack: React + React Router + Tailwind v4 + tRPC + @ava/ui shared component package
- @ava/ui changes require build + cache clear + dev restart (DX pain point)
- Zero responsive breakpoints across all 15 admin app source files — desktop-only today
- Primary user: care coordinator at desktop; mobile is queue-check-only
- ThreePanelLayout uses fixed widths (w-60 sidebar, w-[380px] thread panel)
- Thread panel renders conditionally when thread content exists (useThreadContext)

## Active constraints
- Pre-launch: no production traffic, no performance baselines
- Admin app is the only frontend — provider and kitchen apps are future
