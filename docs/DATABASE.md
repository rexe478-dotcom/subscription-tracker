# Database Design

This is a logical starting schema. The Database Agent must validate constraints and generate reviewed SQL migrations before implementation.

## Tables

### `profiles`
- `id uuid primary key references auth.users(id)`
- `display_name text null`
- `default_currency char(3) not null`
- `timezone text not null` (IANA timezone)
- `created_at`, `updated_at timestamptz`

### `providers`
- `id uuid primary key`
- `name text not null`
- `slug text unique not null`
- `aliases text[]`
- `category text`
- `website_url text`
- `logo_asset_url text`
- `cancellation_url text`
- `metadata_source text`
- `last_verified_at timestamptz`
- `is_active boolean not null default true`

Provider catalogue rows are shared reference data, not user-owned.

### `subscriptions`
- `id uuid primary key`
- `user_id uuid not null references auth.users(id)`
- `provider_id uuid null references providers(id)`
- `custom_provider_name text null`
- `display_name text null`
- `category text`
- `amount numeric(12,2) not null`
- `currency char(3) not null`
- `billing_interval text not null`
- `interval_count integer not null default 1`
- `start_date date`
- `next_renewal_at timestamptz not null`
- `trial_start_at timestamptz null`
- `trial_end_at timestamptz null`
- `end_date date null`
- `status text not null`
- `cancellation_url text null`
- `notes text null`
- `reminder_enabled boolean not null default true`
- `reminder_lead_hours integer not null default 24`
- `created_at`, `updated_at timestamptz`

Constraints:
- Positive amount (or explicitly documented zero-value trial semantics).
- Valid ISO 4217 currency code.
- Valid status and billing interval.
- Either provider_id or custom_provider_name must identify the provider.
- `end_date` is not a substitute for `next_renewal_at`.
- Trial end must not precede trial start.
- Validate recurrence fields and date consistency.

### `push_subscriptions`
- `id uuid primary key`
- `user_id uuid not null`
- `endpoint text not null`
- `p256dh text not null`
- `auth_secret text not null`
- `created_at`, `last_success_at`, `disabled_at`
Store endpoint secrets securely; restrict reads and writes to the owner and trusted server operations. Never expose them in logs.

### `notification_jobs`
- `id uuid primary key`
- `user_id uuid not null`
- `subscription_id uuid not null`
- `event_type text not null` (`renewal` or `trial_end`)
- `channel text not null` (`push` or `email`)
- `scheduled_for timestamptz not null`
- `idempotency_key text unique not null`
- `status text not null` (`pending`, `processing`, `sent`, `failed`, `cancelled`)
- `attempt_count integer not null default 0`
- `last_error_code text null`
- `sent_at timestamptz null`
- `created_at`, `updated_at`

Do not store unnecessary provider response payloads or personal content.

### `subscription_events` (optional but recommended)
- `id uuid primary key`
- `user_id uuid not null`
- `subscription_id uuid not null`
- `event_type text not null`
- `metadata jsonb`
- `created_at timestamptz`

## RLS
- Enable RLS on every user-owned table.
- Users may select/insert/update/delete only rows where `user_id = auth.uid()`.
- Profile rows must be restricted to their owner.
- Provider catalogue is readable by authenticated users; writes are privileged/admin-only.
- Push subscription and notification-job operations should be narrowly controlled; privileged dispatch runs server-side.
- Test with two distinct users to prove isolation.

## Indexes
Consider indexes on:
- `subscriptions(user_id, status)`
- `subscriptions(user_id, next_renewal_at)`
- `notification_jobs(status, scheduled_for)`
- `notification_jobs(user_id, scheduled_for)`
- Unique idempotency key.
Validate with actual query plans before adding excessive indexes.

## Future household sharing
Do not implement in v1. Avoid hard-coding assumptions that prevent future `workspace_id`/membership ownership, but keep the first release's policies simple and user-scoped.
