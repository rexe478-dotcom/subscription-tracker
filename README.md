# Subscription Tracker — Google Antigravity Project Pack

This pack is the product and engineering source of truth for building the first release of a global subscription-management PWA.

## Start here
1. Open this folder as the workspace in Google Antigravity.
2. Read `AGENTS.md` and `docs/PRD.md`.
3. Paste the prompt in `ANTIGRAVITY_START_PROMPT.md` into Antigravity.
4. Ask Antigravity to inspect the project pack and report its plan before making large changes.
5. Let it implement in small milestones and verify each milestone before proceeding.

## What is included
- Product brief, PRD, scope and acceptance criteria.
- Brand and design direction, design tokens, UI flows and onboarding.
- Frontend, backend, database, security, PWA, notifications and hosting architecture.
- Mascot and illustration brief.
- QA, accessibility, implementation and release plans.
- Workspace rules, specialist agent role definitions and project-specific Agent Skills.

## Decisions already established
- Global audience; Android, iOS and desktop via PWA.
- Premium dark visual direction, with an accessible light theme as a later/optional enhancement.
- React + TypeScript + Vite frontend.
- Supabase Auth + Postgres + RLS + Edge Functions + Cron backend.
- Email/password authentication; no social sign-in in v1.
- Push and email reminders, normally 24 hours before renewal.
- Provider catalogue and manual subscription entry.
- Per-subscription currencies plus a user-selected default display currency. Never silently add unlike currencies.
- Calendar, analytics, free-trial tracking and data export.
- Gmail integration is explicitly later/coming soon. No Gmail OAuth, scopes or inbox scanning in v1.
- Free-first launch; no payment/paywall implementation in v1.
- Personal accounts only in v1; keep schema extensible for household sharing later.
- Product name is not final. Use a neutral internal placeholder; do not invent a public brand name.

## Important
The suggested palette and stack are a starting specification, not permission to ignore feasibility or current documentation. Verify current package versions, hosting limits, provider terms, browser support and Supabase pricing before committing to implementation choices. Do not create external accounts, deploy, incur costs, or expose secrets without explicit user approval.
