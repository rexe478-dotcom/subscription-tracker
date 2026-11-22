# Technical Architecture

## Proposed stack
### Frontend
- React + TypeScript + Vite.
- Tailwind CSS with a small customised component system; shadcn/ui/Radix primitives selectively, not as an unmodified visual template.
- Lucide icons.
- Motion for purposeful transitions.
- Rive for mascot animation only if needed and approved.
- Zod for client-side schema validation and shared type-safe validation where practical.
- TanStack Query for server state if the implementation benefits from it; avoid unnecessary state libraries.

### Backend
- Supabase Auth.
- Supabase Postgres.
- Row Level Security on every user-owned table.
- Supabase Edge Functions for privileged server-side tasks.
- Supabase Cron for scheduled reminder processing.
- Supabase migrations committed to Git.

### Hosting
- Frontend: Cloudflare Pages or another verified static/PWA host with HTTPS.
- Backend: Supabase.
- Source control: GitHub.
- Email: evaluate Resend or a comparable transactional email provider; verify current free tier, terms, sender verification and regional delivery before choosing.

## Request flow
Browser/PWA → Supabase Auth → authenticated database access under RLS.
Scheduled Cron → secure Edge Function → due reminder jobs → email provider and Web Push service.
The browser never receives service-role keys, email API keys or VAPID private keys.

## Architecture principles
- Start as a modular frontend and Supabase backend; do not introduce a separate FastAPI server without a demonstrated requirement.
- Keep provider catalogue data separate from user subscription records.
- Store timestamps in UTC where appropriate and store the user's IANA timezone for scheduling/display.
- Use database migrations as the source of schema truth.
- Use typed API/data contracts.
- Keep external integrations behind narrow adapters.
- Design for observability and retry without leaking personal data.

## Key trade-offs
- Supabase free-tier limits and inactivity policies can change; verify current terms before launch.
- Web Push support differs by browser/OS. Never promise guaranteed delivery.
- Static PWA hosting does not remove the need for a backend scheduler.
- A browser timer cannot reliably send reminders when the app is closed.
