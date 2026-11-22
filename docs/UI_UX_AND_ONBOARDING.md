# UI/UX and Onboarding Specification

## Information architecture
Primary sections:
1. Home
2. Subscriptions
3. Calendar
4. Analytics
5. Settings

Mobile: bottom navigation with no more than five primary destinations and a clear Add Subscription action. Desktop: compact sidebar and a content area with deliberate density.

## Main screens
### Home
- Greeting or neutral page heading.
- Upcoming renewal timeline.
- Active subscription count.
- Currency-grouped monthly estimate.
- Trial endings.
- Quick add action.
- Avoid filling the screen with redundant metric cards.

### Subscriptions
- Search and filter.
- Provider catalogue and manual entry.
- Clear status, price/currency, interval and next date.
- Edit and status actions.
- Empty state that explains how to add the first service.

### Add/edit flow
Use progressive disclosure:
1. Select provider or add manually.
2. Enter amount and currency.
3. Choose billing interval.
4. Set start/next renewal date and optional trial dates.
5. Optional category, cancellation URL, notes and reminders.
6. Review and save.
Validate dates and recurrence. Do not overwhelm users with every optional field at once.

### Calendar
- Month view and upcoming list.
- Renewal and trial-end events use distinct labels and visual semantics.
- Selecting a date opens the event list.
- Provide an accessible list alternative to the visual calendar.

### Analytics
- Currency-separated totals.
- Active subscriptions and category breakdown.
- Annual projection with explanation.
- Historical monthly spend only when the data supports it.
- Avoid misleading charts with sparse or fabricated data.

### Settings
- Account, default currency, timezone, notification preferences, export, privacy and account deletion.
- Gmail integration can appear as a disabled “Coming soon” card; no permission request.

## Onboarding
Keep onboarding short and skippable:
1. Welcome: explain the value in one sentence.
2. Add first subscription: catalogue search or manual entry.
3. Explain renewal date and trial date.
4. Explain reminders and request push permission only after the user understands the benefit and chooses to enable it.
5. Offer email reminder setup as a separate channel.
6. Land on the dashboard with a clear next step.

Do not block app access behind push permission. Do not request notification permission immediately on first page load. If denied, explain how to enable it later without nagging.

## Empty and edge states
Design for:
- No subscriptions.
- No upcoming renewals.
- No analytics history yet.
- Notification permission denied or unsupported.
- Offline mode.
- Provider not found.
- Invalid cancellation URL.
- Subscription paused/cancelled/expired.
- Loading, failed save and retry.
- Session expired.

## Cancellation interaction
Show a short disclosure: cancellation happens on the provider's website. Open the external destination, then let the user return and explicitly confirm the status. Never infer cancellation from opening a link.

## Usability rules
- One primary action per screen/section.
- Keep labels explicit; placeholders are not labels.
- Errors appear near the relevant field.
- Confirm destructive actions.
- Do not use fake progress or fabricated analytics.
- Make keyboard focus and screen-reader feedback visible/available.
