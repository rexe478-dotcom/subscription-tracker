# Implementation Log

Record decisions, installed skills, dependency versions, migrations, tests and deployments here.

## Initial state
- Date: 2026-11-22
- Product name: undecided
- Scope: v1 subscription tracker PWA
- External accounts connected: none
- Deployment: not performed
- Paid services: none configured
- Skills: project-specific skills are included in this pack; external skills must be verified and installed with user approval.

## Milestone 0 — Workspace Alignment & Engineering Setup
- **Date**: 2026-11-22
- **Completed**:
  - Restructured folder nesting: elevated files from `subscription_tracker_antigravity_pack/` to root workspace.
  - Initialized project with `package.json`, `pnpm-workspace.yaml`, and `.npmrc`.
  - Configured Vite 6, React 18, TypeScript 5.7, Tailwind CSS 3.4 with precise design system tokens (`#101216` background, `#191D24` surface, `#A5C96B` accent).
  - Configured Vitest test runner with JSDOM and `@testing-library/jest-dom`.
  - Implemented core type definitions in `src/types/index.ts`.
  - Implemented core currency grouping & normalization in `src/lib/currency.ts`.
  - Implemented calendar-aware recurrence and month-end clamping engine in `src/lib/recurrence.ts`.
  - Authored and verified 22 unit tests in `tests/currency.test.ts` and `tests/recurrence.test.ts` (100% pass).
  - Verified clean TypeScript compilation and production build via `pnpm run build`.
