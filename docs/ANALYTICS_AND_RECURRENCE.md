# Analytics, Currency and Recurrence Rules

## Currency
- Store each subscription's amount and ISO 4217 currency code.
- Store user's preferred default currency separately.
- Group totals by currency in v1.
- Do not add unlike currencies.
- Future FX conversion must display converted status, source, rate and timestamp; never silently overwrite original amount.

## Normalized estimates
Monthly equivalent:
- Weekly: amount × 52 / 12.
- Every two weeks: amount × 26 / 12.
- Monthly: amount.
- Quarterly: amount / 3.
- Every six months: amount / 6.
- Yearly: amount / 12.
- Custom intervals: derive from exact interval and document assumptions.
These are estimates, not necessarily the next amount due. Lifetime/one-time items are excluded from recurring spend.

Annual projection:
- Calculate from expected occurrences within a year or a clearly documented normalized annualization.
- Do not multiply every value by 12 regardless of interval.
- Exclude cancelled/expired items; handle paused items explicitly.

## Date recurrence
- Store event timestamps in UTC where appropriate and preserve user's IANA timezone.
- Use calendar-aware recurrence logic, not fixed 30-day increments for monthly billing.
- Define month-end behaviour (e.g. a renewal on the 31st in a shorter month).
- Test leap years, daylight-saving transitions, timezone changes, custom intervals and trial-to-paid conversion.
- `next_renewal_at` and `end_date` are separate concepts.
- A trial ending can trigger a reminder even if the paid renewal date is not yet confirmed.

## Analytics integrity
- Never fabricate data to fill charts.
- Explain estimates and show empty states when insufficient history exists.
- Provide accessible text summaries for charts.
