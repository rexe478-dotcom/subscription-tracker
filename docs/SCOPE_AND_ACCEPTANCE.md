# Scope and Acceptance Criteria

## Release-one feature checklist

### Authentication
- [ ] Email/password sign-up and sign-in.
- [ ] Email verification and password reset.
- [ ] Protected app routes and session restoration.
- [ ] Clear errors, loading states and sign-out.

### Subscriptions
- [ ] Search provider catalogue.
- [ ] Add a custom provider manually.
- [ ] Create, read, update and archive/delete a subscription.
- [ ] Validate amount, currency, dates and billing interval.
- [ ] Distinguish next renewal date from optional end date.
- [ ] Support free trial and trial end.
- [ ] Status changes require explicit user action.

### Overview and calendar
- [ ] Dashboard shows upcoming renewals and key totals.
- [ ] Calendar month view plus upcoming list.
- [ ] Trial events visually distinct from paid renewals.
- [ ] Empty, loading, error and offline states.

### Analytics and currencies
- [ ] Active count, category breakdown and normalized spend estimates.
- [ ] Group totals by currency.
- [ ] No implicit addition of unlike currencies.
- [ ] Explain estimates and recurrence assumptions.

### Notifications
- [ ] User can opt in to push.
- [ ] User can enable email reminders.
- [ ] Default reminder lead time is 24 hours.
- [ ] Trial reminders supported.
- [ ] Server-side scheduling, idempotency, retry and delivery history.
- [ ] Cancelled/expired items are excluded.

### PWA
- [ ] Manifest, icons, service worker and install guidance.
- [ ] HTTPS in production.
- [ ] Offline shell or graceful offline mode.
- [ ] iOS-specific install and notification support explained.
- [ ] Update lifecycle handled without data loss.

### Trust and control
- [ ] Export personal data.
- [ ] Account/data deletion path.
- [ ] Cancellation link is clearly described as external.
- [ ] Gmail teaser has no permission request.

## Definition of done
A feature is done only when it:
1. Meets the relevant acceptance criteria.
2. Has loading, empty, error and success states.
3. Is responsive and keyboard-accessible.
4. Has automated tests appropriate to its risk.
5. Has no placeholder or misleading controls.
6. Has updated documentation where architecture or behaviour changed.
7. Passes lint, typecheck, tests and production build.