- **Artifacts**:
  - `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `vite.config.ts`
  - `src/types/index.ts`, `src/lib/currency.ts`, `src/lib/recurrence.ts`
  - `tests/currency.test.ts`, `tests/recurrence.test.ts`
- **Next Milestone**: Milestone 1 — Design Foundation, Accessible Component Primitives & Mascot Concept.

## Milestone 1 — Design Foundation, Accessible Components & Responsive Prototype
- **Date**: 2026-11-22
- **Completed**:
  - Implemented accessible design system primitives:
    - `Button`: primary, secondary, tertiary, destructive, loading spinner, min-height 44px for touch targets.
    - `Input`: integrated label, helper text, ARIA error descriptions, tabular numerals.
    - `Select`: Radix UI Select with custom dark elevated surface styling and keyboard navigation.
    - `Dialog`: Radix UI Dialog with accessible focus trap, backdrop overlay, responsive layout, and close action.
    - `Badge`: Status indicator with distinct icons and semantic colors for active, free trial, cancellation pending, cancelled, expired, paused.
  - Implemented vector master for mascot "The Swift Familiar" (Kori) in `src/components/mascot/MascotSvg.tsx` with multiple expressive states (`welcome`, `empty`, `reminder`, `celebrate`, `alert`, and 32px `icon`).
  - Implemented responsive `AppShell` with desktop compact sidebar and mobile 5-tab bottom navigation with >= 44x44px touch targets.
  - Built interactive prototype screens:
    - `HomePage`: Multi-currency monthly estimates, urgent renewal list, active free trial alert cards, and empty state with mascot.
    - `SubscriptionsPage`: Directory with live search, status filtering tabs, currency display, and cancellation destination link indicator.
    - `CalendarPage`: Full month grid with distinct markers for renewals vs free-trial expirations, day selection drawer, and month navigation.
    - `AnalyticsPage`: Currency-separated summaries, normalized category distribution bar charts, and transparent calculation methodology.
    - `SettingsPage`: Default currency/timing selectors, independent email and push toggles, disabled "Coming soon" Gmail detection teaser (no scopes/permissions), and data export/account deletion disclosures.
    - `SubscriptionModal`: Add/edit modal with form validation, free-trial date picker, and safe external cancellation disclosure modal.
  - Added component unit tests in `tests/components.test.tsx` (all 29 tests passing).
  - Verified clean TypeScript compilation and production build (`tsc -b && vite build` in 14.47s).
- **Next Milestone**: Milestone 2 — Supabase Backend, Migrations, RLS Security & Authentication.

## Milestone 2 — Supabase Schema, RLS Security & Authentication
- **Date**: 2026-11-22
- **Completed**:
  - Authored database migrations in `supabase/migrations/`:
    - `20261122000001_initial_schema.sql`: Defined `profiles`, `providers`, `subscriptions`, `push_subscriptions`, `notification_jobs`, and `subscription_events` with strict check constraints, foreign keys, and indexes.
    - `20261122000002_row_level_security.sql`: Enabled RLS on all tables, configured multi-tenant policies (`auth.uid() = user_id`), automatic user profile creation trigger (`handle_new_user`), and automatic `updated_at` triggers.
    - `20261122000003_seed_providers.sql`: Seeded verified catalogue with official domains and cancellation destinations (GitHub, Spotify, Netflix, Figma, Notion, Apple, Google, Amazon).
  - Authored cross-user RLS isolation test suite in `supabase/tests/rls_isolation_test.sql` proving:
    - User A can view their subscriptions.
    - User B receives 0 rows when attempting to select, update, or delete User A's data.
    - Forged insertions are blocked by RLS policies.
    - Anonymous users receive 0 rows.
  - Implemented typed Supabase client with environment variable detection and fallback in `src/lib/supabase.ts` and `src/vite-env.d.ts`.
  - Created `.env.example` documenting client vs server-side secrets.
  - Implemented `AuthProvider` in `src/context/AuthContext.tsx` supporting sign-in, sign-up, password reset, session restore, and instant demo preview.
  - Built `AuthPage` in `src/pages/AuthPage.tsx` with email/password authentication, validation, error handling, and password reset flow.
  - Integrated `AuthProvider` into `App.tsx` with user profile display and sign-out controls.
  - Authored authentication unit tests in `tests/auth.test.tsx` (all 33 tests across 4 suites passing).
  - Verified clean production build (`pnpm run build` passing in 12.84s).
- **Next Milestone**: Milestone 3 — Core Subscription Management, Recurrence Service & Provider Search.

## Milestone 3 — Core Subscription Management, Recurrence Engine & Provider Search
- **Date**: 2026-11-22
- **Completed**:
  - Implemented provider catalogue search utility with alias & category matching in `src/lib/catalogue.ts`.
  - Built `ProviderCombobox` in `src/components/subscriptions/ProviderCombobox.tsx` supporting real-time fuzzy search, verified catalogue selection, and manual provider entry fallback.
  - Implemented strict Zod validation schema in `src/lib/validation.ts` enforcing positive amounts, ISO 4217 currencies, recurrence intervals, valid HTTPS cancellation URLs, and trial date sequencing (`trial_end_at >= trial_start_at`).
  - Integrated `CancellationDisclosureModal` in `src/components/subscriptions/CancellationDisclosureModal.tsx`:
    - Opens verified external cancellation destination in a new context (`noopener,noreferrer`).
    - Explicit disclosure banner informing user that cancellation is controlled exclusively by the provider.
    - Explicit status update buttons ("Mark Pending", "Confirm Cancelled") ensuring that opening a link never modifies status automatically.
  - Updated `SubscriptionModal` with complete validation, trial dates, cancellation flow trigger, and deletion confirmation.
  - Integrated subscription state management and status transitions in `App.tsx`.
  - Authored comprehensive test suite in `tests/subscriptions.test.ts` (all 43 tests across 5 suites passing 100%).
  - Verified clean production build (`tsc -b && vite build` passing in 10.66s).
- **Next Milestone**: Milestone 4 — Dashboard, Calendar & Currency-Grouped Analytics Polish.

## Milestone 4 — Dashboard, Calendar & Currency-Grouped Analytics Polish
- **Date**: 2026-11-22
- **Completed**:
  - Polished `HomePage` with multi-currency summary cards, free-trial warning banner with days remaining, urgent renewal indicators ($\le 48$h with clock icon), and interactive filter chips ("All", "Next 7 Days", "Trials Only").
  - Enhanced `CalendarPage` with view mode toggle ("Month Grid" vs "Chronological Agenda List"), month navigation, "Today" shortcut, distinct visual semantics for renewals vs trial endings, and interactive day detail inspection.
  - Upgraded `AnalyticsPage` with strict multi-currency isolation, normalized monthly equivalents, annual projections, category distribution bars, billing interval breakdown (monthly vs annual vs quarterly spend), and recurrence normalization transparency notes.
  - Confirmed no fabricated historical charts are displayed per hard constraint #7.
  - Authored test suite in `tests/analytics_calendar.test.tsx` testing calendar grid/list toggling, currency isolation, and filter chips.
  - All 47 tests across 6 test suites passing 100%.
  - Verified clean production build (`pnpm run build` passing in 14.21s).
- **Next Milestone**: Milestone 5 — Reminders, Web Push & Transactional Email Subsystem.

## Milestone 5 — Reminders, Web Push & Transactional Email Subsystem
- **Date**: 2026-11-22
- **Completed**:
  - Implemented server-side reminder scheduling & idempotency engine in `src/lib/notifications.ts`:
    - Deterministic idempotency key generator (`{subscription_id}:{event_type}:{channel}:{scheduled_timestamp}`).
    - Configurable lead-time calculation (defaulting to 24 hours prior to renewal or trial expiration).
    - Strict exclusion of `cancelled`, `paused`, `expired`, or `reminder_enabled = false` subscriptions.
  - Implemented client-side Web Push Manager in `src/lib/push.ts`:
    - Browser & platform capability detection (`isPushSupported`).
    - Base64URL to Uint8Array converter for VAPID applicationServerKey.
    - User-permission requesting flow with clear value explanation.
    - Integration with Supabase `push_subscriptions` table for storing endpoints & keys.
  - Authored Supabase Edge Function in `supabase/functions/process-reminders/index.ts`:
    - Scheduled worker claiming pending due jobs transactionally (`status = 'processing'`).
    - Dispatches Web Push via VAPID and transactional emails via transactional email adapter.
    - Handles retries with bounded backoff and records `attempt_count` & `last_error_code`.
  - Updated `SettingsPage` with independent toggles for email and push channels, real permission state display, and iOS Home Screen PWA guidance.
  - Authored test suite in `tests/notifications.test.ts` (all 57 tests across 7 test suites passing 100%).
  - Verified clean production build (`tsc -b && vite build` in 11.75s).
- **Next Milestone**: Milestone 6 — Progressive Web App (PWA) Engine, Manifest & Offline Shell.

## Milestone 6 — Progressive Web App (PWA) Engine, Manifest & Offline Shell
- **Date**: 2026-11-22
- **Completed**:
  - Configured `vite-plugin-pwa` in `vite.config.ts`:
    - Auto-updating service worker lifecycle (`sw.js`).
    - Workbox precaching for all static JS, CSS, HTML, SVG, and web fonts (10 entries precached).
    - Runtime caching: CacheFirst for Google Web Fonts (1-year TTL) and NetworkFirst for Supabase API endpoints (with 5-second network timeout and 1-day offline expiration).
  - Created Web App Manifest with theme color `#101216`, background `#101216`, standalone display mode, and maskable icons.
  - Generated original SVG icons derived from Kori vector master: `public/icon.svg` ($512\times 512\text{px}$) and `public/favicon.svg` ($32\times 32\text{px}$).
  - Updated `index.html` with Apple Touch Icon, apple-mobile-web-app meta tags, and black-translucent status bar styling for iOS PWA.
  - Authored client-side network detection hook `useNetworkStatus` and `OfflineBanner` component in `AppShell` with clear offline messaging that does not falsely imply un-synced data is backed up.
  - Authored Web Push event listener and deep-link notification click handler in `public/sw-push-handler.js`.
  - Authored test suite in `tests/pwa.test.tsx` (all 59 tests across 8 test suites passing 100%).
  - Verified clean production build (`tsc -b && vite build` in 14.71s).
