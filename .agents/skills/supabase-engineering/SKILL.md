---
name: supabase-engineering
description: Implements Supabase Auth, Edge Functions, migrations and secure client access for this project.
---

# Supabase Engineering Skill

1. Use the official Supabase Agent Skill and current official docs for Supabase tasks.
2. Read `docs/ARCHITECTURE.md`, `docs/DATABASE.md` and `docs/SECURITY.md`.
3. Use migrations committed to source control.
4. Enable and test RLS on every user-owned table.
5. Derive identity from verified auth context, not client-supplied user IDs.
6. Keep service-role and provider secrets server-side.
7. Use Edge Functions for privileged operations and validate every request.
8. Test auth, RLS and cross-user isolation.
