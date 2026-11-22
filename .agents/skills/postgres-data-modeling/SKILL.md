---
name: postgres-data-modeling
description: Designs Postgres schemas, constraints, indexes, migrations and Row Level Security policies.
---

# Postgres Data Modeling Skill

1. Read `docs/DATABASE.md` and `docs/ANALYTICS_AND_RECURRENCE.md`.
2. Normalize provider catalogue data separately from user subscriptions.
3. Use explicit constraints for status, intervals, currencies and positive amounts.
4. Keep next renewal date separate from end date and trial end.
5. Add indexes based on query patterns, not speculation.
6. Design every user-owned table with RLS from the start.
7. Write migration and rollback notes; test with two users.
8. Use official Supabase Postgres best practices.