- **Next Milestone**: Milestone 7 — End-to-End QA, Security, Accessibility Audit & Launch Readiness.

## Milestone 7 — End-to-End QA, Security, Accessibility Audit & Launch Readiness
- **Date**: 2026-11-22
- **Completed**:
  - Conducted full audit of all 10 Hard Constraints in `AGENTS.md` (100% compliant):
    1. No Gmail integration, OAuth, or inbox parsing in v1.
    2. No payment systems or paywalls in v1.
    3. No combining of unlike currencies; totals strictly grouped.
    4. Clear external cancellation disclosure stating the provider controls cancellation.
    5. Visiting a cancellation link never marks a subscription cancelled automatically.
    6. Row Level Security strictly enforced; no privileged keys in client bundle.
    7. No fabricated charts, fake buttons, or synthetic trendlines.
    8. Verified provider catalogue with `last_verified_at` provenance dates.
    9. No deployments or paid external resources without explicit authorization.
    10. Personal-account-only model with clean schema for future household expansion.
  - Completed WCAG 2.2 AA accessibility audit:
    - High contrast text (`#F3F4F2` on `#101216` ratio > 15:1).
    - Visible `:focus-visible` ring with 2px accent outline.
    - Touch targets >= 44x44px.
    - Full keyboard navigation across all modals, dropdowns, and calendar cells.
    - Screen-reader labels (`role="status"`, `role="alert"`, `aria-describedby`, `aria-live="polite"`).
  - Authored comprehensive end-to-end integration test suite in `tests/e2e_integration.test.tsx`:
    - Subscription creation, editing, and timeline presentation.
    - External cancellation link safety disclosure and explicit status confirmation.
    - Currency portfolio separation in Analytics.
    - Disabled Gmail teaser validation.
  - Complete test suite: 63 tests passing across 9 test files (100% pass rate).
  - Production build: `tsc -b && vite build` completed in 13.00s with service worker, precache manifest, and icons generated.
- **Status**: Release-one complete and ready for deployment.
