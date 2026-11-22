# Workspace Instructions — Subscription Tracker

This file is the primary project rule set. Read it before changing code.

## Source of truth
- Product scope: `docs/PRD.md` and `docs/SCOPE_AND_ACCEPTANCE.md`
- Visual system: `docs/DESIGN_SYSTEM.md`
- Interaction and onboarding: `docs/UI_UX_AND_ONBOARDING.md`
- Mascot and brand: `docs/MASCOT_AND_BRAND_ASSETS.md`
- Architecture: `docs/ARCHITECTURE.md`
- Database: `docs/DATABASE.md`
- Security: `docs/SECURITY.md`
- Notifications: `docs/NOTIFICATIONS.md`
- PWA and hosting: `docs/PWA_AND_DEPLOYMENT.md`
- Build sequence: `docs/IMPLEMENTATION_PLAN.md`

## Hard constraints
1. Do not add Gmail integration to v1. No Gmail scopes, OAuth, inbox reading or parsing.
2. Do not add payments, premium plans or paywalls to v1.
3. Do not silently combine unlike currencies.
4. Do not claim that the app cancels a subscription. It only opens the provider's official cancellation destination.
5. Do not mark a subscription cancelled merely because a cancellation URL was opened.
6. Never bypass RLS or expose privileged secrets to the browser.
7. Never ship fake buttons, fake charts or fabricated provider information.
8. Never invent provider prices, cancellation URLs, logos or supported currencies. Verify provider metadata and record provenance/last-checked dates.
9. Do not deploy, spend money, connect external accounts or send real notifications without approval.
10. Keep the app personal-account-only in v1 while avoiding schema decisions that make future household sharing impossible.

## Quality bar
- Mobile-first, responsive, accessible and keyboard-operable.
- Premium dark design with restrained accent use and clear hierarchy.
- No generic AI slop: no random gradients, neon, glass panels everywhere, giant rounded cards, gratuitous badges, emoji iconography or template-like screens.
- Every important state must be designed: loading, empty, success, validation, error, offline, permission-denied and destructive confirmation.
- Use typed code, explicit error handling, migrations, tests and documented decisions.
- Use current official documentation. Do not rely on memory for rapidly changing SDK APIs.
- Do not mark a task complete until its acceptance criteria and tests pass.

## Working method
Plan → implement one milestone → run checks → inspect screenshots/responsive states → fix issues → update docs → report completion. Ask only when a decision is truly blocking. Do not rewrite the product direction without approval.
