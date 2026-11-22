# Reminder and Notification System

## Behaviour
- Default renewal reminder: 24 hours before next renewal.
- Support trial-ending reminders.
- User can enable/disable push and email independently.
- User can adjust lead time.
- Notification text should identify the service, amount/currency where appropriate, and due date without exposing unnecessary sensitive data on lock screens.

## Scheduling architecture
Do not rely on browser timers. Use server-side scheduling:
1. Subscription create/update triggers recalculation of future reminder jobs.
2. Supabase Cron invokes a protected Edge Function on a regular schedule.
3. The function claims due jobs safely, processes them and records outcomes.
4. Push delivery uses Web Push with VAPID; email uses a verified transactional provider.
5. Jobs are idempotent and retryable with bounded backoff.
6. Failed or expired push endpoints are disabled after appropriate response handling.

## Idempotency and race conditions
- Unique idempotency key should include subscription, event type, channel, scheduled timestamp and relevant version.
- Claim jobs transactionally so concurrent invocations do not send duplicates.
- If renewal date, status or reminder settings change, cancel/rebuild future pending jobs.
- Never send for cancelled, expired or disabled reminders.
- Record attempt count and delivery status.
- Avoid retry storms and respect provider rate limits.

## Permissions and platform support
- Ask for push permission only after explaining the value and user action.
- Push permission is optional; email can still work.
- Web Push on iOS requires an installed Home Screen web app on supported iOS versions; support and behaviour vary by OS/browser.
- Explain limitations and test real devices.
- A notification is best-effort, not a guaranteed delivery contract.

## Email
- Verify sender domain and provider terms.
- Use concise transactional templates with an app deep link.
- Provide unsubscribe/notification preference controls appropriate to transactional notification requirements and applicable law.
- Do not send real emails during development without explicit approval.
