# Testing Strategy

## Unit tests
- Recurrence and month-end logic.
- Leap years and timezone conversions.
- Currency grouping and normalized cost calculations.
- Input validation and status transitions.
- Reminder scheduling/idempotency keys.

## Integration tests
- Auth flows.
- CRUD under RLS.
- Provider catalogue search.
- Subscription update cancels/rebuilds pending reminders.
- Email and push adapters with mocked providers.
- Export and account deletion.

## Security tests
- Two-user RLS isolation.
- Unauthenticated access denied.
- Privileged keys absent from client bundle.
- URL validation.
- Rate limiting and Edge Function authorization.
- Push endpoint handling and secret redaction.

## End-to-end tests
- Sign up → add first subscription → dashboard.
- Add free trial → upcoming trial reminder.
- Edit renewal date → scheduled reminder updated.
- Open cancellation link → return → explicit status confirmation.
- Calendar and analytics across currencies.
- Push denied while email remains enabled.
- Mobile navigation and desktop navigation.

## Visual and accessibility QA
- Mobile widths, tablet and desktop.
- Keyboard-only navigation.
- Screen reader labels and live status.
- Contrast and focus.
- Reduced motion.
- Empty, loading, error, success and offline states.
- No horizontal overflow.
