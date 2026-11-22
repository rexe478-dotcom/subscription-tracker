# PWA and Deployment

## PWA requirements
- Web app manifest with name, short name, theme/background colours, start URL, scope, display mode and icon set.
- Service worker with safe cache strategy.
- HTTPS in production.
- Install prompt guidance and fallback instructions.
- Apple touch icon and iOS-specific install instructions.
- Offline shell or graceful offline message; do not imply unsaved data is synced.
- Version/update handling that avoids interrupting active user work.
- Deep links and route fallback configured on the host.

## Icons and splash assets
Create original app icon artwork from the approved brand mark. Export required sizes and maskable variants. Do not use an emoji as the app icon. Keep the source vector.

## Hosting proposal
- Frontend: Cloudflare Pages (verify current limits and terms).
- Backend: Supabase.
- Source: GitHub.
- Custom domain can be added later.
- Configure preview and production environments separately.

## Environment variables
Document public client variables separately from server secrets. Only public Supabase URL/anon key may be used client-side. All privileged keys remain server-side.

## Deployment safety
- Do not deploy without user approval.
- Do not create paid resources or purchase a domain without approval.
- Verify current pricing, free-tier inactivity policies, quotas and data region options.
- Provide rollback and database migration procedures.
