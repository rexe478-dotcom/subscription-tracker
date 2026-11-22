# Security and Privacy Requirements

## Secrets
- Never commit `.env`, service-role keys, email API keys, VAPID private keys or OAuth secrets.
- Provide `.env.example` with variable names only.
- Keep privileged operations in Edge Functions.
- Do not expose secrets through client-side environment variables or build output.
- Rotate any credential that is accidentally exposed.

## Authentication
- Use Supabase Auth email/password.
- Verify current recommended session handling and SDK patterns.
- Do not trust client-supplied user IDs; derive identity from verified auth context.
- Protect routes and handle expired sessions safely.

## Database
- RLS enabled on every user-owned table.
- Use least-privilege policies.
- Test cross-account isolation.
- Validate all inputs and constrain status/interval values.
- Use parameterized queries and safe SQL functions.
- Never disable RLS to make a feature work.

## External URLs
- Validate cancellation URLs as HTTPS URLs.
- Prevent unsafe schemes such as `javascript:`.
- Clearly identify external navigation.
- Do not claim a provider link is official unless verified and sourced.

## Privacy
- No bank connection.
- No Gmail integration in v1.
- Collect only data required for the product.
- Provide export and deletion.
- Avoid logging amounts, notes, email addresses or push endpoints unless strictly necessary.
- Document data retention and notification processing.

## Security verification
- Review OWASP risks for web apps and Supabase.
- Test authorization for every data operation.
- Review Edge Function authentication and rate limits.
- Verify CORS and redirect allowlists.
- Check dependency vulnerabilities and lockfile changes.
