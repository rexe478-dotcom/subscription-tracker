---
name: notifications-engineering
description: Builds reliable server-side renewal and trial reminders through push and email.
---

# Notifications Engineering Skill

1. Read `docs/NOTIFICATIONS.md`, `docs/DATABASE.md` and `docs/SECURITY.md`.
2. Never use browser timers as the scheduler.
3. Use scheduled server-side processing with atomic job claiming and unique idempotency keys.
4. Recalculate jobs when dates, status or preferences change.
5. Exclude cancelled/expired records and respect channel preferences.
6. Implement bounded retries and delivery history.
7. Keep VAPID private keys and email API keys server-side.
8. Test duplicate invocations, retries, timezone changes and permission denial.
