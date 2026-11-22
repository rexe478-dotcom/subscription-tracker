# Implementation Plan

## Phase 0 — project validation
- Read all requirements and confirm no unresolved blocking decisions.
- Verify current official docs and skill packages.
- Create a concise architecture decision record for any deviations.
- Establish repo, formatting, linting, typecheck and test commands.

## Phase 1 — design foundation
- Define final design tokens and typography.
- Build navigation, layout, form primitives, buttons, dialogs, toasts and status indicators.
- Create responsive dashboard shell and key screen prototypes.
- Review mobile and desktop screenshots before proceeding.
- Do not create final mascot art until concept direction is approved.

## Phase 2 — backend foundation
- Configure Supabase project only after user authorizes account access.
- Create migrations for profiles, providers, subscriptions and notification tables.
- Implement RLS and cross-user isolation tests.
- Configure email/password auth and session handling.
- Seed a small verified provider catalogue.

## Phase 3 — core subscription flows
- Add/edit/list/archive subscriptions.
- Implement provider search and manual provider entry.
- Implement robust recurrence/date logic and tests.
- Add status management and cancellation-link disclosure.

## Phase 4 — dashboard, calendar and analytics
- Upcoming renewal list.
- Calendar month view and event list.
- Currency-grouped totals and normalized estimates.
- Accessible chart alternatives and empty states.

## Phase 5 — reminders
- Push subscription registration.
- Email provider integration.
- Scheduled jobs, idempotency, retries, delivery history and settings.
- Test cancelled, updated, timezone-shifted and trial subscriptions.

## Phase 6 — PWA
- Manifest, icons, service worker, offline shell, install guidance and update flow.
- Test Android, iOS Home Screen and desktop browser behaviour.
- Verify Web Push limitations on real devices.

## Phase 7 — quality and launch readiness
- Automated unit, integration and end-to-end tests.
- Accessibility review.
- Security and RLS review.
- Performance and responsive visual audit.
- Export/deletion verification.
- Deployment checklist, rollback plan and privacy copy.

## Milestone reporting
At the end of each phase, report:
- What was implemented.
- Files changed.
- Tests run and results.
- Screenshots or preview link if available.
- Known limitations.
- Next milestone and any approval needed.
Do not silently skip failed tests.
