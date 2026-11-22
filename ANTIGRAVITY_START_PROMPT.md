# Prompt to give Google Antigravity

You are the lead product engineer and coordinator for this project. Build the subscription-management PWA strictly from this project pack. Treat `AGENTS.md`, `docs/PRD.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, and the other documents under `docs/` as the source of truth. Do not replace the agreed product with a generic dashboard or a generic AI-generated design.

## First action — plan, do not code yet
1. Read the entire project pack, especially `AGENTS.md`, `docs/PRD.md`, `docs/SCOPE_AND_ACCEPTANCE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, and `docs/IMPLEMENTATION_PLAN.md`.
2. Inspect the `.agents/` folder. Identify the available project rules, skills and specialist agents.
3. Verify the external skill repositories and install commands listed in `docs/AGENT_SKILLS_AND_REPOSITORIES.md`. Prefer official, maintained sources. Do not install duplicate or untrusted skills. Ask before installing optional third-party packages or enabling MCP access.
4. Check current official documentation for React, Vite, Supabase, browser PWA/Web Push, Cloudflare Pages and the selected email provider. Record any changed APIs, constraints or pricing assumptions.
5. Return a concise implementation plan, proposed repository structure, risks, dependencies, questions that genuinely block progress, and a milestone checklist. Do not generate the whole app in one pass.

## Non-negotiable product requirements
- Build a global personal subscription tracker for Android, iOS and desktop as an installable PWA.
- React + TypeScript + Vite frontend; Supabase backend (Auth, Postgres, RLS, Edge Functions and scheduled jobs).
- Email/password auth only in v1.
- Users can add services from a searchable provider catalogue or enter a custom provider manually.
- Track subscription price, currency, interval, next renewal, optional trial end, status, category, notes and a verified cancellation destination where available.
- Store each subscription's original currency. Group totals by currency. Never sum different currencies as if they were the same. A future FX conversion must be explicit, dated and sourced.
- Calendar, upcoming renewals, analytics, free-trial tracking and data export are in v1.
- Send push and email reminders, defaulting to 24 hours before renewal. Explain notification permissions and platform limitations honestly.
- Gmail integration is a later feature. In v1 show only a clearly labelled “Coming soon” teaser if useful. Do not request Gmail access, create OAuth scopes or read email.
- Free-first. No subscription payment system or paywall in v1.
- Personal accounts only in v1. Do not implement household sharing yet.
- The app does not cancel subscriptions. A cancellation link opens the provider's official cancellation page. Opening the link does not change status. The user must confirm a status change.
- Product name is undecided. Use an internal placeholder and make branding easy to rename.

## Design requirements
Use `docs/DESIGN_SYSTEM.md` and `docs/UI_UX_AND_ONBOARDING.md` as strict guidance. Premium dark, calm, editorial, highly legible. Start with the provisional tokens in the design document; do not improvise random colours. Avoid gradients, excessive glassmorphism, neon glow, excessive rounded cards, decorative badges, emoji-as-icons, stock/AI-looking food or service imagery, and generic template layouts. Use Lucide icons consistently and genuine provider logos only when their use is permitted. Build a cohesive original illustrated mascot using the brief in `docs/MASCOT_AND_BRAND_ASSETS.md`; do not use a generic robot. Do not use generated art as a substitute for the actual logo/icon source files or for functional UI.

Use responsive, mobile-first layouts. Mobile primary navigation: Home, Subscriptions, Calendar, Analytics, Settings. Desktop should use a deliberate sidebar/topbar layout, not a stretched phone screen. Respect keyboard access, visible focus, screen readers, contrast, reduced motion and touch target sizes.

Motion must be purposeful: ease-out entrances; dropdowns around 150–250 ms; list-row stagger around 30 ms only where it aids scanning; press feedback around scale 0.97; subtle success pulse; no routine bounce. Crossfade icon states with a slight blur only when useful. Respect `prefers-reduced-motion`.

## Engineering requirements
- Use small, reviewable milestones. Do not create placeholder buttons or fake functionality.
- Define and migrate the database before wiring complex screens.
- Enforce Row Level Security for every user-owned table. Test cross-user isolation.
- Never expose Supabase service-role keys, email-provider keys, VAPID private keys or other secrets in browser code.
- Validate inputs at client and server boundaries. Use typed schemas and robust error states.
- Recurrence must correctly handle monthly dates near month-end, leap years, time zones, custom intervals and trial-to-paid transitions.
- Reminder delivery must be idempotent, retryable and auditable. A browser timer is not a reliable scheduler.
- Build automated tests for recurrence, currency grouping, permissions, RLS and notification scheduling.
- Run lint, typecheck, unit tests, build and relevant end-to-end tests before declaring a milestone complete.
- Do not deploy, create paid resources, connect real accounts or send real emails/push notifications without the user's explicit approval.

## Agent coordination
Use the Product/Architecture Lead as the single decision-maker. Delegate bounded tasks to the Design Systems Agent, Frontend Agent, Supabase/Database Agent, PWA/Notifications Agent and QA/Security Agent. Agents must read the same source-of-truth docs, report files changed and tests run, and avoid editing the same files concurrently. The lead resolves conflicts and updates documentation before implementation.

## Expected first response
Do not start coding immediately. First provide:
1. Acknowledgement of the product decisions.
2. The proposed milestones.
3. The skills/repositories you verified and those you recommend installing.
4. Any risks or genuinely blocking questions.
5. A clear statement that Gmail integration and payments are out of v1.
Wait for the user's approval before large-scale implementation.
