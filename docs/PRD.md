# Product Requirements Document (PRD)

## 1. Vision
Build a global, mobile-first subscription tracker PWA that helps a person track recurring services, understand spending, manage free trials and prepare for renewals with dependable reminders.

## 2. Platforms and audience
- Global consumer audience.
- Installable PWA: Android, iOS and desktop browsers.
- Responsive from small mobile screens through wide desktop.
- English first; structure UI for future localization.

## 3. Accounts and privacy
- Email/password sign-up, sign-in, sign-out, email verification and password reset.
- No Google or Apple social login in v1.
- Each account is personal. Household sharing is not in v1.
- Users can export their own data and delete their account/data through a clearly explained flow.
- Do not request access to bank accounts or email inboxes.

## 4. Subscription management
Users can create a subscription from a searchable provider catalogue or a manual/custom provider.

Fields:
- Provider/catalogue reference or custom provider name.
- Display name (optional override).
- Category.
- Amount and ISO currency code.
- Billing interval: weekly, every two weeks, monthly, quarterly, every six months, yearly, custom interval; lifetime/one-time can be considered if semantics are clear.
- Start date.
- Next renewal date.
- Optional trial start and trial end.
- Optional end date, kept distinct from next renewal date.
- Status: active, free_trial, cancellation_pending, cancelled, expired, paused.
- Optional cancellation URL, notes and reminder preferences.
- Created/updated timestamps.

The user enters their actual price and dates. Catalogue metadata must never silently prefill a regional price as fact.

## 5. Provider catalogue
Catalogue metadata may include:
- Provider name and aliases.
- Category.
- Official website.
- Official logo asset or a safe logo source.
- Official cancellation destination where verified.
- Supported billing intervals/currencies only where verified.
- Brand colour only as optional metadata.
- Source/provenance and `last_verified_at`.

Requirements:
- Include a searchable catalogue of common providers as seed data, plus an `Other / Add manually` path.
- Do not invent cancellation URLs. If uncertain, omit the URL and allow user-supplied URL with validation and clear labelling.
- Provider data must be maintainable without changing user subscription records.
- Provider logo and trademark usage must respect source terms and applicable brand guidelines.

## 6. Calendar and upcoming renewals
- Calendar month view and a clear upcoming-renewals list.
- Show renewal and trial-end events distinctly.
- Filters for active, trial, cancellation pending and other relevant statuses.
- Selecting a date shows its events.
- Time zone handling must be explicit and tested.

## 7. Analytics
- Active subscription count.
- Upcoming renewals.
- Monthly equivalent and annual projection.
- Category/provider breakdown.
- Free-trial count and upcoming trial endings.
- Monthly spending history when enough user data exists.
- Explain calculations and exclude cancelled/expired subscriptions from active spend.
- For non-monthly intervals, calculate normalized estimates using documented recurrence rules.
- Never sum values in different currencies without an explicit conversion feature. In v1, group totals by currency.

## 8. Reminders
- Push and email channels.
- Default reminder: 24 hours before renewal.
- Also support free-trial ending reminders.
- User can enable/disable channels and change lead time.
- Explain that push requires permission and device/browser support; delivery cannot be guaranteed by the app.
- Email reminder should be independent of push permission.
- Avoid duplicate delivery and do not send reminders for cancelled/expired records.

## 9. Cancellation support
- Display a cancellation action only when a verified or user-supplied destination exists.
- Open the destination safely in a new context where appropriate.
- Clearly state that the provider controls cancellation.
- Opening the link must not update status.
- User confirms when status changes to cancellation_pending or cancelled.
- Keep a clear audit/history of user status changes.

## 10. Gmail integration (future)
- Not part of v1.
- No Gmail OAuth, Gmail API, inbox access or email scanning in v1.
- Optional teaser: “Email detection — coming soon” with no permission request.
- Future implementation requires a separate privacy review, minimum necessary scopes, explicit consent and deletion controls.

## 11. Business model
- Free-first launch.
- No billing integration, paid plan or paywall in v1.
- Architecture may leave room for future premium features, but do not build monetisation infrastructure now.

## 12. Non-goals
- Bank account linking or transaction scraping.
- Automatic cancellation.
- Gmail detection.
- Household/team sharing.
- Native mobile app binaries.
- Payments and premium tiers.
- Foreign-exchange conversion in v1.

## 13. Success measures
- New user can create an account and add first subscription without assistance.
- User can identify next renewal and trial-end date quickly.
- Reminder scheduling is correct and idempotent.
- No cross-user data exposure.
- Calendar, analytics and currency totals are accurate.
- Core experience works at mobile and desktop breakpoints.
